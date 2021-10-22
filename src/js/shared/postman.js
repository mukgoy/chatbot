//shared/postman.js
function Postman(opts){
	{
		opts.path = opts.path || "";
		var iframe = null;
		var	isIframeReady = opts.loadIframe ?  false : true;
		var	queue = [];
		var	requests = {};
		var	callback_id = 0;
	}

	var sendRequest = function(data){
		if (!isIframeReady) {
			queue.push(data);
			return;
		}
		if (iframe) {
			requests[data.request.callback_id] = data;
			if(opts.loadIframe){
				// console.log("page to chatbot postMessage", window, iframe);
				iframe.contentWindow.postMessage(JSON.stringify(data.request), opts.origin);
			}
			else{
				// console.log("chatbot to page postMessage", window, parent);
				parent.postMessage(JSON.stringify(data.request), "*");
			}
		}
	};

	var onIframeLoaded = function(){
		isIframeReady = true;
		if (queue.length) {
			for (var i=0, len=queue.length; i < len; i++){
				sendRequest(queue[i]);
			}
			queue = [];
		}
	};

	var _handleMessage = function(event){
		// console.log(event.origin , opts.origin);
		if (!opts.loadIframe || event.origin === opts.origin) {
			var request = event.data;
			if(typeof event.data == 'string'){
				request = JSON.parse(event.data);
			}
			
			if (request.type == 'get') {
				value = localStorage.getItem(request.key);
				event.source.postMessage(JSON.stringify({
					callback_id: request.callback_id,
					key:request.key,
					value: JSON.parse(value)
				}), event.origin);
			} 
			else if (request.type == 'set') {
				localStorage.setItem(request.key, JSON.stringify(request.value));
			} 
			else if(request.type == 'remove') {
				localStorage.removeItem(request.key);
			}
			else if (request.type == 'callFn') {//on direct call from iframe
				var value = eval(request.fn).call(null,...request.params);
				event.source.postMessage(JSON.stringify({
					callback_id: request.callback_id,
					value: value
				}), event.origin);
			}
			else if (request.callback_id && typeof requests[request.callback_id] != 'undefined') {// call for callback
				if (typeof requests[request.callback_id].callback === 'function') {
					requests[request.callback_id].callback(request);
				}
				delete requests[request.callback_id];
			}
		}
	}

	if (!iframe) {//Init
		iframe = document.createElement("iframe");
		iframe.classList.add("isChatClose");
		iframe.style.display = "none"; 
		if(opts.loadIframe){
			document.body.appendChild(iframe);
		}
		if (window.addEventListener) {
			iframe.addEventListener("load", function(){ onIframeLoaded(); }, false);
			window.addEventListener("message", function(event){ _handleMessage(event) }, false);
		}else if (iframe.attachEvent){
			iframe.attachEvent("onload", function(){ onIframeLoaded(); }, false);
			window.attachEvent("onmessage", function(event){ _handleMessage(event) });
		}
		iframe.src = opts.origin + opts.path;
		
	}

	var obj = {};
	obj.iframe = iframe;
	obj.callFn = function(fn, params , callback){
		var request = {
				callback_id: ++callback_id,
				type: 'callFn',
				fn: fn,
				params: params
			};
		sendRequest({
			request: request,
			callback: callback
		});
	};
	obj.getStorageItem = function(key, callback){
		var request = {
			callback_id: ++callback_id,
			type: 'get',
			key: key
		}
		sendRequest({
			request: request,
			callback: callback
		});
	};
	obj.setStorageItem = function(key, value, callback){
		var request = {
			callback_id: ++callback_id,
			type: 'set',
			key: key,
			value: value
		}
		sendRequest({
			request: request,
			callback: callback
		});
	};
	obj.removeStorageItem = function(key, callback) {
		var request = {
			callback_id: ++callback_id,
			type: 'remove',
			key: key
		}
		sendRequest({
			request: request,
			callback: callback
		});
	};

	return obj;
}