var Replacement = (function(){
	var PUBLIC={};
    var config={
        url:'demo/data.json'
    };

   PUBLIC.parseGET = function(url){
        utm_keys=config.utm_keys;
        if(!url || url == '') url = decodeURI(document.location.search);
        if(url.indexOf('?') < 0) return {};

        var GET = {},
            OTHER = [],
            params = [],
            key = [],
            split=[],
            new_url;

        split = url.split('?');
        new_url=window.location.pathname;
        url = split[1];


        if(url.indexOf('#')!=-1){
            url = url.substr(0,url.indexOf('#'));
        }
        if(url.indexOf('&') > -1){ params = url.split('&');} else {params[0] = url; }

        var r,z;
        for (r=0; r<params.length; r++){
            for (z=0; z<utm_keys.length; z++){
                if(params[r].indexOf(utm_keys[z]+'=') > -1){
                    if(params[r].indexOf('=') > -1) {
                        key = params[r].split('=');
                        GET[key[0]]=key[1];
                    }
                }
            }

            //
            key = params[r].split('=');
            if(utm_keys.indexOf(key[0])==-1) {
                OTHER.push(params[r]);
            }
        }
        if(OTHER.length) new_url+='?'+OTHER.join('&');
        if(window.location.hash) new_url+=window.location.hash;
        if(config.utm_redirect) window.history.pushState(window.history.state, '', new_url);
        return (GET);
    };

    PUBLIC.init = function(init_config) {
        if(typeof $ == 'undefined') {console.error('Replacement needs a JQuery, but it\'s not found'); return false;}
        config = $.extend({}, config, init_config);
    };

	return PUBLIC;
})();
