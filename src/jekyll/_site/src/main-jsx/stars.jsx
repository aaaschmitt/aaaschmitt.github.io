/**
 * Creates a bunch of star elements.
 */
var numStars = 500,
	starClassNames = ["star-sm", "star-md", "star-lg"];
var Stars = React.createClass({
	render: function() {
		var stars = [];
		makeStars(stars, 700, starClassNames[0]);
		makeStars(stars, 350, starClassNames[1]);
		makeStars(stars, 200, starClassNames[2]);
		return (<div id="stars">{stars}</div>);
	}
});

function makeStars(starArray, numStars, starType) {
	for (var i = 0; i < numStars; i++) {
		var positionStyle = {
			top:  (Math.random() * 100) + "%",
			left:  (Math.random() * 100) + "%",
			opacity: Math.random()
		}
		starArray.push(<div className={starType} style={positionStyle} key={String(i) + String(starType)}></div>);
	}
}

React.render(<Stars/>, $("#stars").get(0));