var userdata = new (function(){

        var _value = JSON.parse(localStorage.getItem("userdata")) || {};
        Object.defineProperty(this,"value",{
            get: function() { return _value; },
            set: function(value) {
                console.log(value);
                _value = value;
                save();
            }
        });

        this.update = function(newdata){
            var newDataKey = Object.keys(newdata);
            if(newDataKey=='phone'){
                _value.userPhoneColl = [{
                    "phone": newdata[newDataKey].value
                }]
            }
            if(newDataKey=='email'){
                _value.userEmailColl = [{
                    "email": newdata[newDataKey].value
                }]
            }
            return save();
        }
        function save(){
            localStorage.setItem("userdata", JSON.stringify(_value));
            var body = {
                orgId: bubbleVariables.orgId,
                flowStatus : {
                    "flowId": 1,
                    "walkinId": bubbleVariables.jobId,
                    "client": "webbot",
                    "orgId": bubbleVariables.orgId,
                    "flowStatus": "initiated"
                },
                _value
            };

            var theUrl = "https://api.hrbot.co/walkinapp/api/userSvc/v2/addUpdateUser";
            return axios.post(theUrl, body)
            .then(function (response) {
                return _value;
            })
            .catch(function (error) {
                console.log(error);
            });
        }

})();

/* 
var userdata = {
    data : JSON.parse(localStorage.getItem("userdata")) || {},
    get value(){
        return this.data
    },
    set value(data){
        localStorage.setItem("userdata", JSON.stringify(data));
        this.data = data;
    },
    update(newdata){
        var newDataKey = Object.keys(newdata);
        var body = {
            orgId: bubbleVariables.orgId,
            flowStatus : {
                "flowId": 1,
                "walkinId": bubbleVariables.jobId,
                "client": "webbot",
                "orgId": bubbleVariables.orgId,
                "flowStatus": "initiated"
            }
        };
        if(userdata.value.id){
            body.id = userdata.value.id;
        }
        if((((userdata.value||{}).userPhoneColl||[])[0]||{}).phone || newDataKey=='phone'){
            body.userPhoneColl = [{
                "phone": newDataKey=='phone' ? newdata[newDataKey].value : userdata.value.userPhoneColl[0].phone
            }]
        }
        if((((userdata.value||{}).userEmailColl||[])[0]||{}).email || newDataKey=='email'){
            body.userEmailColl = [{
                "email": newDataKey=='email' ? newdata[newDataKey].value : userdata.value.userEmailColl[0].email
            }]
        }
    
        var theUrl = "https://api.hrbot.co/walkinapp/api/userSvc/v2/addUpdateUser";
        return axios.post(theUrl, body)
        .then(function (response) {
            userdata.value = response.data.response;
            // console.log(userdata.value);
            return userdata.value;
        })
        .catch(function (error) {
            console.log(error);
        });
    }
};
 */