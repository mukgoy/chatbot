//shared/util.js
function dateToTimeString(date){
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return hours + ":" + minutes + ":" + seconds;
}
function getDayName(index){
    var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[index];
}
function urlProperty (url, field){
    if(url){
        var el = document.createElement('a');
        el.href = url;
        return el[field];
    }
    return '';
}
function httpPost(options){
    return new Promise(function(resolve, reject){
        var formdata = new FormData();
        for (var key in options.data) {
            formdata.append(key, options.data[key]);
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', options.url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function(){
            resolve(this.responseText);
        };
        xhr.send(JSON.stringify(options.data));
    });
}
function addStyleSheet(fileName) {
    var head = document.head;
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;
    head.appendChild(link);
}
function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}