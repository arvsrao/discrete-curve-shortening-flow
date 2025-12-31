import * as THREE from 'three';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';


function archimedes(b, angle) {
	return b/15 * angle;
}

function litus(b, angle) {
	return b / Math.sqrt(angle);
}

function hyperbolic(b, angle) {
	return b / angle;
}

function mod(a, b) {
	return (a % b) + (a > -1 ? 0 : b); 
}

let play    = false;
const DEBUG = false;
const delta = 0.15;
let count   = 0;
let camera, scene, renderer, material, geometry;

const checkbox = document.querySelector("#playpause");

checkbox.addEventListener("change", () => {
  if (!checkbox.checked) {
		play = true;
	    console.log('Play!!');
		animate();
  } else {
		play = false;
		console.log('Pause!!');
  }
});

$(document).ready(function() {
  var btn = $(".btn-arrow");
  btn.click(function() {
  	play = false;
	  console.log('Next!!');
		animate();
    return false;
  });
});

// create spiral polygon
let points = create_spiral();

init();
animate();

/**
 * Create spiral polygon and then deform it via discrete curve shortening flow.
 */
function create_spiral() {
	const b              = 30;
	const winding_number = 2;
	const N              = 50;
	const p              = [];

	for (let i = 1; i < N; i++) {
		const angle = (i / N) * winding_number * 2 * Math.PI;
		const r     = litus(b, angle); 
		p.push( new THREE.Vector3(r * Math.cos(angle), r * Math.sin(angle), 0));
	}

	for (let i = N - 1; i > 0; i--) {
		const angle = (i / N) * winding_number * 2 * Math.PI;
		const r     = litus(b - 5, angle); 
		p.push( new THREE.Vector3(r * Math.cos(angle), r * Math.sin(angle), 0));
	}

	// close up polygon
	p.push(p[0]);

	if (DEBUG) {
		console.log(points.length-1);
		for (let i = 0; i < points.length; i++) {
			console.log("index: %d , point %o", i, points[i])
		}
	}
	return p;
}

function flow(p) {
	const q = [];

	for (let i = 0; i < p.length - 1; i++) {

		// compute approximate normal at i-th index
		const idx = mod(i-1, p.length - 1);
		const idy = mod(i+1, p.length - 1);
		const n = new THREE.Vector3(0,0,0).addVectors(p[idy], p[idx]).addScaledVector(p[i], -2);

		if (DEBUG) {
			console.log("neigbhoring indicies are %o and %o", idx, idy);
			console.log(n);	
		}

		// compute new point
		q.push(p[i].addScaledVector(n, delta)); 
	}
	q.push(q[0]);
	return q;
}

function animate() {

  // reference: https://fmennen.de/post/passing-variables-from-java-script-to-html
  document.getElementById("info").innerHTML = "iteration: " + count++ + "    ||    &delta; = " + delta;

	geometry.setFromPoints( points );
	let line     = new THREE.Line( geometry, material );

	scene.add( line );
	points = flow(points);

	renderer.render( scene, camera );
	
	if (play)
		requestAnimationFrame( animate );
}

/** 3.js boilerplate setup -------------------------------------------------------------------*/

function init() {
	renderer = new SVGRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
	camera.position.set( 0, 0, 100 );
	camera.lookAt( 0, 0, 0 );

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xC89D7C); // also sets background to khaki

	//create a LineBasicMaterial
	material = new THREE.LineBasicMaterial({
	 color: 0xff0000, // red
	 linewidth: 3 // width of line
	});

	geometry = new THREE.BufferGeometry();
}


