if ( !window.components ) window.components = {};
if ( !window.components.editor ) window.components.editor = {};

window.components.editor.editor = React.createClass({
    displayName: "components.editor.editor",
    name: "编辑器",
    // api: new apis.tests(),
    getInitialState: function (){
        var self = this;
        return {"content": "<div><br></div>"};
    },
    componentDidMount: function (){
        
    },
    componentWillUpdate: function (){
        
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
        console.log("Event Type: ", e.type, ",\tKeyCode: ", e.which, ",\tTime: ", e.timeStamp);
        if ( e.type == "input" ) {

        } else if ( e.type == "keydown" ) {

        } else if ( e.type == "keyup" ) {

        } else if ( e.type == "keyup" ) {

        } else {
            
        }
    },
    diff: function (){

    },
    render: function (){
        var self = this;
        //  onKeyPress onKeyUp
        return (
            <div 
                ClassName="editor" 
                contentEditable={true} 
                onKeyDown={self.onUpdate}
                onKeyUp={self.onUpdate}
                onBlur={self.onUpdate}
                onInput={self.onUpdate}
                style={{ "width": "960px", "height": "400px" }}
                dangerouslySetInnerHTML={{__html: this.state.content}} />
        );
    }
});