// JavaScript  Requests Lib.


// 用例:
/*

            // 公用回调
            function response_callback (response){
                // 异步请求 回调函数
                if ( response.type == 'progress' ) {
                    console.log(':: 进度: ' + response.loaded + ' / ' + response.total);
                    return 1;
                }
                console.log(':: 下载完毕: ');
                console.log(response);
                console.log(":: 主体数据:");
                console.log(response.body);
            }

            
            // 测试函数
            function test_get(){
                options = {callback: response_callback, async: true};
                res = window.requests.get('/d.php', options);
            }

            function test_post(){
                // 同步模式下，服务器应答信息赋值给 res / 异步模式下，则调用 可选参数里面 的 callback 回调函数
                options = {callback: response_callback, async: true};
                data = {'haha':'你好呢？enen', 'hehe':'asd34534s我很好呀dfgsd'};
                res = window.requests.post('/d.php', data, options);
            }

            function test_put(){
                options = {callback: response_callback, async: true};
                data = {'haha':'你好呢？enen', 'hehe':'asd34534s我很好呀dfgsd'};
                res = window.requests.post('/d.php', data, options);
            }


            /////////////////// 服务端 PHP 代码 //////////////////////////////

<?php

    #sleep(120);exit();
    //http_response_code(500);exit();
    #setcookie('hhhhaa', 'aaaaa');

    header("Content-Type:text/html;charset=utf-8");
    echo "\n||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\n";
    echo "\n\nSERVER INFO: \n\n";
    print_r($_SERVER);
    echo "\n\nPOST DATA: \n\n";
    print_r($_POST);
    echo "\n\nCookies:\n\n";
    print_r($_COOKIES);


    echo "\n\nPHP INPUT DATA: \n\n";
    #$putfp = fopen("php://input", "r");
    $putdata = file_get_contents('php://input');
    var_dump($putdata);


    exit();
?>


*/





            // IE FIX
            if(!Object.keys){Object.keys=(function(){
                // fix object method keys
                'use strict';
                var hasOwnProperty=Object.prototype.hasOwnProperty,hasDontEnumBug=!({toString:null})
                                                            .propertyIsEnumerable('toString'),
                      dontEnums=['toString','toLocaleString','valueOf','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','constructor'],
                      dontEnumsLength=dontEnums.length;
                return function(obj){if(typeof obj!=='object'&&(typeof obj!=='function'||obj===null)){throw new TypeError('Object.keys called on non-object');}
                var result=[],prop,i;for(prop in obj){if(hasOwnProperty.call(obj,prop)){result.push(prop);}}
                if(hasDontEnumBug){for(i=0;i<dontEnumsLength;i++){if(hasOwnProperty.call(obj,dontEnums[i])){result.push(dontEnums[i]);}}}
                return result;};
            }());};

            if(!window.location.origin){
                // fix location object
                window.location.origin=window.location.protocol+"//"+window.location.hostname+(window.location.port?':'+window.location.port:'');
            };

            if(!window.JSON){
                // fix JSON object
                window.JSON={
                    parse:function(sJSON){return eval("("+sJSON+")");},
                    stringify:function(vContent){if(vContent instanceof Object){
                            var sOutput="";if(vContent.constructor===Array){for(var nId=0;nId<vContent.length;
                            sOutput+=this.stringify(vContent[nId])+",",nId++);
                            return"["+sOutput.substr(0,sOutput.length-1)+"]";}
                            if(vContent.toString!==Object.prototype.toString){return"\""+vContent.toString().replace(/"/g,"\\$&")+"\"";}
                                for(var sProp in vContent){sOutput+="\""+sProp.replace(/"/g,"\\$&")+"\":"+this.stringify(vContent[sProp])+",";}
                                return"{"+sOutput.substr(0,sOutput.length-1)+"}";
                    }
                    return typeof vContent==="string"?"\""+vContent.replace(/"/g,"\\$&")+"\"":String(vContent);}
                };
            };

            if ( !window._CACHE ) window._CACHE={};
            if ( !window._CACHE.requests ) window._CACHE.requests={};
            
            // requests in js.
            window.requests = {};
            window.requests.get = function (url, options){
                // HTTP GET
                if ( !options ) options = {};
                if ( typeof options != 'object' ) throw Error("Object Required.");
                if ( typeof options.async != 'boolean' ) options.async = true;
                if ( typeof options.callback != 'function' ) options.callback = function(){};
                if ("url" in options != true) options.url = url;
                options.method = "GET";

                if ( window.auth && window.auth.token && url.indexOf("token") == -1 ){
                    if ( url.indexOf("?") != -1) url += "&token=" + window.auth.token;
                    else url += "?token=" + window.auth.token;
                }
                // 缓存
                if ( url in window._CACHE.requests ){
                    return options.callback(window._CACHE.requests[url]);
                }

                var request = this._get_request();

                // 状态监视 模式 ( 异步请求 )
                var parent = this;
                if ( options.async == true ){
                    request.onreadystatechange = function() {
                        if (request.readyState == 4) {
                            return parent._transferComplete({target: request}, options);
                       }
                    };
                }
                // 事件监听 模式
                var onprogress = function (evt){
                    options.callback(evt, options);
                };
                try{
                    request.addEventListener("progress", onprogress, false);
                }catch(e){};
                //request.addEventListener("load", transferComplete, false);
                //request.addEventListener("error", transferError, false);
                //request.addEventListener("abort", transferError, false);
                request.open( 'GET', url, options.async); //  method, url, boolean async, user,  password
                // xhr.overrideMimeType("text/plain; charset=x-user-defined");
                request.send(null);

                // 阻塞等待 ( 同步请求 )
                if ( options.async == false ){
                    return this._transferComplete({target: request}, options);
                }
            };
            window.requests.post = function (url, data, options){
                // POST 数据必须是数组序列 ( 如果传递的是字符串，那么我会默认是经过正确的 URLENCODE 编码过的数据 )
                if ( typeof data == 'object' ) data = this.urlencode(data);         // URLENCODE
                else if ( typeof data == 'string' ) data = data;   // need encodeURI  ???
                if ( !options ) options = {};
                if ( typeof options != 'object' ) throw Error("Object Required.");
                if ( typeof options.async != 'boolean' ) options.async = true;
                if ( typeof options.callback != 'function' ) options.callback = function(){};
                if ("url" in options != true) options.url = url;
                options.method = "POST";

                if ( window.auth && window.auth.token && url.indexOf("token") == -1 ){
                    if ( url.indexOf("?") != -1) url += "&token=" + window.auth.token;
                    else url += "?token=" + window.auth.token;
                }
                var request = this._get_request();

                // 状态监视 模式 ( 异步请求 )
                var parent = this;
                if ( options.async == true ){
                    request.onreadystatechange = function() {
                        if (request.readyState == 4) {
                            return parent._transferComplete({target: request}, options);
                       }
                    };
                }

                // 事件监听 模式
                var onprogress = function (evt){
                    options.callback(evt, options);
                };
                try{
                    request.addEventListener("progress", onprogress, false);
                }catch(e){};
                //request.addEventListener("load", transferComplete, false);
                //request.addEventListener("error", transferError, false);
                //request.addEventListener("abort", transferError, false);

                request.open( 'POST', url, options.async); //  method, url, boolean async, user,  password
                // request.setRequestHeader("Content-Length", data.length);
                if ( !options.content_type )  options.content_type = "application/x-www-form-urlencoded;";


                request.setRequestHeader("Content-Type", options.content_type);
                if ( options.content_type == "multipart/form-data" ) {
                    request.setRequestHeader("Content-Type", "multipart/form-data; boundary=AAAAA");
                    data = '--AAAAA\r\nContent-Disposition: form-data; name="file"; filename="aaaa.docx"\r\n'
                                + 'Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n'
                                + data;

                    // request.setRequestHeader("Content-Disposition", 'form-data; name="file"; filename="aaaa.docx"');
                }
                // xhr.overrideMimeType("text/plain; charset=x-user-defined");
                request.send(data);

                // 阻塞等待 ( 同步请求 )
                if ( options.async == false ){
                    return this._transferComplete({target: request}, options);
                }

            };
            window.requests.put = function (url, data, options){
                if ( typeof data == 'object' ) data = JSON.stringify(data);   // JSON Format
                else if ( typeof data == 'string' ) data = data;   // need encodeURI  ???
                if ( !options ) options = {};
                if ( typeof options != 'object' ) throw Error("Object Required.");
                if ( typeof options.async != 'boolean' ) options.async = true;
                if ( typeof options.callback != 'function' ) options.callback = function(){};
                if ("url" in options != true) options.url = url;
                options.method = "PUT";

                if ( window.auth && window.auth.token && url.indexOf("token") == -1 ){
                    if ( url.indexOf("?") != -1) url += "&token=" + window.auth.token;
                    else url += "?token=" + window.auth.token;
                }
                var request = this._get_request();

                // 状态监视 模式 ( 异步请求 )
                var parent = this;
                if ( options.async == true ){
                    request.onreadystatechange = function() {
                        if (request.readyState == 4) {
                            return parent._transferComplete({target: request}, options);
                       }
                    };
                }
                
                // 事件监听 模式
                var onprogress = function (evt){
                    options.callback(evt, options);
                };
                try{
                    // IE 7 Not support.
                    request.addEventListener("progress", onprogress, false);
                }catch(e){};
                //request.addEventListener("load", transferComplete, false);
                //request.addEventListener("error", transferError, false);
                //request.addEventListener("abort", transferError, false);

                request.open( 'PUT', url, options.async); //  method, url, boolean async, user,  password
                // request.setRequestHeader("Content-length", data.length);
                if ( !options.content_type )  options.content_type = "application/json; charset: utf8";
                request.setRequestHeader("Content-Type", options.content_type)
                // request.setRequestHeader("Connection", "close");
                // xhr.overrideMimeType("text/plain; charset=x-user-defined");
                request.send(data);

                // 阻塞等待 ( 同步请求 )
                if ( options.async == false ){
                    return this._transferComplete({target: request}, options);
                }
            };
            window.requests.METHOD_DELETE = function (url, options){
                if ( typeof data == 'object' ) data = JSON.stringify(data);   // JSON Format
                else if ( typeof data == 'string' ) data = data;   // need encodeURI  ???
                else data = '';
                
                if ( !options ) options = {};
                if ( typeof options != 'object' ) throw Error("Object Required.");
                if ( typeof options.async != 'boolean' ) options.async = true;
                if ( typeof options.callback != 'function' ) options.callback = function(){};
                if ("url" in options != true) options.url = url;
                options.method = "DELETE";

                if ( window.auth && window.auth.token && url.indexOf("token") == -1 ){
                    if ( url.indexOf("?") != -1) url += "&token=" + window.auth.token;
                    else url += "?token=" + window.auth.token;
                }
                var request = this._get_request();

                // 状态监视 模式 ( 异步请求 )
                var parent = this;
                if ( options.async == true ){
                    request.onreadystatechange = function() {
                        if (request.readyState == 4) {
                            return parent._transferComplete({target: request}, options);
                       }
                    };
                }
                
                // 事件监听 模式
                var onprogress = function (evt){
                    options.callback(evt, options);
                };
                try{
                    // IE 7 Not support.
                    request.addEventListener("progress", onprogress, false);
                }catch(e){};
                //request.addEventListener("load", transferComplete, false);
                //request.addEventListener("error", transferError, false);
                //request.addEventListener("abort", transferError, false);

                request.open( 'DELETE', url, options.async); //  method, url, boolean async, user,  password
                //request.setRequestHeader("Content-length", data.length);
                //request.setRequestHeader("Content-Type", "application/json;")
                //request.setRequestHeader("Connection", "close");
                // xhr.overrideMimeType("text/plain; charset=x-user-defined");
                request.send(data);

                // 阻塞等待 ( 同步请求 )
                if ( options.async == false ){
                    return this._transferComplete({target: request}, options);
                }
            };
            window.requests.head = function (url, options){

            };
            window.requests.options = function (url, options){

            };
            window.requests.patch = function (url, data, options){
                if ( typeof data == 'object' ) data = JSON.stringify(data);   // JSON Format
                else if ( typeof data == 'string' ) data = data;   // need encodeURI  ???
                if ( !options ) options = {};
                if ( typeof options != 'object' ) throw Error("Object Required.");
                if ( typeof options.async != 'boolean' ) options.async = true;
                if ( typeof options.callback != 'function' ) options.callback = function(){};
                if ("url" in options != true) options.url = url;
                options.method = "PATCH";

                if ( window.auth && window.auth.token && url.indexOf("token") == -1 ){
                    if ( url.indexOf("?") != -1) url += "&token=" + window.auth.token;
                    else url += "?token=" + window.auth.token;
                }
                var request = this._get_request();

                // 状态监视 模式 ( 异步请求 )
                var parent = this;
                if ( options.async == true ){
                    request.onreadystatechange = function() {
                        if (request.readyState == 4) {
                            return parent._transferComplete({target: request}, options);
                       }
                    };
                }
                
                // 事件监听 模式
                var onprogress = function (evt){
                    options.callback(evt, options);
                };
                try{
                    // IE 7 Not support.
                    request.addEventListener("progress", onprogress, false);
                }catch(e){};
                //request.addEventListener("load", transferComplete, false);
                //request.addEventListener("error", transferError, false);
                //request.addEventListener("abort", transferError, false);

                request.open( 'PATCH', url, options.async); //  method, url, boolean async, user,  password
                // request.setRequestHeader("Content-length", data.length);
                request.setRequestHeader("Content-Type", "application/json; charset: utf8")
                // request.setRequestHeader("Connection", "close");
                // xhr.overrideMimeType("text/plain; charset=x-user-defined");
                request.send(data);

                // 阻塞等待 ( 同步请求 )
                if ( options.async == false ){
                    return this._transferComplete({target: request}, options);
                }
            };
            window.requests.connect = function (url, options){

            };
            window.requests._get_request = function (){
                if (window.XMLHttpRequest) { // Mozilla, Safari, ...
                    return new XMLHttpRequest();
                } else if (window.ActiveXObject) { // IE
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (e) {
                        try {
                            return new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (e) {
                            throw Error("Ooops.... ");
                        }
                    }
                } else {
                    throw Error("XMLHttpRequest Object Not Exisit.");
                }
            };

            window.requests.urlencode = function (dict){
                // function range/ urlencode / urldecode 参见我的 PyJS.
                // Note: IE may have problems....
                if ( !dict ) throw Error('error in window.request.urlencode.');
                if ( !window.Object  || !window.Object.keys ) throw Error('error in window.Object.keys.');
                keys=Object.keys(dict);
                kv_list=[];
                for(i in keys){
                    key=keys[i];
                    value=dict[key];
                    kv_list.push(encodeURI(key+'='+value));
                }
                delete keys, key, value;
                return kv_list.join('&');
            };
            window.requests.urldecode = function (s){
                // urldecode function.
                if ( !s || typeof s != 'string' ) throw Error('error in window.requests.urldecode .');
                var range = function (s){if(typeof s!=='number') throw Error("range参数须为整数");
                    var arguments=Array.prototype.slice.call(arguments,1);
                    if(arguments.length>2) throw Error("range参数错误");
                    else if(arguments.length==0){
                        var r=[];
                        for(var i=0;i<s;i++){ r.push(i); }
                        return r;
                    } else if(arguments.length==1){
                        if(typeof arguments[0]!=='number') throw Error("range参数须为整数");
                        var r=[];
                        for(var i=s;i<arguments[0];i++){r.push(i);}
                        return r;
                    } else if(arguments.length==2){
                        if(typeof arguments[0]!=='number'||typeof arguments[1]!=='number') throw Error("range参数须为整数");
                        var r=[];for(var i=s;i<arguments[0];i+=arguments[1]){r.push(i);}
                        return r;
                    }
                };
                var kv_list=s.split('&');var dict={};for(i in range(kv_list.length)){var kv=kv_list[i].split('=');
                var k=decodeURI(kv[0]);var v=encodeURI(kv[1]);dict[k]=v;}
                return dict;
            };
            window.requests._get_response = function (request){

            };
            window.requests._process_options = function (request){

            };
            window.requests._transferComplete = function (evt, options){
                // 传输完成
                //error_type = evt.type;  // 传输终止 ( error/abort )
                //if ( error_type == '' )
                if ( !options ) options = {};
                if ( typeof options != 'object' ) throw Error("Object Required.");
                if ( typeof options.async != 'boolean' ) options.async = true;
                if ( typeof options.callback != 'function' ) options.callback = function(){};

                var response = {};

                if ( 'type' in evt && evt.type == 'progress') {
                    // 进度 数据
                    /*
                    bubbles: false
                    cancelBubble: false
                    cancelable: true
                    clipboardData: undefined
                    currentTarget: XMLHttpRequest
                    defaultPrevented: false
                    eventPhase: 0
                    lengthComputable: true
                    loaded: 20250368
                    path: NodeList[0]
                    position: 20250368
                    returnValue: true
                    srcElement: XMLHttpRequest
                    target: XMLHttpRequest
                    timeStamp: 1415166181177
                    total: 20567668
                    totalSize: 20567668
                    type: "progress"
                    */
                    response.type = evt.type;
                    response.loaded = evt.loaded;
                    response.total = evt.total;
                    //console.log(evt.loaded + '/' + evt.total);
                    //l = [];   // l.push(r.charCodeAt(iii).toString(16));  // dec.toString(16)    16进制
                }

                // 载入完毕
                response.code = parseInt(evt.target.status);
                response.reason = evt.target.statusText;
                if ("responseURL" in evt.target ) response.url = evt.target.responseURL;
                response.ready_state = parseInt(evt.target.readyState); // getResponseHeader  overrideMimeType  setRequestHeader
                if ( 'getAllResponseHeaders' in evt.target ){
                    // console.log( evt.target );
                    _header = evt.target.getAllResponseHeaders().replace("\r\n", "\n").split("\n");
                    response.header = {};
                    for ( i=0; i< _header.length; i++ ){
                        h = _header[i];
                        m = h.match(/^(\w\S+)\:\s/);
                        if ( m  ) response.header[m[1]] = h.replace(m[0], '');
                    }
                    //response.header = headers;
                    delete h, m, i, _header; //headers;
                } else {
                    // IE 7 Do Not Support  getAllResponseHeaders method.
                    response.header = {};
                }
                // IE problems.
                // keys: responseText/ responseBody / responseXML  (In IE)
                if ( 'response' in evt.target ) response.body = evt.target.response;
                else response.body = evt.target.responseText;
                // Note: Cookie 不支持 ( set-cookie 头 不会被 xmlhttp 捕获 )
                //var response = {code: code, reason: reason, header: header, cookies: {}, ready_state: ready_state, url: url, body: body};
                //delete code, reason, header, ready_state, url, body;
                //return response;
                response.method = options.method;

                if ( options.method.toUpperCase() == "GET" ) {
                    window._CACHE.requests[options.url] = response;
                } else {
                    delete window._CACHE.requests[options.url];
                }
                

                if ( options.async == false ) return response;
                else return options.callback(response);
            };

                /*
                // 忽略该事件
                var transferError = function (evt){
                    // 传输终止 ( error/abort )
                    error_type = evt.type;
                    console.log(':: transferError');
                    console.log(evt);
                    var response = {
                                            error: error_type,
                                            code: parseInt(evt.target.status),    // 0
                                            reason: evt.target.statusText,           // ''
                                            header: {}, 
                                            cookies: {}, 
                                            ready_state: parseInt(evt.target.readyState), 
                                            url: '',                                                           //  ???
                                            body: evt.target.response                  // ''
                                                };
                    //return response;
                    options.callback(response);
                };
            */


