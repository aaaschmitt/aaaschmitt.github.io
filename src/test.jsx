define(['jsx!src/main'], function(React) {

	var Random = React.createClass({
		render: function() {
			return (<div>Look a seperate file added to the build</div>);
		}
	})

	React.render(<Random/>, $("#test").get(0));
})