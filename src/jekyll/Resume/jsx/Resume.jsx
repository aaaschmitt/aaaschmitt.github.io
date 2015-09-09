/**
 * Javascript for rendering my 3D resume. Uses three.js.
 */


//setup camera and renderer
var width = Math.max(600, $(window).width() /2),
	height = Math.max(600, $(window).height() /2),
	scene = new THREE.Scene(),
	camera = new THREE.PerspectiveCamera( 75,  width /  height, 0.1, 1000 ),
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }),
	cube;

renderer.setSize(width, height);
$("#Resume").append(renderer.domElement);

//setup orbit controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.noZoom = true;
	controls.noPan = true;
	controls.addEventListener('change', render);

//vars for image preloading
var imgDest = {},
	numImgsLoaded = 0;

//cube and text styles/sizes
var cubeDim = 512,
	titleH = cubeDim/12,
	titleFont = titleH + "px League Gothic",
	titleColor = '#9643E8',
	lineWeight = 7,
	lineOffset = 5,
	lineBreakHeight = 20,
	textH = cubeDim/20,
	textFont = textH + "px League Gothic",
	smallTextH = cubeDim/25,
	smallTextFont = smallTextH + "px League Gothic",
	largeTextH = cubeDim/16,
	largeTextFont = largeTextH + "px League Gothic",
	textColor = "white",
	bullet = String.fromCharCode(8226) + " ",
	padding = 30,
	horizListSpacing = 20,
	listIndent = padding * 2;

//camera positioning
var cameraOffset = 200,
	cameraDist = cubeDim + cameraOffset;

var cameraOffset = 200;
camera.position.x = cameraDist;

//sections for each cube face
var sections = [
	{title: 'EDUCATION', coords: {x: cameraDist, y: 0, z: 0}},
	{title: 'TECHNICAL SKILLS', coords: {x: 0, y: 0, z:  cameraDist}},
	{title: 'WORK EXPERIENCE', coords: {x: 0, y: 0, z: -1 * cameraDist}},
	{title: 'PROJECTS', coords: {x: -1 * cameraDist, y: 0, z: 0}},
	{title: 'ABOUT THIS SITE', coords: {x: 0, y: cameraDist, z: 0}},
	{title: 'CONTACT ME', coords: {x: 0, y: -1 * cameraDist, z: 0}}
];

/****************************
 * RENDER THE CUBE *
 ****************************/
generateFaces();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
	TWEEN.update();
    render();
}
function init(materials) {

	var geometry = new THREE.BoxGeometry(cubeDim, cubeDim, cubeDim);

	cube = new THREE.Mesh(geometry,  new THREE.MeshFaceMaterial(materials));
	edges = new THREE.EdgesHelper(cube, titleColor);
	scene.add(cube);
	scene.add(edges);

	animate();
}
function render() {
	renderer.render(scene, camera);
};
/**
 * Create the materials for each face
 * Each face is a 2D canvas that is then converted to a
 * threejs material
 */
function generateFaces() {

	var imgPaths = {
					'captialone': '/assets/C1-logo.png', 
					'berkeleySeal': '/assets/Berkeley-logo.png',
					'berkeleyBear': '/assets/Berkeley-Bear-logo.png',
					'pythonLogo': '/assets/python-logo.png',
					'swiftLogo': '/assets/swift-logo.png',
					'javascriptLogo': '/assets/javascript-logo.png',
					'graphAlgorithms': '/assets/graphAlgorithms.png',
					'quantumSim': '/assets/quantumSim.png'
				};

	//load images then create materials
	loadImages(imgPaths).then(function() {
		var materials = [];
		materials.push(createMaterial(createEducationFace()));
		materials.push(createMaterial(createProjectsFace()));
		materials.push(createMaterial(createAboutSiteFace()));
		materials.push(createMaterial(createContactSection()));
		materials.push(createMaterial(createTechSkillsFace()));
		materials.push(createMaterial(createWorkExpFace()));

		init(materials);
	});
}
function createMaterial(canvas) {
	var material = new THREE.MeshBasicMaterial({map: new THREE.Texture(canvas)});
	material.map.needsUpdate = true;
	material.map.minFilter = THREE.LinearFilter;
	return material;
}
/**
 * Attempt to creat HiDef 2D canvas
 */
