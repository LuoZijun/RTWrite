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
        return {"content": [
            [25105, 26159, 35841],
            [25105, 20063, 19981, 30693, 36947, 12290]
        ] };
    },
    componentDidMount: function (){
        
    },
    componentWillUpdate: function (){
        
    },
    componentDidUpdate: function (){
        // $(".editor").keydown(function (e){
        //     console.log("jquery sim keydown.");
        // });
    },
    pull: function (){
        var self = this;
        var callback = function (response){
            if ( response.type == 'progress' ) return 'loading ...';
            if ( response.code != 200 ) {
                console.warn(response); return;
            }
            
        };
        // 获取文件列表
    },
    onUpdate: function (e, rid){
        var self = this;
        // console.log("Event Type: ", e.type, ",\tKeyCode: ", e.which, ",\tTime: ", e.timeStamp);
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
            if ( this.onIME == true ) {
                this.IME_DATA.push( e.which ); 
                console.log("输入法: ", JSON.stringify( this.IME_DATA ) );
                // Space
                this.onIME = false;
            } else {
                
            }
        } else if ( e.type == "input" ) {
            // 可以监听虚拟键盘的输入
            if ( this.onIME ) return ;
            console.log( $(".editor")[0].innerText );
            var b = $(".editor")[0].innerText.split("\n").map(function (line, i){
                return line.bytes();
            });
            if (b[b.length-1].length == 0) {
                b.splice(-1, 1);
            }
            this.diff(b);
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

        var result = [ ];
        var i, _i;
        if ( a.length == 0 && b.length == 0 ) {
            // 无差异
            console.info(":: 无差异.");
            return ;
        }
        if ( a.length == 0 && b.length > 0 ) {
            // 追加
            console.info("新增内容主体.");
            return;
        }
        if ( a.length > 0 && b.length == 0 ) {
            // 删除
            console.info("清空内容主体.");
            return;
        }

        // 正常情况 a.length != 0 && b.length != 0
        var lines = [];
        for ( i=0; i<a.length; i++ ) {
            if ( a[i].join(",") != b[i].join(",") ) {
                lines.push(i);
                if ( a.length == b.length ) {
                    for ( _i=i+1; _i<a.length; _i++ ) {
                        if ( a[_i].join(",") != b[_i].join(",") ) {
                            lines.push(_i);
                        }
                    }
                } else if ( b.length > a.length ){
                    for ( _i=i+1; _i<a.length; _i++ ) {
                        if ( a[_i].join(",") == b[_i].join(",") ) {
                            lines.push(_i);
                        }
                    }
                    range(a.length, b.length).map(function (l){
                        lines.push(l);
                    });
                } else if ( b.length < a.length ){
                    for ( _i=i+1; _i<b.length; _i++ ) {
                        if ( b[_i].join(",") == a[_i].join(",") ) {
                            lines.push(_i);
                        }
                    }
                } else {
                    throw new Error("unknow error.");
                }
                break;
            }
        }
        console.info(lines);
    },
    merge: function (target, diff_result){
        // 合并差异
    },
    render_content: function (c){
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
        return (
            <div 
                className="editor" 
                contentEditable={true}
                onKeyDown={self.onUpdate}
                onKeyUp={self.onUpdate}
                // onKeyUp={self.onUpdate}
                // onBlur={self.onUpdate}
                onInput={self.onUpdate}
                onClick={self.getPos}
                dangerouslySetInnerHTML={{__html: this.render_content(this.state.content) }} 
                style={{ "width": "400px", "height": "400px", "border-style": "solid", "border-color": "yellow" }} />
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