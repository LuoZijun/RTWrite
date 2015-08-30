
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
            if ( "index" == route ) {
              view.component = window.components.index.index;
              view.props = {};
            } else if ( /document\/*/.test(route) ){
              view.component = window.components.editor.editor;
              view.props = {};
            } else {
              window.location.href="/";
            }
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

