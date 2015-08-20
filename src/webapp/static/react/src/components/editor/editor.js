if ( !window.components ) window.components = {};
if ( !window.components.editor ) window.components.editor = {};

window.components.editor.editor = React.createClass({
    displayName: "components.editor.editor",
    name: "编辑器",
    // api: new apis.tests(),
    onIME: true,
    getInitialState: function (){
        var self = this;
        window.edit = this;
        return {"content": []};
        return {"content": [
            [9, 25105, 26159, 35841],
            [25105, 20063, 19981, 30693, 36947, 12290]
        ] };
    },
    componentDidMount: function (){
        
    },
    componentWillUpdate: function (){
        
    },
    componentDidUpdate: function (){
        $(".editor").keydown(function (e){
            console.log("jquery sim keydown.");
        });
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
    onKeyUp: function (e, rid){
        /*
            https://facebook.github.io/react/docs/events.html

            Event names:  
                onKeyDown onKeyPress onKeyUp

            Properties:
                boolean altKey
                Number charCode
                boolean ctrlKey
                function getModifierState(key)
                String key
                Number keyCode
                String locale
                Number location
                boolean metaKey
                boolean repeat
                boolean shiftKey
                Number which
        */
        console.log("EventType: ", e.type, "KeyCode: ", e.which, "Time: ", e.timeStamp);
        console.log(e.key);
        console.log(e.ctrlKey);
        console.log(e.metaKey);
        console.log(e.shiftKey);
        console.log(e.altKey);
        console.log(e.repeat);
        console.log(e.charCode);
        console.log(e.key); // Backspace, Delete
    },
    onUpdate: function (e, rid){
        var self = this;
        var dom = $(e.target);
        var content = dom.html();
        // Events: onBlur, onInput, onKeyDown, onKeyUp
        // Not Support: onKeyPress, onFocus, onChange
        //                       onCopy onCut onPaste
        // Note: IME Key Code: 229, Opera: 197
        //             http://www.cnblogs.com/cathsfz/archive/2011/05/29/2062382.html
        // console.log("Event Type: ", e.type, ",\tKeyCode: ", e.which, ",\tTime: ", e.timeStamp);
        // console.log(e.location, " -- ", e.charCode);
        if ( e.type == "input" ) {

        } else if ( e.type == "keydown" ) {
            if ( e.which == 229 ) {
                this.onIME = true;
            }
            if ( e.which == 13 ) {
                // 新建一行
                // var content = this.state.content;
                // content.push([25105]);
                // this.setState( {"content": content } );
            }
            
        } else if ( e.type == "keyup" ) {
            // compute diff
            // var b = this.state.content.map(function (l, i){
            //     return l.map(function (c, p){
            //         return unichr(c);
            //     }).join("");
            // }).join("\n");
            var b = $(".editor")[0].innerText.split("\n").map(function (line, i){
                return line.bytes();
            });
            if (b[b.length-1].length == 0) {
                b.splice(-1, 1);
            }
            this.diff(b);
        } else if ( e.type == "blur" ) {

        } else {
            
        }
    },
    diff: function (b){
        // 比较差异
        var self = this;
        var a = this.state.content;
        console.log(JSON.stringify(b));

        var result = {"bXY": [undefined, undefined], "eXY": [undefined, undefined], "data": []};
        var result = {"bx": undefined, "by": undefined, "xdata": [], "ydata": []};
        // {"replace": {"line": undefined, "bpos": undefined, "epos": undefined, "old_data": undefined, "new_data": undefined} }
        // {"delete": {"line": undefined, "bpos": undefined, "epos": undefined, "old_data": undefined, "new_data": ""} }
        // {"append": {"line": undefined, "bpos": undefined, "epos": undefined, "old_data": undefined, "new_data": undefined} }
        // {"push": {"x": undefined, "y": undefined, "data":[] } }
        // {"replace": {"x": undefined, "y": undefined, "data":[undefined, undefined] } }
        // {"push": {"x": undefined, "y": undefined, "data":[] } }
        // {"push": {"x": undefined, "y": undefined, "data":[] } }
        var result = [ ];
        var dp2 = function (c, d, l){

        };
        // filter
        var dp = function (c, d, l){
            if ( c.length == d.length ) {
                if ( range(l+1, c.length).every(function (i){
                    return c[i].join(",") == d[i].join(",");
                }) ) {

                } else {

                }
            } else if ( c.length < d.length ) {

            } else if ( c.length > d.length ) {

            }
        };
        var i, _i;
        if ( a.length == 0 && b.length == 0 ) {
            // 无差异
            console.info(":: 无差异.");
        }
        if ( a.length == 0 && b.length > 0 ) {

        }
        if ( a.length > 0 && b.length == 0 ) {

        }
        // 正常情况 a.length != 0 && b.length != 0
        for ( i=0; i<a.length; i++ ) {
            if ( a[i].join(",") != b[i].join(",") ) {
                var lines = [i];
                if ( a.length == b.length ) {
                    for ( _i=i+1; _i<a.length; _i++ ) {
                        if ( a[_i].join(",") != b[_i].join(",") ) {
                            lines.push(_i);
                        }
                    }
                } else if ( a.length > b.length ){
                    for ( _i=i+1; _i<b.length; _i++ ) {
                        if ( a[_i].join(",") == b[_i].join(",") ) {
                            // lines.push(_i);
                            // b[_i]
                        }
                    }
                } else if ( a.length < b.length ){

                } else {
                    throw new Error("unknow error.");
                }
                break;
            }
        }

        this.state.content.map(function (line, index){
            if ( line.join(",") != b[index].join(",") ){
                // 行差异
                // result['bx'][0] = index;
                line.map(function (char_code, pos){
                    if ( b[index][pos] != char_code ) {
                        // 列差异
                        result['bXY'][1]
                    }
                })
            }
             
        });

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
                onKeyUp={self.onUpdate}
                // onKeyUp={self.onUpdate}
                // onBlur={self.onUpdate}
                // onInput={self.onUpdate}
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