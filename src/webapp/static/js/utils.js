
String.prototype.to_utf8 = function (){
    return unescape(encodeURIComponent(this));
};
String.prototype.chars = function (){
    var self = this;
    return range(this.length).map(function (i){
        return self[i];
    });
};
String.prototype.bytes = function (){
    var self = this;
    return range(this.length).map(function (i){
        return ord(self[i]);
    });
};


function print(msg){
    if ( window.setting && window.setting.debug == true ) {
        if ( window.console && window.console.log ) {
            console.log(msg);
        }
    }
}

window.time = {
    time: function (){
        return parseInt((new Date()).getTime()/1000);
    },
    ctime: function (t){
        if ( !t ) var t = time.time();
        var d = new Date();
        d.setTime(parseInt(t)*1000);

        var month, day, hours, minutes, seconds, year;
        month = d.getMonth()+1; // Note: January is 0, February is 1, and so on.
        day = d.getDate();
        hours = d.getHours();
        minutes = d.getMinutes();
        seconds = d.getSeconds();
        year = d.getFullYear();
        if ( month.toString().length < 2 ) month = "0" + month.toString();
        if ( day.toString().length < 2 ) day = "0" + day.toString();
        if ( hours.toString().length < 2 ) hours = "0" + hours.toString();
        if ( minutes.toString().length < 2 ) minutes = "0" + minutes.toString();
        if ( seconds.toString().length < 2 ) seconds = "0" + seconds.toString();
        return  month + "/" + day + " " + hours + ":" + minutes + ":" + seconds + "  " + year;
    },
    ptime: function (t){
        // t: sec
        t = parseInt(t);
        var result = {"day": 0, "hours": 0, "minutes": 0, "seconds": t};
        if ( t < 60 ) return result;

        while ( (result.seconds-60) >= 0 ) {
            result.seconds -= 60;
            result.minutes +=1;
        }
        while ( (result.minutes-60) >= 0 ) {
            result.minutes -= 60;
            result.hours +=1;
        }
        while ( (result.hours-24) >= 0 ) {
            result.hours -= 24;
            result.day +=1;
        }
        return result;
    }
}
/**
    unichr 和 chr 并不相同
    chr 按照存储单位来区分一个单元
    unichr 按照 Unicode 所代表的一个具体元素 来区分一个单元
**/
function chr (num){
    return unichr(num);
};
function unichr (num){
    return String.fromCharCode(parseInt(num));
};
function ord(char){
    // 转换 ASCII 字符 为 十进制数字
    return char.charCodeAt(0);
}

// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](http://docs.python.org/library/functions.html#range).
function range (start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);
    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }
    return range;
}

function ord(s){
    return s.charCodeAt();
}
function chr(n){
    return String.fromCharCode(n);
}

window.base64 = {
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
    decode: function (s){
        return decodeURIComponent(escape(window.atob( s )));
    },
    encode: function (s){
        return window.btoa(unescape(encodeURIComponent( s )));
    }
}