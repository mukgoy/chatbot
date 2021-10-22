//chatbot/chatbot.js
var chatbotLive = (function(window){
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
      this.uid = userdata.id+"-07091997";
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
          let reply = JSON.parse(chatObject.reply);
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
      var msg = `flowid-1!dref-`+userdata.id+`!!jobid-`+bubbleVariables.jobId;
      this.sendMsg(msg, function(){
        console.log("msg send success", msg);
      });
    },
    sendMsg : function(msg, cb){
      firebase.database()
      .ref(`/prod/chatBot/user/${this.uid}/webbot/chat/${this.msgKey}/msg`)
      .set(msg).then((response) => {
        console.log("response after msg update :", response, msg);
        if(cb){
          cb();
        }
      });
    },
    onReply : function(reply) {
      if (reply.sound) {
        this.playSound(reply.sound);
      }
      if (reply.text) {
        this.sendTextMessage(reply);
      }
      if (reply.links) {
        this.sendLinks(reply);
      }
      if (reply.upload) {
        this.sendUploadMessage(reply);
      } 
      if (reply.attachment) {
        this.sendAttachmentMessage(reply);
      }
      if (reply.video) {
        this.sendVideoMessage(reply);
      }
      if (reply.feedback) {
        this.sendFeedbackMessage(reply);
      }
    },
    playSound : (function(soundType) {
      var reminderSound = new Audio("https://storage.googleapis.com/public_document/static/chat/mp3/reminderSound.mp3");
      return function(){
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

      botui.message.bot({
        delay: reply.delay || delay,
				loading: true,
        content: reply.text
      });
    },
    sendLinks : function(reply){
      if (((reply||{}).links||[]).length > 0) {
        var action = [];
        reply.links.forEach(function(link){
          action.push({
            text: link.title.toUpperCase(),
            value: link.payload
          })
          .then(function (res) {
            window.open(res.value,'_blank');
          });
        });
      }
    }
  }
})(window);





