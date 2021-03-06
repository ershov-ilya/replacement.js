﻿var Replacement = (function(){
    var DEBUG=false,
	PUBLIC={},
    config={
        url:'data.json',
        utm_keys:['city'],
        skip_empty: true
    };

    var GET={},
    DATA={},
    CONTEXT={},
    key,index;

    function request(){
        if (DEBUG) console.log('Загружаем новые данные');
        $.ajax({
            url:config.url,
            id:0
        }).success(function(response){
            if(DEBUG) console.log('parseAnswer()');
            if(typeof response == 'string') response=JSON.parse(response);
            DATA=response;
            save();
            findContext();
            $(document).trigger('Replacement.DataLoaded');
        });
    }

    function save(){
        var str=JSON.stringify(DATA);
        localStorage['replacement-data']=str;
        var time=new Date().getTime();
        localStorage['replacement-time']=time;
    }

    function load(){
        if (DEBUG) console.log('Используем старые данные');
        DATA=JSON.parse(localStorage['replacement-data']);
        findContext();
        $(document).trigger('Replacement.DataLoaded');
    }

    function findContext(){
        if(DEBUG) console.log('findContext()');
        for(k in DATA){
            if(typeof DATA[k][index] != 'undefined'){
                if(DATA[k][index]==GET[key]){
                    CONTEXT=DATA[k];
                }
            }
        }
        if(DEBUG) {
            console.log('CONTEXT:');
            console.log(CONTEXT);
        }
    }

    function replacement(){
        if(DEBUG) console.log('replacement()');
        // CONTEXT select

        // Parsing CONTEXT
        var map = config.map;
        for(k in map){
            if(typeof CONTEXT[map[k]] == 'undefined') continue;
            if(config.skip_empty && CONTEXT[map[k]] == '') continue;
            if(DEBUG) console.log(k+' : '+CONTEXT[map[k]]);
            $(k).html(CONTEXT[map[k]]);
        }
        if(DEBUG) console.log('replacement() finish');

        $(document).trigger('Replacement.done');
    }

    function parseGET (url){
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

    function parseDependence(){
        if(typeof config.dependence != 'undefined'){
            var arr = config.dependence;
            config.utm_keys=[];
            for(k in arr){
                config.utm_keys.push(k);
                key=k;
                index=config.dependence[key];
            }
        }
    }

    PUBLIC.getDataKeys=function(){
        var result=[];
        for(k in DATA){
            result.push(DATA[k][index]);
        }
        return result;
    };

    PUBLIC.test=function(){
        if(!DEBUG) return false;
        console.log('config array:');
        console.log(config);
        console.log('utm_keys array:');
        console.log(utm_keys);
        console.log('GET array:');
        console.log(GET);
        console.log('DATA array:');
        console.log(DATA);

        return true;
    };

    PUBLIC.init = function(init_config) {
        $(document).on('Replacement.DataLoaded',replacement);
        var need_refresh=false;
        if(typeof $ == 'undefined') {console.error('Replacement needs a JQuery, but it\'s not found'); return false;}
        config = $.extend({}, config, init_config);
        parseDependence();
        GET=parseGET();
        if($.isEmptyObject(GET)){
            // Load
            if(typeof localStorage['replacement-get'] != 'undefined'){ GET = JSON.parse(localStorage['replacement-get']);}
        }else{
            // Save
            var json_get=JSON.stringify(GET);
            if(json_get!=localStorage['replacement-get']) {
                localStorage['replacement-get'] = json_get;
                need_refresh = true;
            }
        }

        if(typeof localStorage['replacement-data'] == 'undefined' || need_refresh){
            request();
        }else{
            var curtime=new Date().getTime();
            var datatime=localStorage['replacement-time'];
            if((curtime-datatime)>30000){
                request();
            }else{
                load();
            }
        }
    };

	return PUBLIC;
})();
