//embed/channel.js
var channel = (function () {
    let options = {
        ...postmanOptions,
        loadIframe: true
    };
    return Postman(options);
})();