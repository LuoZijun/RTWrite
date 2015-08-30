if ( !window.components ) window.components = {};
if ( !window.components.index ) window.components.index = {};

window.components.index.index = React.createClass({
    displayName: "components.index.index",
    name: "首页",
    // api: new apis.tests(),
    getInitialState: function (){
        var self = this;
        return {};
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
    render: function (){
        var self = this;
        return (
            <div>
                {this.state.content}
            </div>
        );
    }
});