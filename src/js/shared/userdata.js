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
                ..._value
            };

            var theUrl = apiHost + "userSvc/v2/addUpdateUser";
            return axios.post(theUrl, body)
            .then(function (response) {
                _value = response.data.response;
                localStorage.setItem("userdata", JSON.stringify(_value));
                return _value;
            })
            .catch(function (error) {
                console.log(error);
            });
        }

})();