define(function(require){

	var React = require("react");

	var TopNav = React.createClass({
	      render: function () {
	        return (
	          <div>
	            <p>Hello, React! This will be a nav bar someday.</p>
	          </div>
	        );
	      }
	    });

    React.render(<TopNav/>, $("#top-nav").get(0));

  return React;
});