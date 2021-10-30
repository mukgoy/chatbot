var templates = {
    downloadCard : function(title,subtitle,url){
        return `<div class='container'>
            <div class='row'>
                <div class='card'>
                    <div class='card-body'>
                        <h5 class='card-title'> ${title}  </h5>
                        <h6 class='card-subtitle mb-2 text-muted'>${subtitle}</h6>
                        <div class='custom-container text-container'>
                            <p class='card-text'><b><a href='${url}'>Download</a></b></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    },
    jobDescriptionCard  : function(title,subtitle){
        return `<div class='container'>
            <div class='row'>
                <div class='card'>
                    <div class='card-body'>
                        <h5 class='card-title'>${title}</h5>
                        <h6 class='card-subtitle mb-2 text-muted'>${subtitle}</h6>
                    </div>
                </div>
            </div>
        </div>`
    },
    sharelinkCard : function(title,subtitle,url,button){
        var facebookShareUrl = "https://www.facebook.com/sharer/sharer.php?app_id=909517969170204&sdk=joey&u=" + url;
        var linkedinShareUrl = "https://www.linkedin.com/shareArticle?url=" + url;
        var whatsappShareUrl = "https://api.whatsapp.com/send?text=" + url
        var twitterShareUrl = "https://twitter.com/intent/tweet?url=" + url;
        var gplusShareUrl = "https://plus.google.com/share?url=" + url;

        return `<div class='container'>
                <div class='row'>
                    <div class='card' style='width: 18rem;'>
                        <div class='card-body'>
                            <h5 class='card-title'>${title}</h5>
                            <h6 class='card-subtitle mb-2 text-muted'>${subtitle}</h6>
                            <div class='custom-container text-container'>
                                <p class='card-text'><b><a href='${url}' target='_blank'>${button}</a></b></p>
                                <p class='card-text'><b>Share This Job</b></p>
                                <div class='container-fluid'>
                                    <div class='row'>
                                        <a target='_blank' class='btn btn-link p-2 fb' href='${facebookShareUrl}'> 
                                            <i class='fa fa-whatsapp'></i> 
                                        </a>
                                        <a target='_blank' class='btn btn-link p-2 tw' href='${twitterShareUrl}'> 
                                            <i class='fa fa-twitter'></i> 
                                        </a>
                                        <a target='_blank' class='btn btn-link p-2 in' href='${linkedinShareUrl}'> 
                                            <i class='fa fa-linkedin'></i> 
                                        </a>
                                        <a target='_blank' class='btn btn-link p-2 wa' href='${whatsappShareUrl}'>
                                            <i class='fa fa-whatsapp'></i> 
                                        </a>
                                        <a target='_blank' class='btn btn-link p-2 gp' href='${gplusShareUrl}'> 
                                            <i class='fa fa-google-plus'></i> 
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
}