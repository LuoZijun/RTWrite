// IE Fix,  Javascript


if ( !window.console ) {
    // fix console object.
    window.console = {
        log: function(){},
        debug: function(){},
        info: function(){},
        warn: function(){},
        exception: function(){},
        assert: function(){},
        dir: function(){},
        dirxml: function(){},
        trace: function(){},
        group: function(){},
        groupCollapsed: function(){},
        groupEnd: function(){},
        profile: function(){},
        profileEnd: function(){},
        clear: function(){},
        time: function(){},
        timeEnd: function(){},
        timeStamp: function(){},
        table: function(){},
        error: function(){},
    };
};
if ( !window.console.log ) window.console.log = function(){};
if ( !window.console.dir ) window.console.dir = function(){};
if ( !window.console.info ) window.console.info = function(){};
if ( !window.console.exception ) window.console.exception = function(){};
if ( !window.console.error ) window.console.error = function(){};
if ( !window.console.time ) window.console.time = function(){};
if ( !window.console.warn ) window.console.warn = function(){};
if ( !window.console.assert ) window.console.assert = function(){};
if ( !window.console.clear ) window.console.clear = function(){};
if ( !window.console.dirxml ) window.console.dirxml = function(){};
if ( !window.console.debug ) window.console.debug = function(){};

if ( !window.dir ) window.dir = window.console.dir;


// FIX IE Object.
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

