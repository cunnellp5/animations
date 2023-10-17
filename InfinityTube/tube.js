import * as THREE from 'three';
// import * as Face from 'three/addons/math/ConvexHull.js';

// console.log(Face, 'helo')

let ww = window.innerWidth
let wh = window.innerHeight;

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas")
});

renderer.setSize(ww, wh);

let scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 100, 200);

let camera = new THREE.PerspectiveCamera(45, ww / wh, 0.001, 200);
camera.position.z = 400;

let points = [
  [68.5,185.5],
  [1,262.5],
  [270.9,281.9],
  [345.5,212.8],
  [178,155.7],
  [240.3,72.3],
  [153.4,0.6],
  [52.6,53.3],
  [60.5,180.5]
];

for (var i = 0; i < points.length; i++) {
  var x = points[i][0];
  var y = (Math.random() - i) * 250;
  var z = points[i][1];
  points[i] = new THREE.Vector3(x, y, z);
}

let path = new THREE.CatmullRomCurve3(points);

let geometry = new THREE.TubeGeometry(path, 100, 5, 30, true);



// for(var i = 0, j = geometry.tubularSegments.length; i < j; i++){
//   console.log(geometry.attributes.Face[i], 'defined?')
//   geometry.attributes.Face[i].color = new THREE.Color("hsl("+Math.floor(Math.random()*360)+",50%,50%)");
// }

// geometry.attributes.Face


let material = new THREE.MeshLambertMaterial({
  color: new THREE.Color("hsl("+Math.floor(Math.random()*360)+",50%,50%)"), 
  emissive: new THREE.Color("hsl("+Math.floor(Math.random()*360)+",50%,50%)"),
  side: THREE.BackSide,
  wireframe: true,
  vertexColors: THREE.VertexColors,
  emissiveIntensity: 10
})

var tube = new THREE.Mesh( geometry, material );

scene.add( tube );

var light = new THREE.PointLight(0xffffff,6, 200);

scene.add(light);

var percentage = 0;

function render(){
  percentage += 0.0001;
  var p1 = path.getPointAt(percentage % 1);
  var p2 = path.getPointAt((percentage + 0.03)%1);
  camera.position.set(p1.x,p1.y,p1.z);
  camera.lookAt(p2);
  light.position.set(p2.x, p2.y, p2.z);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);