function createCanvas() {
	var ratio = getPixelRatio();
    var canvas = document.createElement("canvas");
    canvas.width = cubeDim * ratio;
    canvas.height = cubeDim * ratio;
    canvas.style.width = cubeDim + "px";
    canvas.style.height = cubeDim + "px";
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return canvas;
}
function getPixelRatio() {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
};
/**
 * Code for image preloading.
 * By loading all the images upfront we don't have to deal with messy promises later
 * and since we know we need to draw all of them it 
 * doesn't matter if we load them all at the same time
 */
function loadImages(imgPaths) {
	var promises = [],
		numImages = Object.keys(imgPaths).length,
		deferred = new $.Deferred(),
		cb = function(msg) {
			if (msg != null) {
				console.log(msg);
			}
			numImgsLoaded += 1;
			if (numImgsLoaded === numImages) {
				deferred.resolve('images loaded');
			}
		};

	for (var imgName in imgPaths) {
		if (imgPaths.hasOwnProperty(imgName)) {
			loadImage(imgName, imgPaths[imgName], numImages).then(cb, cb);
		}
	}

    return deferred;
}
function loadImage(name, path, total) {
	return new Promise(function(resolve, reject) {
		var image = new Image();
		image.onload = function() {
			imgDest[name] = image;
			resolve(null);
		}
		image.onerror = function() {
			imgDest[name] = null;
	    	reject("error: image load failed for " + path);
	    };
		image.src = path;
	});
}
function computeImgHeight(image, newWidth) {
	var width = image.width,
					height = image.height,
					scale = newWidth / width;

	return height * scale;
}
/**
 * Code for specifally drawing each face of the cube.
 */
