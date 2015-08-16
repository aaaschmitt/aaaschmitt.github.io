/**
 * Creates a bunch of star elements.
 */
var numStars = 200,
	starClassNames = ["star-sm", "star-md", "star-lg"];
var Stars = React.createClass({
	render: function() {
		var stars = [];
		for (var i = 0; i < numStars; i++) {
			for (var type = 0; type < starClassNames.length; type++) {
				var positionStyle = {
					top:  (Math.random() * 100) + "%",
					left:  (Math.random() * 100) + "%",
					opacity: Math.random()
				}
				stars.push(<div className={starClassNames[type]} style={positionStyle} key={String(i) + String(type)}></div>);
			}
		}

		console.log(stars);
		return (<div id="stars">{stars}</div>);
	}
});

React.render(<Stars/>, $("#stars").get(0));