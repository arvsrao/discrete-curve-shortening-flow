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

const r = 20;
const N = 50;
const points = [];

for (let i = 0; i < N; i++) {
	const angle = (i / N) * 2 * Math.PI;
	points.push( new THREE.Vector3(r* Math.cos(angle), r * Math.sin(angle), 0));
}

// close up circle
points.push(points[0]);

// debug. print out all the circle points
for (let i = 0; i < points.length; i++) {
	console.log("index: %d , point %o", i, points[i])
}

const geometry = new THREE.BufferGeometry().setFromPoints( points );
const line     = new THREE.Line( geometry, material );
scene.add( line );
renderer.render( scene, camera );