function createEducationFace() {
	var canvas = createCanvas();
	var ctx = canvas.getContext('2d');

	addTitleText(ctx, 'EDUCATION');
	ctx.font= textFont;
	ctx.fillStyle = textColor;
	addCenteredText(ctx, 'University Of California Berkeley', 1);
	addCenteredText(ctx, 'Major: Computer Science', 2);
	addCenteredText(ctx, 'GPA: 3.479', 3);
	addCenteredText(ctx, 'Graduation Date: Spring 2016', 4);

	var image = imgDest['berkeleyBear']
	if (image != null) {
		var newWidth = 400;
		addCenteredImage(ctx, image, newWidth, computeImgHeight(image, newWidth), 4);
	}

	return canvas;
}
function createTechSkillsFace() {
	var canvas = createCanvas();
	var ctx = canvas.getContext('2d');

	addTitleText(ctx, 'TECHNICAL SKILLS');
	ctx.font = textFont;
	ctx.fillStyle = textColor;
	addLeftAlignedText(ctx, 'Programming Languages:', 1);
	ctx.font = smallTextFont;
	addLeftBulletedList(ctx, ['Javascript', 'Html/CSS', 'SOQL'], 2);
	addLeftBulletedList(ctx, ['Python', 'Java', 'Swift'], 3);
	addLeftBulletedList(ctx, ['C', 'C++', 'Obj-C'], 4);
	ctx.font = textFont;
	addLeftAlignedText(ctx, 'Web Technologies:', 5);
	ctx.font = smallTextFont;
	addLeftBulletedList(ctx, ['Jquery', 'D3', 'Angular'], 6);
	addLeftBulletedList(ctx, ['React', 'Gulp', 'Jekyll'], 7);

	var y = getYForLine(7.5),
		width = 100,
		spacing = 30,
		image1 = imgDest['pythonLogo'],
		image2 = imgDest['swiftLogo'],
		image3 = imgDest['javascriptLogo']
		x1 = (cubeDim - 3 * width - 2 * spacing)/2,
		x2 = x1 + width + spacing,
		x3 = x2 + width + spacing;

	ctx.drawImage(image1, x1, y, width, computeImgHeight(image1, width));
	ctx.drawImage(image2, x2, y, width, computeImgHeight(image2, width));
	ctx.drawImage(image3, x3, y, width, computeImgHeight(image3, width));

	return canvas;
}
function createWorkExpFace() {
	var canvas = createCanvas();
	var ctx = canvas.getContext('2d');

	addTitleText(ctx, 'WORK EXPERIENCE');
	ctx.font = textFont;
	ctx.fillStyle = textColor;
	drawCapitalOneSection(ctx, imgDest['capitalone']);
	drawCS10TASection(ctx, imgDest['berkeleySeal']);

	return canvas;
}
function drawCapitalOneSection(ctx, image) {
		addLeftAlignedText(ctx, 'Captial One Bank, San Francisco', 1);
		ctx.font = smallTextFont;
		addLeftAlignedText(ctx, 'Software Development Intern', 2);
		addLeftAlignedText(ctx, 'Date: 6/1/2015-8/7/2015', 3);

		var image = imgDest['captialone'];
		if (image != null) {
			var newWidth = 200;
			addRightAlignedImage(ctx, image, newWidth, computeImgHeight(image, newWidth), 1);
		}
}
function drawCS10TASection(ctx, image) {
		addLeftAlignedText(ctx, 'UC Berkeley', 5);
		ctx.font = smallTextFont;
		addLeftAlignedText(ctx, 'Teaching Assistant, CS 10', 6);
		addLeftAlignedText(ctx, 'Date: 8/21/2014-present', 7);

		var image = imgDest['berkeleySeal'];
		if (image != null) {
			var newWidth = 150;
			addRightAlignedImage(ctx, image, newWidth, computeImgHeight(image, newWidth), 4.5);
		}
}
function createProjectsFace() {
	var canvas = createCanvas();
	var ctx = canvas.getContext('2d');

	addTitleText(ctx, 'PROJECTS');

	ctx.font = textFont;
	ctx.fillStyle = textColor;

	//graph algorithms
	addLeftAlignedText(ctx, 'Graph Algorithms Visualization', 1);
	ctx.font = smallTextFont;
	addLeftAlignedText(ctx, "aaaschmitt.github.io/Visual_Graph_Algorithms", 1.5);

	var image = imgDest['graphAlgorithms'];
	if (image != null) {
		var newWidth = 200;
		addLeftAlignedImage(ctx, image, newWidth, computeImgHeight(image, newWidth), 2);
	}

	//quantum simulation
	ctx.font = textFont;
	addLeftAlignedText(ctx, 'Quantum Physics Simulation', 5.1);
	ctx.font = smallTextFont;
	addLeftAlignedText(ctx, "aaaschmitt.github.io/The_Bloch_Sphere", 5.6);

	image = imgDest['quantumSim'];
	if (image != null) {
		var newWidth = 200;
		addLeftAlignedImage(ctx, image, newWidth, computeImgHeight(image, newWidth), 6.1);
	}

	return canvas;
}
function createAboutSiteFace() {
	var canvas = createCanvas();
	var ctx = canvas.getContext('2d');

	addTitleText(ctx, 'ABOUT THIS SITE');

	ctx.font = largeTextFont;
	ctx.fillStyle = titleColor;
	addCenteredText(ctx, 'Front End:', 1);

	ctx.font = textFont;
	ctx.fillStyle = textColor;
	addCenteredText(ctx, 'React by Facebook', 2);
	addCenteredText(ctx, 'Threejs - rendering this 3D resume', 3);
	addCenteredText(ctx, 'jQuery', 4);
	addCenteredText(ctx, 'LESS - all css on this site', 5);

	ctx.font = largeTextFont;
	ctx.fillStyle = titleColor;
	addCenteredText(ctx, 'Build/Host:', 6);

	ctx.font = textFont;
	ctx.fillStyle = textColor;
	addCenteredText(ctx, 'Built with Gulp and Jekyll', 7);
	addCenteredText(ctx, 'Continuous Integration by travis-ci.org', 8);
	addCenteredText(ctx, 'Hosted On Github', 9);


	return canvas;
}
function createContactSection() {
	var canvas = createCanvas();
	var ctx = canvas.getContext('2d');

	addTitleText(ctx, 'CONTACT ME');

	ctx.font = largeTextFont;
	ctx.fillStyle = textColor;

	addCenteredText(ctx, 'aschmitt@berkeley.edu', 1);
	addCenteredText(ctx, 'Github: aaaschmitt', 2);
	addCenteredText(ctx, 'LinkedIn: Andrew Schmitt', 3)

	return canvas;
}
/**
 * These are all abstractions for drawing different elements on
 * a 2D canvas. Pass the canvas context (ctx) and then the other relevant parameters.
 */
