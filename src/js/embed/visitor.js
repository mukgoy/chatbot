//embed/visitor.js
var visitor = {};
var userAgent = new UserAgent().parse(navigator.userAgent);
channel.getStorageItem("visitor", function(request){
	if(request && request.value){
		visitor = request.value;
	}
	visitor.isMobile = userAgent.isMobile;
	visitor.device = userAgent.isMobile ? "mobile" : "desktop";
	visitor.browser = userAgent.browser;
	visitor.browserVersion = userAgent.browserVersion;
	visitor.operatingSystem = userAgent.os;
	visitor.platform = userAgent.platform;
	visitor.userAgent = userAgent.source;
	visitor.language = navigator.language;
	visitor.session = visitor.session || {};
	navigator.geolocation.getCurrentPosition(function(position){
		visitor.session.geolocation = position;
	});

	visitor.timeSpentTotal = visitor.timeSpentTotal || 0;
	visitor.visitCountTotal = visitor.visitCountTotal ? visitor.visitCountTotal+1 : 1;
	visitor.lastDateTime = visitor.dateTime ? visitor.dateTime : 0;

	visitor.session.timeIntLocal = dateTime().getTimeIntLocal();
	visitor.session.timeIntUTC = dateTime().getTimeIntUTC();
	visitor.session.dayIndex = dateTime().getDay();
	visitor.session.dateTime = dateTime().getTime();

	visitor.session.href = window.location.href.replace(/\/+$/, '');
	visitor.session.httpHost = location.hostname;
	visitor.session.requestUri = location.pathname+location.search;
	visitor.session.refererHttpHost = urlProperty(document.referrer, 'hostname');
	visitor.session.refererRequestUri = urlProperty(document.referrer, 'pathname');
	visitor.session.referrer = document.referrer;

	// console.log(visitor);
	channel.setStorageItem('visitor',visitor);
	httpPost({
		url : apiHost+'visitor/addOrUpdate',
		data: visitor
	}).then(function(response){
		// console.log(response);
	})
});



