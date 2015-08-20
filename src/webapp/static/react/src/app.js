
var App = React.createClass({
      getInitialState: function  () {
        return { "route": window.location.hash.substr(1) };
      },
      componentDidMount: function () {
        var self = this;
        var onHashChange = function (e){
            var component = null;
            self.setState( { "route": window.location.hash.substr(1) } );
        };
        window.addEventListener('hashchange', onHashChange);
      },
      views: function (){
            var self = this;
            var view = {"component": null, "props": {} };
            var route = self.state.route;
            if ( route.length < 1 ) route = "index";

            switch ( route ) {
                case 'index': view.component = window.components.index.index; view.props = {}; break;
                case 'document': view.component = window.components.editor.editor; view.props = {"action": "signin"}; break;
                // case 'signup': view.component = window.components.auth.sign; view.props = {"action": "signup"}; break;
                default:
                            // view.component = window.components.error;
                            // view.props = {"code": "404", "msg": "页面不存在"};
                            window.location.href="/";
                            break;
            };
            if ( view.component == null ) return null;
            return React.createElement(view.component, view.props );
      },
      render: function () {
        var self = this;
        return (
            <div>
                { self.views() }
            </div>
        );
      }
    });

