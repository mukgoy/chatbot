//shared/datetime.js
(function(window) {
    'use strict';
    var dateTime = function(d = new Date()){
        return {
            getTimeStringLocal : function(){
                return d.getHours() +"-"+ d.getMinutes() +"-"+ d.getSeconds();
            },
            getTimeStringUTC : function(){
                return d.getUTCHours() +"-"+ d.getUTCMinutes() +"-"+ d.getUTCSeconds();
            },
            getTimeIntLocal : function(){
                return 60*60 * d.getHours() + 60 * d.getMinutes() + d.getSeconds();
            },
            getTimeIntUTC : function(){
                return 60*60 * d.getUTCHours() + 60 * d.getUTCMinutes() + d.getUTCSeconds();
            },
            getTime : function(){
                return parseInt(d.getTime()/1000);
            },
            getDay : function(){
                return d.getDay();
            },
        }
    }
    window.dateTime = dateTime;
})(window);