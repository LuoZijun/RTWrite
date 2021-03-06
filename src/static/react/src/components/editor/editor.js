if ( !window.components ) window.components = {};
if ( !window.components.editor ) window.components.editor = {};

/*
records = [];  // change set

// JSON RPC2
// Method:

//      updateFileMeta
//      updateFileContent
//          method: append  params: [ x, y, []  ]
//          method: insert  

postion: [ null, null ]
action: insert, append, remove
//          insert(index, object) -- insert object before index
//          remove(value) -- remove first occurrence of value.
//          append(object) -- append object to end
data:   

{
    "document": "17a581f42cfcfdc4733f8c0618c714f932534b66add10e2978f17e564c5a6c47",
    "author"
    "method": "push",
    "params": [  ], // 
    "client_time": 12334554.45756756,
    "server_time": null
}

insertLine


*/
window.components.editor.editor = React.createClass({
    displayName: "components.editor.editor",
    name: "编辑器",
    // api: new apis.tests(),
    onIME: false, 
    IME_DATA: [],
    getInitialState: function (){
        var self = this;
        window.edit = this;
        // return {"content": []};
        // 9: Tab, 32: Space
        return {"content": [ 25105, 26159, 35841, 10, 25105, 20063, 19981, 30693, 36947, 12290] };
    },
    componentDidMount: function (){
        this.pull();
    },
    componentWillUpdate: function (){
        
    },
    componentDidUpdate: function (){

    },
    pull: function (){
        var self = this;
        var callback = function (response){
            if ( response.type == 'progress' ) return 'loading ...';
            if ( response.code != 200 ) {
                console.warn(response); return;
            }
            try{
                var body = JSON.parse(response.body);
                console.log("Result: \n", body.result);
                self.setState({"content": body.result.content.bytes() });
            }catch(e){
                console.warn("文件列表获取失败.");return;
            }
        };

        // 获取文件内容 
        var url = window.location.origin + "/service";
        var data = {'jsonrpc': '2.0', 'id': 1, 'params': [window.location.hash.split("/")[1]], "method": "fetch" };
        requests.put(url, data, {"async": true, "callback": callback});

    },
    onUpdate: function (e, rid){
        var self = this;
        console.log("Event Type: ", e.type, ",\tKeyCode: ", e.which, ",\tTime: ", e.timeStamp);
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        var KeyCode = { "229": "IME", "13": "Enter", "39": "Right", "37": "Left", "38": "Up", "40": "Down", "32": "Space"  };
        if ( e.type == "focus" ) {
            // make session.
        } else if ( e.type == "keydown" ) {
            if ( e.which == 229 ) {
                // IME KEY
                this.onIME = true;
            } else {
                this.IME_DATA = [];
            }
        } else if ( e.type == "keyup" ) {
            if ( e.which == 32 ) {
                // Ctrl + Space
                // console.log("Event Type: ", e.type, ",\tKeyCode: ", e.which, ",\tTime: ", e.timeStamp, "With Ctrl: ", e.ctrlKey);
                // for ( k in e ) {
                //     console.log( k, ": ", e[k] );
                // }

                // if ( e.nativeEvent.stopPropagation ) {
                //     e.nativeEvent.stopPropagation();
                // } else {
                //     e.nativeEvent.cancelBubble = true;
                // }
                // if ( e.nativeEvent.preventDefault ) {
                //     e.nativeEvent.preventDefault();
                // } else {
                //     e.nativeEvent.returnValue = false;
                // }
                e.stopPropagation();
                // e.preventDefault();
                // return false;
                e.nativeEvent.stopImmediatePropagation();
                return;
            }
            if ( this.onIME == true ) {
                this.IME_DATA.push( e.which ); 
                console.log("输入法: ", JSON.stringify( this.IME_DATA ) );
                // Space
                this.onIME = false;
                if ( e.which == 32 ) {
                    // 输入法 选词结束
                    var text = $(".editor")[0].innerText;
                    // console.log( text );
                    this.diff( text.bytes() );
                }
            } else {
                
            }
        } else if ( e.type == "input" ) {
            // 可以监听虚拟键盘的输入
            if ( this.onIME ) return ;
            var text = $(".editor")[0].innerText;
            // console.log( text );
            this.diff( text.bytes() );
        } else if ( e.type == "blur" ) {
            // remove session.

        } else {
            // pass event type.

        }
    },
    diff: function (b){
        // 比较差异
        var self = this;
        var a = this.state.content;

        console.log(JSON.stringify(a));
        console.log(JSON.stringify(b));

        var result = {"handle": "", "start": undefined, "end": undefined, "data": [] };

        if ( a.length == 0 && b.length == 0 ) {
            // 无差异
            console.info(":: 无差异."); return ;
        }
        if ( a.length == 0 && b.length > 0 ) {
            // 追加
            console.info("新增内容主体.");
            result['start'] = 0;
            result['end'] = b.length-1;
            result['data'] = b;
            result['handle'] = "append";
            console.log("Result: ", JSON.stringify(result) );
            return result;
        }
        if ( a.length > 0 && b.length == 0 ) {
            // 删除
            console.info("清空内容主体.");
            result['start'] = 0;
            result['end'] = -1;
            result['data'] = [];
            result['handle'] = "remove";
            console.log("Result: ", JSON.stringify(result) );
            return result;
        }

        // 正常情况 a.length != 0 && b.length != 0
        for ( var i=0; i<Math.max(a.length, b.length)+1; i++ ) {
            if ( a.length == b.length ) {
                if (  result['start'] != undefined ) {
                    if (
                        range(i-2, a.length).every(function (ii){
                            return a[ii] == b[ii];
                        })
                    ) {
                        result['end'] = i-2;
                        result['data'] = b.slice(result['start'], result['end']);
                        result['handle'] = "replace";
                        break;
                    }
                } else if ( a[i] != b[i] ) {
                    result['start'] = i;
                }
                if ( i == a.length-1 && result['start'] == undefined ) {
                    console.info("无差异。"); return;
                }
                // NOTE: 最后一位字符被替换的情况
                if ( result['start'] != undefined && result['end'] == undefined ) {
                    result['end'] = result['start']+1;
                    result['data'] = b.slice(result['start']+1);
                    result['handle'] = "replace";
                }
            } else if ( a.length > b.length ) {
                if (  result['start'] != undefined ) {
                    if (
                        range(i-1, a.length).every(function (ii){
                            return a[ii] == b[ii-Math.abs(a.length-b.length)];
                        })
                    ) {
                        result['end'] = i-1;
                        result['data'] = a.slice(result['start'], result['end']);
                        result['handle'] = "replace";
                        break;
                    }
                } else if ( i == b.length-1 ) {
                    result['start'] = i;
                } else if ( a[i] != b[i] ) {
                    result['start'] = i;
                }
                if ( i == Math.max(a.length, b.length) && result['end'] == undefined ) {
                    console.info("a > b");
                    result['end'] = null;
                    result['data'] = a.slice(result['start']+1);
                    result['handle'] = "append";
                }
            } else if ( a.length < b.length ) {
                if (  result['start'] != undefined ) {
                    // 需要判断变异点
                    if (
                        range(i-1, b.length).every(function (ii){
                            return a[ii-Math.abs(a.length-b.length)] == b[ii];
                        })
                    ) {
                        result['end'] = i-1;
                        result['data'] = b.slice(result['start'], result['end']);
                        result['handle'] = "insert";
                        break;
                    }
                } else if ( i == a.length-1 ) {
                    result['start'] = i;
                } else if ( a[i] != b[i] ) {
                    result['start'] = i;
                }
                if ( i == Math.max(a.length, b.length) && result['end'] == undefined ) {
                    result['data'] = b.slice( result['start']+1 );
                    result['handle'] = "append";
                }
            }
        }

        console.log("Result: ", JSON.stringify(result) );
        return result;
    },
    merge: function (target, diff_result){
        // 合并差异
    },
    render_content: function (c){
        return c.map(function (code, index){
            if ( unichr(code) == "\n" ) return "<br />\n";
            else return unichr(code);
        }).join("");
        ///////////////////////
        var lines = c.map(function (line, index){
            return line.map(function (char_code, pos){
                return unichr(char_code);
            });
        });
        var html = "";
        for (var i=0; i<lines.length; i++){
            html += "<div class=\"line\" data-line=\"" + i + "\">\n";
            var line = lines[i];
            for ( var ii=0; ii<line.length; ii++ ) {
                // html += "<span class=\"char\" data-pos=\"" + ii + "\">" + line[ii] + "</span>\n";
                html += line[ii];
            }
            html += "</div>\n";
        }
        return html;
    },
    getSelection: function (){
        // 获取文本选择区

    },
    setSelection: function (){
        // 设置文本选择区
        // https://stackoverflow.com/questions/17675056/set-selection-by-range-in-javascript
        var node = document.getElementById("content");
        var range = document.createRange();
        range.setStart(node, 0);
        range.setEnd(node, 4); // here 0 and 4 is my location and length for the selection
        // if my string is "This is test string" in my case its must select "This" 
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    },
    setPos: function (){
        var elem = document.getElementById(elemId);
        if(elem != null) {
            if(elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
            } else {
                if(elem.selectionStart) {
                    elem.focus();
                    elem.setSelectionRange(caretPos, caretPos);
                } else {
                    elem.focus();
                }
            }
        }
    },
    getPos: function (){
        return ;
        var s = getSelection();
        var parentElement = s.focusNode.parentElement;
        var pos = $(parentElement).data("pos");
        var line = $(parentElement).parent().data("index");
        console.log( line, pos );
    },
    render: function (){
        var self = this;
        //  onKeyPress onKeyUp
        // dangerouslySetInnerHTML={{__html: this.render_content(this.state.content) }} 
        // style={{ "width": "400px", "height": "400px", "borderStyle": "solid", "borderColor": "yellow" }} />
        return (
            <div className="doc">
                <div className="doc-header">
                    <div className="doc-container">
                        <span className="title">Rt Write</span>
                        <span className="title last-modified">2015-08-31 20:59:00</span>
                        <span className="save">历史</span>
                    </div>
                </div>
                <div className="doc-container">
                    <div className="doc-view">
                    <div 
                        className="editor doc-edit" 
                        contentEditable={true}
                        onKeyDown={self.onUpdate}
                        onKeyUp={self.onUpdate}
                        // onKeyUp={self.onUpdate}
                        // onBlur={self.onUpdate}
                        onInput={self.onUpdate}
                        onClick={self.getPos}
                        dangerouslySetInnerHTML={{__html: this.render_content(this.state.content) }} />
                    </div>
                </div>
            </div>

        );
        return (
            <div 
                className="editor main" 
                contentEditable={true}
                onKeyDown={self.onUpdate}
                onKeyUp={self.onUpdate}
                // onKeyUp={self.onUpdate}
                // onBlur={self.onUpdate}
                onInput={self.onUpdate}
                onClick={self.getPos}
                dangerouslySetInnerHTML={{__html: this.render_content(this.state.content) }} />
        );
        return (
            <div 
                className="editor" 
                contentEditable={true} 
                onKeyDown={self.onUpdate}
                // onKeyUp={self.onUpdate}
                // onBlur={self.onUpdate}
                // onInput={self.onUpdate}
                onClick={self.getPos}
                style={{ "width": "400px", "height": "400px", "border-style": "solid", "border-color": "yellow" }} >
                    { this.state.content.map(function (line, index){
                        return (
                            <div className="line" data-index={index}>
                                { line.map(function (char_code, pos){
                                    /*
                                    return ( <span 
                                                className="char" 
                                                data-pos={pos} >
                                                    {unichr(char_code)}
                                            </span> );

                                    */
                                    return unichr()
                                }).join("") }
                            </div>
                        );
                    }) }
            </div>
        );
    }
});