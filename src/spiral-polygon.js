import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();

//create a blue LineBasicMaterial
const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

const b = 30;
const winding_number = 2;
const N = 50;
const points  = [];
const normals = [];

for (let i = 0; i < N; i++) {
	const angle = (i / N) * winding_number * 2 * Math.PI;
	const r     = litus(b, angle); 
	points.push( new THREE.Vector3(r * Math.cos(angle), r * Math.sin(angle), 0));
	normals.push( new THREE.Vector3( Math.cos(angle), Math.sin(angle), 0));
}

for (let i = N - 1; i > 0; i--) {
	const angle = (i / N) * winding_number * 2 * Math.PI;
	const r     = litus(b - 5, angle); 
	points.push( new THREE.Vector3(r * Math.cos(angle), r * Math.sin(angle), 0));
	normals.push( new THREE.Vector3( Math.cos(angle), Math.sin(angle), 0));
}

// close up polygon
points.push(points[1]);

function archimedes(b, angle) {
	return b/15 * angle;
}

function litus(b, angle) {
	return b / Math.sqrt(angle);
}

function hyperbolic(b, angle) {
	return b / angle;
}

//points.push( new THREE.Vector3(r, 0, 0));
const geometry = new THREE.BufferGeometry().setFromPoints( points );
const line     = new THREE.Line( geometry, material );
scene.add( line );
renderer.render( scene, camera );