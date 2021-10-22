//embed/helper.js
function resize(w,h){
    channel.iframe.style['width'] = w+"px";
    channel.iframe.style['height'] = h+"px";
}
function toggleChatBox(isChatOpen){
    channel.iframe.classList.remove('isChatOpen');
    channel.iframe.classList.remove('isChatClose');
    var className = isChatOpen ? "isChatOpen" : "isChatClose";
    channel.iframe.classList.add(className);
}