function addTitleText(ctx, title) {
	ctx.font= titleFont;
	ctx.fillStyle = titleColor;
	var width = ctx.measureText(title).width;
	ctx.fillText(title, cubeDim/2 - (width/2), titleH);

	ctx.lineWidth = lineWeight;
	ctx.strokeStyle = titleColor;
	var yCoord = titleH + lineWeight + lineOffset;
	ctx.moveTo(cubeDim/2 - (width/2), yCoord);
	ctx.lineTo(cubeDim/2 + (width/2), yCoord);
	ctx.stroke();
}
function addCenteredText(ctx, text, line) {

	var y = getYForLine(line),
		width = ctx.measureText(text).width,
		x = cubeDim/2 - width/2;

	ctx.fillText(text, x, y);
}
function addLeftAlignedText(ctx, text, line) {
	var y = getYForLine(line),
		x = padding;

	ctx.fillText(text, x, y);
}
function addLeftBulletedList(ctx, items, line) {
	var y = getYForLine(line),
		x = padding + listIndent;
	for (var i = 0; i < items.length; i++) {
		var point = bullet + items[i];
		ctx.fillText(point, x, y);
		x += cubeDim/4;
	}
}
function addCenteredImage(ctx, image, imgWidth, imgHeight, line) {
	var y = getYForLine(line),
		x = cubeDim/2 - imgWidth/2;

	ctx.drawImage(image, x, y, imgWidth, imgHeight);
}
function addRightAlignedImage(ctx, image, imgWidth, imgHeight, line) {
	var y = getYForLine(line),
		x = cubeDim - padding - imgWidth;

	ctx.drawImage(image, x, y, imgWidth, imgHeight);
}
function addLeftAlignedImage(ctx, image, imgWidth, imgHeight, line) {
	var y = getYForLine(line),
		x = padding;

	ctx.drawImage(image, x, y, imgWidth, imgHeight);
}
function getYForLine(line) {
	return titleH + lineWeight + lineOffset + (line * (lineBreakHeight + textH));
}


/**
 * Build the nav bar
 */
function rotateCube(x, y, z) {
	var position = {x: camera.position.x, y: camera.position.y, z: camera.position.z},
		newPosition =  {x: x, y: y, z: z};

	TWEEN.removeAll();
	new TWEEN.Tween(position)
		.to(newPosition, 2000 )
		.onUpdate(function() {
			camera.position.x = this.x;
			camera.position.y = this.y;
			camera.position.z = this.z;
			camera.lookAt(scene.position);
		})
		.easing( TWEEN.Easing.Elastic.InOut)
		.start();
}
var ResumeNav = React.createClass({
	render: function() {
		var items = [];
		for (var i = 0; i < sections.length; i++) {
			var item = sections[i],
				c = sections[i].coords;
			items.push(<div className='resume-item' data-x={c.x} data-y={c.y} data-z={c.z} key={i}>{item.title}</div>);
		}

		return (<div>{items}</div>);
	},

	componentDidMount: function() {
		$('.resume-item').each(function() {
			$(this).on('click', function() {
				var x = +($(this).attr('data-x')),
				y = +($(this).attr('data-y')),
				z = +($(this).attr('data-z'));

				rotateCube(x, y, z);
			})
		})
	}
});

React.render(<ResumeNav/>, $('#resume-nav').get(0));