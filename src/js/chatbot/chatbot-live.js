//chatbot/chatbot-live.js
var chatbotLive = (function(window){
  var docType;
  return {
    init : function(url){
      let self = this;
      this.visitor = JSON.parse(localStorage.getItem("visitor")) || {};
      // botui.message.removeAll();
      var config = {
        apiKey: "AIzaSyA-Va_DlXLctlJ_4Wox5ZCavgRiTswQN_E",
        authDomain: "getwalkinapp.firebaseapp.com",
        databaseURL: "https://getwalkinapp.firebaseio.com/",
        storageBucket: "getwalkinapp.appspot.com"
      };
      firebase.initializeApp(config);
      this.uid = userdata.value.id+"-07091997";
      this.msgKey = Date.now();
      this.url = url;

      firebase.database()
      .ref(`/prod/chatBot/user/${this.uid}/webbot/chat`)
      .limitToLast(1)
      .on(('value'), function (snapshot) {
        let response = snapshot.val();
        let msgTimeStamp = Object.keys(response)[0];
        let chatObject = response[msgTimeStamp];

        if (chatObject.reply) {
          console.log(chatObject.reply);
          let reply = JSON.parse(chatObject.reply);
          console.log(reply);
          reply.forEach(element => {
            self.onReply(element);
          });
        }

        console.log(chatObject);
        vm.inputRequered = true;
      });

      this.sendWelcomeMsg();
    },
    sendWelcomeMsg : function(){
      var msg = `flowid-1!dref-`+userdata.value.id+`!!jobid-`+bubbleVariables.jobId;
      this.sendMsg(msg, function(){
        console.log("msg send success", msg);
      });
    },
    sendMsg : function(msg, cb){
      firebase.database()
      .ref(`/prod/chatBot/user/${this.uid}/webbot/chat/${this.msgKey}/msg`)
      .set(msg).then((response) => {
        console.log("response after msg update :" , msg);
        if(cb){
          cb();
        }
      });
    },
    onReply : function(reply) {
      console.log("reply",reply);
      if (reply.sound) {
        this.playSound(reply.sound);
      }
      else if (reply.text) {
        this.sendTextMessage(reply);
      }
      else if (reply.links) {
        this.sendLinks(reply);
      }
      else if (reply.upload) {
        this.sendUploadMessage(reply);
      } 
      else if (reply.attachment) {
        this.sendAttachmentMessage(reply);
      }
      else if (reply.video) {
        this.sendVideoMessage(reply);
      }
      else if (reply.feedback) {
        this.sendFeedbackMessage(reply);
      }
    },
    playSound : (function() {
      var reminderSound = new Audio("https://storage.googleapis.com/public_document/static/chat/mp3/reminderSound.mp3");
      return function(soundType){
        switch (soundType) {
          case "reminderSound":
            reminderSound.play();
            break;
        }
      }
    })(),
    sendTextMessage : function(reply){
      if (this.visitor.isMobile && reply.mobile != null) {
        reply.text = reply.mobile;
      }else if(reply.web != null){
        reply.text = reply.web;
      }
    
      reply.text = reply.text.replace(/\n/g, "<br>");
      reply.text = linkify(reply.text);

      if(reply.bookmark){
        this.sendBookmarks(reply);
      }
      if(reply.checkbox){
        this.sendCheckbox(reply);
      }

      botui.message.bot({
        delay: reply.delay || delay,
				loading: true,
        content: reply.text
      });

      if(reply.feedback){
        this.sendFeedbackMessage(reply);
      }
      if(reply.links){
        this.sendLinks(reply);
      }
      
      this.sendQuickReplies(reply);
      
    },
    sendLinks : function(reply){
      if (((reply||{}).links||[]).length > 0) {
         var action = reply.links.map(function(link){
            return {
              text: link.title.toUpperCase(),
              value: link.payload
            };
        });
        return botui.action.button({
          delay: delay,
          action: action
        })
        .then(function (res) {
          window.open(res.value,'_blank');
        });
      }
    },
    sendVideoMessage : function(reply){
      botui.message.add({
        type: 'embed', // this is 'text' by default
        content: reply.video
      });
    },
    sendFeedbackMessage : function(reply){
      let self = this;
      console.log("feedback-bot",reply);
      botui.action.button({
        delay: delay,
        loading: false,
        action: [
          {
            text: "👍🏻",
            value: "positive"
          },
          {
            text: "👎🏻",
            value: "negative"
          }
        ]
      }).then(function(feedback){
        console.log(feedback);
        reply.feedback.userFeedback = feedback;
        self.httpUpdateAgentFeedback(reply);
      })
      
      
    },
    sendBookmarks : function(reply){
      if (reply.bookmark) {
        let bookmarkButtonText = "<br>";
        let bookmarkId = reply.bookmark.bookmarkId;
        let bookmarkType = reply.bookmark.bookmarkType;
        bookmarkButtonText += `<button class='bookmarkButton ${bookmarkType == "add" ? "addBookmark" : "removeBookmark"} ${bookmarkId}Button botui-actions-buttons-button' id='${bookmarkId}' onclick="chatbotLive.httpUpdateBookmark(this)">
        <label class="${bookmarkId}Label" style="display:contents">${bookmarkType == "add" ? "Add Bookmark" : "Remove Bookmark"}</label>
    </button>`;
        reply.text += bookmarkButtonText;
      }
      
    },
    sendCheckbox : function(reply){
      let timestamp = Date.now();
      let checkText = "<br>";
      if (reply.checkbox != null) {
				let checkboxes = reply.checkbox;
				for (let j = 0; j < checkboxes.length; j++) {
					checkText += `<br>\n<input type='checkbox' id='${j}' name='checkbox' class='checkbox ${timestamp}' value='${checkboxes[j].payload}'>
              <label style="padding-left: 8px;">${checkboxes[j].title}</label>`;
				}
				checkText += `<br><br><input type='submit' value="OK ✅" onclick='chatbotLive.httpUpdateCheckbox(${timestamp})'>`;
        reply.text += checkText;
			}
    },
    sendAttachmentMessage : function(reply){
      if(reply.attachment.type == "image"){
        let altText = reply.attachment.payload.altText;
        altText = altText == null ? "" : altText;
        let imageUrl = reply.attachment.payload.url;
        botui.message.add({
            content: `![${altText}](${imageUrl})`
        });
      }
      else if(reply.attachment.type == "document"){
        let docUrl = reply.attachment.payload.url;
        botui.message.add({
          type: 'embed', // this is 'text' by default
          content: docUrl
        });
      }
      else if(reply.attachment.type == "template"){
        let title = reply.attachment.payload.elements[0].title;
        let subtitle = reply.attachment.payload.elements[0].subtitle == null ? "" : reply.attachment.payload.elements[0].subtitle;
        let url = reply.attachment.payload.elements[0].default_action.url;
        let content = "";
        if (title.includes("android app")) {
          content = templates.downloadCard(title,subtitle,url);
        }else if(url == "jobDescriptionCard"){
          content = templates.jobDescriptionCard(title,subtitle);
        }else{
          let button = "View Details";
          if (reply.attachment.payload.elements[0].buttons[1] != null) {
            button = reply.attachment.payload.elements[0].buttons[1].title;
          }
          content = templates.sharelinkCard(title,subtitle,url,button);
        }
        botui.message.bot({
          delay: delay,
          content: content
        });
      }
    },
    sendUploadMessage : function(reply){
      botui.message.add({
        delay: delay,
				loading: true,
        content: JSON.stringify(reply)
      });
    },
    sendQuickReplies : function(reply){
      var self = this;
      var quickReplies = [];
      if (reply.quick_replies) {
        quickReplies = reply.quick_replies;
      } else if (reply.quickReplies) {
        quickReplies = reply.quickReplies;
      } else if (reply.quickText) {
        quickReplies = reply.quickText;
      }
      if(quickReplies.length > 0){
        var actions = [];
        for (var i = 0; i < quickReplies.length; i++) {
					actions.push({
						text: quickReplies[i].title,
						value: quickReplies[i].payload
					});
				}
        botui.action.button({
					delay: delay,
					action: actions
				}).then(function (msg) {
					return self.sendMsg(msg.value);
				});
      }
    },
    sendUploadMessage : function(sendableMsg) {
      if (sendableMsg.upload == "startSubscription") {
        if (Notification.permission === 'granted' || Notification.permission === 'denied') {
          return;
        }
        botui.message.add({
          human: true,
          content: sendableMsg.displayText + "<br><br> <span style='font-size:9px'>" + convertToDateTime(Date.now()) + "</span>"
        }).then(function () {
          template = template.replace("Click ALLOW to show notifications", sendableMsg.displayText);
  
          let jobId = null;
          if (ref != "") {
            "flowid-1!dref-27431016!!jobid-14197392"
            
            let jobIdInRef = ref.substring(ref.indexOf('-') + 1, ref.indexOf('-') + 1 + 8);
            if (jobIdInRef != null && jobIdInRef != "") {
              jobId = jobIdInRef;
            }
          }
          startPushNotification();
        });
      } 
      else if (sendableMsg.upload == "switchToNewUser") {
        window.location.href = sendableMsg.url;
      } 
      else {
        docType = sendableMsg.upload;
      }
    },
    startPushNotification : function() {
      isIncognito(function (itIs) {
        if (itIs) {
          return;
          console.log("You are in incognito mode");
        } else {
          console.log("You are NOT in incognito mode");
        }
      });
  
      if (Notification.permission === 'granted' || Notification.permission === 'denied') {
        return;
      }
  
      function goToFullScreen() {
  
        if (isChrome && rootElement) {
          rootElement.parentNode.removeChild(rootElement);
          rootElement = null;
          let wait = () => {
            if (!canStart) {
              return setTimeout(wait, 500);
            }
          };
          wait();
          checkSubscription();
        }
      }
  
  
      document.querySelector('html').addEventListener('click', goToFullScreen);
      document.querySelector('html').addEventListener('keydown', goToFullScreen);
  
      if (isChrome) {
        rootElement = document.createElement('div');
        rootElement.innerHTML = template;
        document.body.appendChild(rootElement);
      }
      startSubscritionJS(null, user, httpHost, lastBotReply);
    },
  
    httpUpdateAgentFeedback : function(reply){
      console.log(reply);
      let body = {
        projectId: reply.feedback.projectId,
        intentAction: reply.feedback.intentAction
      }
      if (reply.feedback.userFeedback.value == "positive") {
        body.positiveFeedback = 1;
      } else if (reply.feedback.userFeedback.value == "negative") {
        body.negativeFeedback = 1;
      } else {
        return;
      }

      let url = apiHost + "agentResponse/updateAgentFeedback";
      axios.post(url, body)
      .then(function (response) {
        botui.message.add({
          delay : delay,
          content: "Thanks for the feedback!"
        });
      })
      .catch(function (error) {
          console.log(error);
      });

    },
    httpUpdateBookmark : function(element){
      console.log(element);
      if (element.classList.contains("addBookmark")) {
        let url = apiHost + "bookmarks/addOrUpdate";
        axios.post(url, {"resourceId" : element.id, "uid" : this.uid})
        .then(function (response) {
          console.log(response);
          afterResponse(element, true);
        })
        .catch(function (error) {
            console.log(error);
            afterResponse(element, true);
        });
      }
      else{
        let url = apiHost + `bookmarks/delete?resourceId=${element.id}&uid=${this.uid}`;
        axios.get(url)
        .then(function (response) {
          afterResponse(element, false);
        })
        .catch(function (error) {
            console.log(error);
            afterResponse(element, false);
        });
      }
      function afterResponse(element, isAddBookmark){
        var lebel = document.getElementsByClassName(`${element.id}Label`)[0];
        var button = document.getElementsByClassName(`${element.id}Button`)[0];
        if(isAddBookmark){
          lebel.innerHTML = "Remove Bookmark";
          button.classList.remove("addBookmark");
          button.classList.add("removeBookmark");
        }else{
          lebel.innerHTML = "Add Bookmark";
          button.classList.remove("removeBookmark");
          button.classList.add("addBookmark");
        }
      }
    },
    httpUpdateCheckbox : function(checkboxId){
      console.log(checkboxId);
      let checkboxValues = $(`.${checkboxId}:checked`).map(function () {
        return this.value;
      }).get().join(',');
      console.log(checkboxValues);
      if (checkboxValues == "") {
        alert("Select atleast one !");
      } else {
        botui.message.add({
          delay: 1,
          loading: false,
          human: true,
          content: checkboxValues
        });
        this.sendMsg(checkboxValues);
      }
    },
    httpPrepareUpload : function(element) {
      let docName = docType;
      let docTypeToBeUploaded = docName;
  
      console.log("docName :", docName);
      console.log("docType :", docType);
      console.log("SenderId :", this.uid);
  
  
      var files = element.files;
      console.log("files length : ", files.length);
      console.log("files : ", files);
  
  
      console.log(files[0].size);
      console.log(files[0].type);
      console.log(files[0].name);
  
      let fileExtension = files[0].name.substring(files[0].name.indexOf('.') + 1);
      console.log("fileExtension :", fileExtension);
  
      if (fileExtension != null) {
        docName = docName + "." + fileExtension;
        console.log("docName after appending : ", docName);
      }
  
  
      if (files[0].size > 5300000 || (files[0].type != "application/pdf" && files[0].type != "image/jpeg" && files[0].type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && files[0].type != "application/msword" && files[0].type != "image/png")) {
        alert("Invalid File !\n Kindly choose only pdf, image or doc file with maximum size 5mb.");
        return submit("No");
      }
  
      //files=document.getElementById('file');
  
      botui.message.add({
        delay: 4000,
        loading: true,
        human: false,
  
      });
  
      let unique = this.uid;
      if (unique == "" || unique == null) {
        unique = Date.now().toString();
      }
  
      let formDataRequest = new FormData();
      $.each(files, function (key, value) {
        formDataRequest.append('file', $('#file')[0].files[0], unique.concat("-" + docName));
      });
      $.ajax({
        url: '/API/uploadToGcloud.php?file',
        type: 'POST',
        data: formDataRequest,
        cache: false,
        processData: false, // Don't process the files
        contentType: false,
        success: function (response) {
          //console.log(response);
          //response contains filepath
          //alert( `${docTypeToBeUploaded} uploaded successfully 😊`);
  
          sendMessageToSlack({
            userName: 'bot.php',
            recipient: 'bot-attachments',
            text: `${uid}, on webbot,\nuploaded a file on S3 url : ${response}`
          }, "");
  
          /*botui.message.add({
            delay: 2000,
            loading: true,
            human : false,
            content : `${docTypeToBeUploaded} uploaded successfully 😊`
          });
            */
  
          submit(response.trim());
          hideAttach();
          showText();
          $('#file').val('');
  
        },
        error: function (response) {
          alert("Error : ", response);
          submit("No");
          $('#file').val('');
        }
      });
  
    },
  
    test : function(index){
      let reply = [
        {
          "text": "Hi This is a Text Message !"
        },
        {
          "text": "This Message should ring a sound !",
          "sound": "reminderSound"
        },
        {
          "text": "Next Message is a video message."
        },
        {
          "video": "https://youtu.be/qkxuFKqJXWY"
        },
        {
          "text": "This Message should have Feedback Buttons at Bottom 👍🏻👎🏻",
          "feedback": {
            "intentAction": "WeedingOutRules",
            "projectId": "national-test-agency"
          }
        },
        {
          "text": "Next Message is an Image !"
        },
        {
          "attachment": {
            "type": "image",
            "payload": {
              "altText": "Alternate Text",
              "url": "https://miro.medium.com/max/1400/1*MAsNORFL89roPfIFMBnA4A.jpeg"
            }
          }
        },
        {
          "text": "Next Message is a Document !"
        },
        {
          "attachment": {
            "type": "document",
            "payload": {
              "url": "https://www.parkinson.org/sites/default/files/attachments/Parkinsons-Disease-Frequently-Asked-Questions.pdf"
            }
          }
        },
        {
          "text": "Next Message is a Card !"
        },
        {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "sharable": true,
              "elements": [
                {
                  "title": "Immediate Joining For Jr.Dialysis Technician@ Haryana",
                  "subtitle": "Deep chand dialysis centre",
                  "buttons": [
                    {
                      "type": "web_url",
                      "url": "https://skillmap.ai/jd/14174261",
                      "title": "View Details"
                    },
                    {
                      "type": "postback",
                      "payload": "jobid-14174261",
                      "title": "Apply"
                    }
                  ],
                  "default_action": {
                    "type": "web_url",
                    "url": "https://skillmap.ai/jd/14174261"
                  }
                }
              ]
            }
          }
        },

        {
          "text": "Next Message is a Link Button Message !"
        },
        {
          "text": "Guide To Parkinsons",
          "links": [
            {
              "title": "View Document1",
              "payload": "https://www.parkinson.org/sites/default/files/attachments/Parkinsons-Disease-Frequently-Asked-Questions.pdf"
            },
            {
              "title": "View Document2",
              "payload": "https://www.parkinson.org/sites/default/files/attachments/Parkinsons-Disease-Frequently-Asked-Questions.pdf"
            }
          ]
        },
        {
          "text": "Next Message On Web should be ABCD and on Mobile should be 1234 !"
        },
        {
          "text": "ABCD",
          "mobile": "1234"
        },
        {
          "text": "TEXT",
          "mobile": "MOBILE",
          "web": "WEB"
        },
        {
          "text": "Next Line \n Message Check 1 \n 2 \n 3 <b> A <br> B"
        },
        {
          "text": "Hyperlink Check https://jobalertbot.com/bot.php"
        },
        {
          "text": "Hyperlink Check https://jobalertbot.com/bot.php"
        },
        {
          "text": "Bookmark Button is next"
        },
        {
          "text": "<b>Test</b>",
          "links": [
            {
              "title": "View",
              "payload": "https://abcd.com"
            }
          ],
          "bookmark": {
            "bookmarkId": "test",
            "bookmarkType": "add"
          }
        },
        {
          "text": "Checkbox Message"
        },
        {
          "text": "Tick Tick",
          "checkbox": [
            {
              "payload": "one",
              "title": "1"
            },
            {
              "payload": "two",
              "title": "2"
            },
            {
              "payload": "three",
              "title": "3"
            }
          ]
        },
        {
          "text": "Delayed Message"
        },
        {
          "text": "Loaded",
          "delay": 5000
        },
        {
          "text": "Quick Text Message"
        },
        {
          "text": "Message with Quick Replies",
          "quickReplies": [
            {
              "payload": "one",
              "title": "1"
            },
            {
              "payload": "two",
              "title": "2"
            },
            {
              "payload": "three",
              "title": "3"
            }
          ]
        },
        {
          "text": "Upload Message"
        },
        {
          "upload": "Resume"
        }
      ];
      console.log(index);
      console.log(reply[index]);
      this.onReply(reply[index]);
    },

    
  }
})(window);




console.log(chatbotLive);
chatbotLive.init("url");


