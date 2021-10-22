//chatbot/vue.js
var UIConfig = bubbleVariables.chatButtonSetting;
var userId = 27290247;
var vm = new Vue({
  el: '#app',
  data: {
    UIConfig : UIConfig,
    userdata : userdata.value,
    isLiveChatStarted : false,
	  isChatOpen : false,
	  inputRequered : false,
	  userMsg : "",
    botUrl : "/bot-welcome.html",
    whatsappLink : "https://api.whatsapp.com/send?phone=" + UIConfig.phoneNumber + "&text=" + encodeURI(UIConfig.defaultmsg),
    image : {
			whatsapp : "https://storage.googleapis.com/static.intelliassist.co/images/social/whatsapp.png",
			facebook : "https://storage.googleapis.com/static.intelliassist.co/images/social/facebook.png",
			instagram : "https://storage.googleapis.com/static.intelliassist.co/images/social/instagram.png",
			messenger : "https://storage.googleapis.com/static.intelliassist.co/images/social/messenger.png",
			phone : "https://storage.googleapis.com/static.intelliassist.co/images/social/phone.png",
			twitter : "https://storage.googleapis.com/static.intelliassist.co/images/social/twitter.png",
			youtube : "https://storage.googleapis.com/static.intelliassist.co/images/social/youtube.png",
			email : "https://storage.googleapis.com/static.intelliassist.co/images/social/email.png",
		},
  },
  methods : {
    toggleChatBox : function () {
      this.isChatOpen = !this.isChatOpen;
      channel.callFn("toggleChatBox", [this.isChatOpen], function () {
        // console.log("resize-callback");
      });
    },
    sendMsg : function () {
      let userMsg = this.userMsg;
      botui.message.human({
        delay: delay,
        content: userMsg
      });
      chatbotLive.sendMsg(userMsg, function(){
        console.log("msg send success", userMsg);
      });
      this.userMsg = "";
    },
 },
});
