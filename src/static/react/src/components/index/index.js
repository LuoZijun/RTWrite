if ( !window.components ) window.components = {};
if ( !window.components.index ) window.components.index = {};

window.components.index.index = React.createClass({
    displayName: "components.index.index",
    name: "首页",
    // api: new apis.tests(),
    getInitialState: function (){
        var self = this;
        return {"files":[]};
    },
    componentDidMount: function (){
        this.pull();
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
            try{
                var body = JSON.parse(response.body);
                if ( "result" in body == true && "map" in body.result){
                    self.setState({"files": body.result});
                }else {
                    throw Error("result error.");
                }

            }catch(e){
                console.warn("文件列表获取失败.");return;
            }
        };
        // 获取文件列表
        var url = window.location.origin + "/service";
        var data = {'jsonrpc': '2.0', 'id': 1, 'params': [], "method": "index" };
        requests.put(url, data, {"async": true, "callback": callback});
    },
    open: function (file_name){
        window.location.assign("#document/"+file_name);
    },
    render: function (){
        var self = this;
        return (
            <div className="main">
                <ul>
                    { this.state.files.map(function (file, i){
                        return (
                            <li onClick={self.open.bind(self, file)}>
                                <div className="li-img">
                                    <img src="static/images/document.jpg" />
                                </div>
                                <div className="title">{file}</div>
                                <div className="time">
                                    上次打开时间<span>下午10:36</span>
                                </div>
                            </li>
                        );
                    }) }
                </ul>
                <div style={{"clear": "both"}}></div>
            </div>
        );
    }
});