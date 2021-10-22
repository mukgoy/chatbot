//chatbot/chatbot-welcome.js
var loadingMsgIndex,
    botui = new BotUI('stars-bot'),
    API = 'https://api.github.com/repos/',
    delay = 500;
    UIConfig = bubbleVariables.chatButtonSetting;

function ChatbotWelcome(){

  var self = this;
  this.init = function() {
    botui.message.bot({
      delay: delay,
      content: UIConfig.welcomeMessage
    }).then(function(){
      self.checkPhoneRequired();
    });
  }

  this.checkPhoneRequired = function () {
    if(UIConfig.phoneQ){
      botui.message.bot({
        delay: delay,
        content: UIConfig.phoneQ
      }).then(function(){
        var phone = "";
        if((((userdata.value||{}).userPhoneColl||[])[0]||{}).phone){
          phone = userdata.value.userPhoneColl[0].phone;
        }
        return botui.action.text({
          delay: delay,
          action: {
            size: 30,
            icon: 'whatsapp',
            value: phone, // show the saved address if any
            placeholder: 'phone number'
          }
        })
      }).then(function(res){
        userdata.update({phone:res})
        .then(function(res){
          console.log("checkPhoneRequired");
          console.log(res);
          self.checkEmailRequired();
        });
        
      });
      return true;
    }
    self.checkEmailRequired();
  }

  this.checkEmailRequired = function () {
    if(UIConfig.emailQ){
      botui.message.bot({
        delay: delay,
        content: UIConfig.emailQ
      }).then(function(){
        var email = "";
        if((((userdata.value||{}).userEmailColl||[])[0]||{}).email){
          email = userdata.value.userEmailColl[0].email;
        }
        return botui.action.text({
          delay: delay,
          action: {
            size: 30,
            icon: 'envelope-o',
            value: email,
            placeholder: 'email',
            sub_type: 'email',
          }
        })
      }).then(function(res){
        userdata.update({email:res})
        .then(function(res){
          console.log(res);
          self.checkCouponCodeShow();
        });
      });
      return true;
    }
    checkCouponCodeShow();
  }

  this.checkCouponCodeShow = function () {
    if(UIConfig.couponCode){
      botui.message.bot({
        delay: delay,
        content: UIConfig.couponCode
      }).then(function(){
        self.checkActionBtnShow();
      });
      return true;
    }
    self.checkActionBtnShow();
  }

  this.checkActionBtnShow = function () {
    if(UIConfig.liveChat){
      botui.message.bot({
        delay: delay,
        content: "Thank you! Our live support is here to help you, would you like to connect?"
      })
      .then(function () {
        var ctaText = UIConfig.liveChatCtaText ? UIConfig.liveChatCtaText : "Connect to Live Support"; 
        return botui.action.button({
          delay: delay,
          addMessage: false, // so we could the address in message instead if 'Existing Address'
          action: [{
            text: ctaText,
            value: 'yes'
          }]
        });
      }).then(function(){
        var url = `https://jobalertbot.com/bot.php?jobId=`+bubbleVariables.jobId+`&userId=`+userdata.value.id+`&ref=flowid-1!dref-`+userdata.value.id+`!!jobid-`+bubbleVariables.jobId+`&loadingMessage=Connecting%20to%20Live%20Support`;
        console.log(url);
        chatbotLive.init(url);
        // window.location.href = url;
      });
    }else{
      botui.message.bot({
        delay: delay,
        content: "Thanks, please click on button below to connect with us on WhatsApp"
      })
      .then(function () {
        var ctaText = UIConfig.whatsappCtaText ? UIConfig.whatsappCtaText : "Connect to Whatsapp Support";
        return botui.action.button({
          delay: delay,
          addMessage: false, // so we could the address in message instead if 'Existing Address'
          action: [{
            text: ctaText,
            value: 'yes'
          }]
        });
      }).then(function(){
        var href = "https://api.whatsapp.com/send?phone=" + UIConfig.phoneNumber + "&text=" + encodeURI(UIConfig.defaultmsg);
        window.open(href,'_blank');
      });
    }
  };

}

var chatbotWelcome = new ChatbotWelcome();
chatbotWelcome.init();
