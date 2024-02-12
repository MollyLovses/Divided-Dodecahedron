/*=========================================================================================
	Item Name: Divided Dodecahedron
    Module: three.js
	Version: 1.0
	Author: Sergey Patokin
    Last Update: 02.12.2024
	Author URL: https://sergeyforever.online/
===========================================================================================*/

import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/dat.gui.module.js';

import { EffectComposer } from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/UnrealBloomPass.js';



const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111); // Set background color to black
//scene.background = new THREE.Color(0xffffff); // Set background color to white

let camera, renderer, controls;
const frustumSize = 7;

// Create an empty object to store labels mapped to positions
const labelsMap = {};

const faces = []; // Dodecahedron faces
const sub1faces = []; // The first subdivision faces
const sub2faces = []; // The second subdivision faces
const sub3faces = []; // The third subdivision faces
const sub4faces = []; // The fouth subdivision faces
const sub5faces = []; // ...
const sub6faces = []; // ...
const sub7faces = []; // ...

let coords = []; // Coordinates for dodecahedron
let sub1coords = []; // Coordinates for the first subdivision faces
let sub2coords = []; // Coordinates for the second subdivision faces
let sub3coords = []; // Coordinates for the third subdivision faces
let sub4coords = []; // Coordinates for the fouth subdivision faces
let sub5coords = []; // ...
let sub6coords = []; // ...
let sub7coords = []; // ...
let deltaDiv = 0.4; // Delta for deviation

const sub2deviations = []; //////////////////////////////////////////

const zeroVector = new THREE.Vector3(0, 0, 0);

const guiControls = {
  showLabels: true, // Initial state: labels are visible
  face1: true,
  face2: true,
  face3: true,
  face4: true,
  face5: true,
  face6: true,
  face7: true,
  face8: true,
  face9: true,
  face10: true,
  face11: true,
  face12: true
};

init();
animate();

function init() {

    // Renderer Settings //
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0x000000, 0.0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Camera Setting //
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, 
    frustumSize / 2, frustumSize / - 2, 0.1, 100 );
    camera.position.z = 5;

    // Control Settings //
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;   
  
  	
  

    // Create a regular dodecahedron geometry
    const geometryDodecahedron = new THREE.DodecahedronGeometry(2);

    // Add the dodecahedron to the scene
    //scene.add(dodecahedron);

    // Position the camera
    camera.position.z = 15;

    // Ensure the geometry is initialized before accessing vertices
    geometryDodecahedron.computeBoundingBox(); // Force the geometry to be computed

    // Vertices
    const positions = geometryDodecahedron.attributes.position.array;
    const vertices = [];
    for (let i = 0; i < positions.length; i += 3) {
      vertices.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
    }

    // Coordinates for dodecahedron
    coords = [[vertices[4],vertices[7],vertices[31],vertices[22],vertices[13]],
              [vertices[0],vertices[1],vertices[4],vertices[7],vertices[2]],
              [vertices[1],vertices[9],vertices[10],vertices[13],vertices[4]],
              [vertices[10],vertices[13],vertices[22],vertices[19],vertices[18]],
              [vertices[19],vertices[22],vertices[31],vertices[28],vertices[27]],
              [vertices[28],vertices[31],vertices[7],vertices[2],vertices[40]],
              [vertices[18],vertices[19],vertices[27],vertices[36],vertices[72]],
              [vertices[27],vertices[28],vertices[40],vertices[37],vertices[36]],
              [vertices[37],vertices[40],vertices[2],vertices[0],vertices[64]],
              [vertices[0],vertices[1],vertices[9],vertices[82],vertices[64]],
              [vertices[72],vertices[18],vertices[10],vertices[9],vertices[82]],
              [vertices[37],vertices[36],vertices[72],vertices[82],vertices[64]]];

    // Print all points
    /*for (let i = 0; i < vertices.length; i += 1){
      console.log(
        i + " - x: " + vertices[i].x.toFixed(2) +
        " y: " + vertices[i].y.toFixed(2) +
        " z: " + vertices[i].z.toFixed(2)
      );
    }*/


  
  	let facesLabels = [];

    // Create faces for dodecahedron
    /*for (let i = 0; i < coords.length; i += 1){
      faces.push(createFace([coords[i][0],coords[i][1],coords[i][2],coords[i][3],coords[i][4]]));
      // Create text labels for each point
      facesLabels.push(addLabel(center3D(coords[i]), i+1));
      for (let j = 0; j < 5; j += 1)
        addLabel(coords[i][j], `(${coords[i][j].x.toFixed(2)}, ${coords[i][j].y.toFixed(2)}, ${coords[i][j].z.toFixed(2)})`);
    }*/
  
  

  	let coordinates = [];
  
	/*
    // Create subdivision faces
    for(let i = 0; i < coords.length; i += 1){
      sub1coords = faceDivision(coords[i], 1);
      for(let j = 0; j < sub1coords.length; j += 1){
        //console.log(`Area ${j}: ${calculateAreaOfFace(sub1coords[j])}`);
        //const face = createFace(sub1coords[j]);
        //sub1faces.push(face);
        //scene.add(face);
        //coordinates.push(sub1coords[j]);
        sub1faces.push(createFace(sub1coords[j]));
        sub2coords = faceDivision(sub1coords[j].slice(1,6), 2);
        for(let k = 0; k < sub2coords.length; k += 1){
          //console.log(`Area ${k}: ${calculateAreaOfFace(sub2coords[k])}`);
          const face = createFace(sub2coords[k]);
          sub2faces.push(face);
          //scene.add(face);
          coordinates.push(sub2coords[k]);
          //sub2faces.push(createFace(sub2coords[k]));
          //sub3coords = faceDivision(sub2coords[k].slice(1,6), 3);
          for(let o = 0; o < sub3coords.length; o += 1){
            //console.log(`Area ${o}: ${calculateAreaOfFace(sub3coords[o])}`);
            //console.log(sub3coords[o]);
            const face = createFace(sub3coords[o]);
            sub3faces.push(face);
            //coordinates.push(sub3coords[o]);
            scene.add(face);
          	//sub3faces.push(createFace(sub3coords[o]));
          	//sub4coords = faceDivision(sub3coords[o].slice(1,6), 4);
            for(let l = 0; l < sub4coords.length; l += 1){
              //console.log(`Area ${l}: ${calculateAreaOfFace(sub4coords[l])}`);
              const face = createFace(sub4coords[l]);
              //console.log(sub4coords[l]);
              sub4faces.push(face);
              //coordinates.push(sub4coords[l]);
              scene.add(face);
              //sub4faces.push(createFace(sub4coords[l]));
              //sub5coords = faceDivision(sub4coords[l].slice(1, 6), 5);
              for (let m = 0; m < sub5coords.length; m += 1) {
                sub5faces.push(createFace(sub5coords[m]));
                sub6coords = faceDivision(sub5coords[m].slice(1, 6), 6);
                coordinates.push(sub5coords[m]);
                for (let n = 0; n < sub6coords.length; n += 1) {
                  //console.log(`Area ${n}: ${calculateAreaOfFace(sub6coords[n])}`);
                  const face = createFace(sub6coords[n]);
                  sub6faces.push(face);
                  scene.add(face);
                  // Continue adding more subdivisions if needed
                }
              }
            }
          }
      	}
      }
    }
    */

  
  
  	/*
    // Create subdivision1 faces
    for(let i = 0; i < coords.length; i += 1){
      sub1coords = faceDivision(coords[i], 1);
      for(let j = 0; j < sub1coords.length; j += 1){
        const face = createFace(sub1coords[j]);
        sub1faces.push(face);
        //scene.add(face);
        coordinates.push(sub1coords[j]);
      }
    }  
	*/


  
  	/*
    // Create subdivision2 faces
    for(let i = 0; i < coords.length; i += 1){
      sub1coords = faceDivision(coords[i], 1);
      for(let j = 0; j < sub1coords.length; j += 1){
        sub1faces.push(createFace(sub1coords[j]));
        sub2coords = faceDivision(sub1coords[j].slice(1,6), 2);
        for(let k = 0; k < sub2coords.length; k += 1){
          const face = createFace(sub2coords[k]);
          sub2faces.push(face);
          //scene.add(face);
          coordinates.push(sub2coords[k]);
      	}
      }
    }  
	*/



  	
    // Create subdivision3 faces
    for(let i = 0; i < coords.length; i += 1){
      sub1coords = faceDivision(coords[i], 1);
      for(let j = 0; j < sub1coords.length; j += 1){
        sub1faces.push(createFace(sub1coords[j]));
        sub2coords = faceDivision(sub1coords[j].slice(1,6), 2);
        for(let k = 0; k < sub2coords.length; k += 1){
          sub2faces.push(createFace(sub2coords[k]));
          sub3coords = faceDivision(sub2coords[k].slice(1,6), 3);
          for(let o = 0; o < sub3coords.length; o += 1){
            const face = createFace(sub3coords[o]);
            sub3faces.push(face);
            //scene.add(face);
            coordinates.push(sub3coords[o]);
          }
      	}
      }
    }
	

  
  
    /*
    // Create subdivision4 faces
    for(let i = 0; i < coords.length; i += 1){
      sub1coords = faceDivision(coords[i], 1);
      for(let j = 0; j < sub1coords.length; j += 1){
        sub1faces.push(createFace(sub1coords[j]));
        sub2coords = faceDivision(sub1coords[j].slice(1,6), 2);
        for(let k = 0; k < sub2coords.length; k += 1){
          sub2faces.push(createFace(sub2coords[k]));
          sub3coords = faceDivision(sub2coords[k].slice(1,6), 3);
          for(let o = 0; o < sub3coords.length; o += 1){
          	sub3faces.push(createFace(sub3coords[o]));
          	sub4coords = faceDivision(sub3coords[o].slice(1,6), 4);
            for(let l = 0; l < sub4coords.length; l += 1){
              const face = createFace(sub4coords[l]);
              sub4faces.push(face);
              //scene.add(face);
              coordinates.push(sub4coords[l]);
            }
          }
      	}
      }
    }
    */
  
  
  
    /*
    // Create subdivision5 faces
    for(let i = 0; i < coords.length; i += 1){
      sub1coords = faceDivision(coords[i], 1);
      for(let j = 0; j < sub1coords.length; j += 1){
        sub1faces.push(createFace(sub1coords[j]));
        sub2coords = faceDivision(sub1coords[j].slice(1,6), 2);
        for(let k = 0; k < sub2coords.length; k += 1){
          sub2faces.push(createFace(sub2coords[k]));
          sub3coords = faceDivision(sub2coords[k].slice(1,6), 3);
          for(let o = 0; o < sub3coords.length; o += 1){
          	sub3faces.push(createFace(sub3coords[o]));
          	sub4coords = faceDivision(sub3coords[o].slice(1,6), 4);
            for(let l = 0; l < sub4coords.length; l += 1){
              sub4faces.push(createFace(sub4coords[l]));
              sub5coords = faceDivision(sub4coords[l].slice(1, 6), 5);
              for (let m = 0; m < sub5coords.length; m += 1) {
                const face = createFace(sub5coords[m]);
                sub5faces.push(face);
                //scene.add(face);
                coordinates.push(sub5coords[m]);
              }
            }
          }
      	}
      }
    }
    */
  
  

  	/*
    // Create subdivision6 faces
    for(let i = 0; i < coords.length; i += 1){
      sub1coords = faceDivision(coords[i], 1);
      for(let j = 0; j < sub1coords.length; j += 1){
        sub1faces.push(createFace(sub1coords[j]));
        sub2coords = faceDivision(sub1coords[j].slice(1,6), 2);
        for(let k = 0; k < sub2coords.length; k += 1){
          sub2faces.push(createFace(sub2coords[k]));
          sub3coords = faceDivision(sub2coords[k].slice(1,6), 3);
          for(let o = 0; o < sub3coords.length; o += 1){
          	sub3faces.push(createFace(sub3coords[o]));
          	sub4coords = faceDivision(sub3coords[o].slice(1,6), 4);
            for(let l = 0; l < sub4coords.length; l += 1){
              sub4faces.push(createFace(sub4coords[l]));
              sub5coords = faceDivision(sub4coords[l].slice(1, 6), 5);
              for (let m = 0; m < sub5coords.length; m += 1) {
                sub5faces.push(createFace(sub5coords[m]));
                sub6coords = faceDivision(sub5coords[m].slice(1, 6), 6);
                for (let n = 0; n < sub6coords.length; n += 1) {
                  const face = createFace(sub6coords[n]);
                  sub6faces.push(face);
                  //scene.add(face);
                  coordinates.push(sub6coords[n]);
                }
              }
            }
          }
      	}
      }
    }
  	*/
  
  

  
  
    // Putting coordinates on a sphere //
  
    const sphereRadius = 1.7;
    const geometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xaaaaaa }));
  
    for (let i = 0; i < coordinates.length; i += 1) {

      //console.log(coordinates[i]);
      for (let j = 0; j < coordinates[i].length; j += 1) {
        //const line = createFace([zeroVector, coordinates[i][j]]);
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([zeroVector, coordinates[i][j]]);
        const line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
        //scene.add(line);
        
        var direction = new THREE.Vector3().copy(coordinates[i][j]).sub(zeroVector).normalize();
        var toSphereCenter = new THREE.Vector3().copy(sphere.position).sub(zeroVector);

        var projectionLength = toSphereCenter.dot(direction);
        var closestPointOnLine = zeroVector.clone().add(direction.clone().multiplyScalar(projectionLength));

        var distanceToSphereCenter = closestPointOnLine.distanceTo(sphere.position);

        if (distanceToSphereCenter <= sphereRadius) {
            // Intersection detected, calculate intersection points
            var offset = Math.sqrt(sphereRadius * sphereRadius - distanceToSphereCenter * distanceToSphereCenter);
            var intersectionPoint = closestPointOnLine.clone().add(direction.clone().multiplyScalar(offset));
            coordinates[i][j] = intersectionPoint;
            //console.log("Intersection Points:", intersectionPoint);
        } else {
            //console.log("No intersection");
        }
      }
      const face = createFace(coordinates[i]);
      scene.add(face);

    }
  
  

  	
  
  	
  	// JSON parsing //
  
    /*async function fetchData(path) {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON: ${response.statusText}`);
        }
        const data = await response.json();

        for (let i = 0; i < data.length; i += 1) {
          const face = createFace(data[i]);
          scene.add(face);
          //console.log(data[i]);
        }
      } catch (error) {
        console.error('Error fetching JSON:', error);
      }
    }

    fetchData("./data/sub4coords.json");*/
  
  
  	/*
  	// Converting JavaScript object to JSON string //
  
	var jsonContent = JSON.stringify(coordinates);
  
  
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  	*/
  
  
  
  
  
  	/*for(let i = 0; i < sub2deviations.length; i += 1){
      console.log(`Deviations: ${sub2deviations[i]}`);
    }*/
	
  	
  
  

  
  
  
  
  

    // GUI //
  	const gui = new GUI();

    /*
    // Add the control for toggling label visibility to the GUI
    gui.add(guiControls, 'showLabels').onChange((value) => {
      // Toggle visibility of labels based on the checkbox state
      for (const positionKey in labelsMap) {
        labelsMap[positionKey].visible = value;
      }
    });
  
  	const facesFolder = gui.addFolder('Faces');
    for (let i = 0; i < 12; i++) {
      facesFolder.add(guiControls, `face${i+1}`).onChange((value) => {
        faces[i].visible = value;
        if(guiControls.showLabels)facesLabels[i].visible = value;
      });
    }
    */
  


    // Additional Functions //
    window.addEventListener( 'resize', onWindowResize );
    onWindowResize();

}



// Area calculation
function calculateAreaOfFace(vertices) {
  // Calculate the area by breaking the face into triangles
  const numVertices = vertices.length;
  let totalArea = 0;

  // Iterate through vertices to form triangles and calculate their areas
  for (let i = 1; i < numVertices - 1; i++) {
    const v0 = vertices[0];
    const v1 = vertices[i];
    const v2 = vertices[i + 1];

    // Calculate two vectors along the edges of the triangle
    const vector1 = new THREE.Vector3().subVectors(v1, v0);
    const vector2 = new THREE.Vector3().subVectors(v2, v0);

    // Calculate the cross product of the vectors to get the area of the triangle
    const crossProduct = new THREE.Vector3().crossVectors(vector1, vector2);
    const triangleArea = 0.5 * crossProduct.length();

    // Sum the areas of the triangles to get the total area of the face
    totalArea += triangleArea;
  }

  return totalArea;
}



// VECTORS CALCULATION FUNCTIONS //

// Find a center of line in 3D
function center1D(vectorA, vectorB){

  // Calculate the midpoint between the two vectors
  const centerX = (vectorA.x + vectorB.x) / 2;
  const centerY = (vectorA.y + vectorB.y) / 2;
  const centerZ = (vectorA.z + vectorB.z) / 2;

  return new THREE.Vector3(centerX, centerY, centerZ);
}

// Find a center of plane in 3D
function center3D(coordinates) {

  const centroid = new THREE.Vector3();
  for (let i = 0; i < coordinates.length; i++) {
    centroid.add(coordinates[i]);
  }
  centroid.divideScalar(coordinates.length);
  
  return centroid;
  
  /*
  // Initialize sums for x, y, and z values
  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  // Calculate the sum of x, y, and z values
  for (let i = 0; i < coordinates.length; i++) {
    sumX += coordinates[i].x;
    sumY += coordinates[i].y;
    sumZ += coordinates[i].z;
  }

  // Calculate the average of x, y, and z values
  const avgX = sumX / coordinates.length;
  const avgY = sumY / coordinates.length;
  const avgZ = sumZ / coordinates.length;

  // Create and return a new THREE.Vector3 representing the center
  return new THREE.Vector3(avgX, avgY, avgZ);*/
  
}

// Move vector away from another vector
function moveVectorAway(vectorA, vectorB, delta) {  
  // Calculate the direction from vectorA to vectorB
  const direction = new THREE.Vector3().subVectors(vectorB, vectorA).normalize();

  // Calculate the displacement by multiplying the direction by the fixed distance
  const displacement = direction.multiplyScalar(delta);

  // Add the displacement to vectorA to get the moved vector
  const movedVector = new THREE.Vector3().addVectors(vectorB, displacement);

  return movedVector;
}

// Move vector cloer to another vector
function moveVectorCloser(vectorA, vectorB, delta) {
  // Calculate the direction from vectorB to vectorA
  const direction = new THREE.Vector3().subVectors(vectorA, vectorB).normalize();

  // Calculate the displacement by multiplying the direction by the fixed distance
  const displacement = direction.multiplyScalar(-delta);

  // Subtract the displacement from vectorA to get the moved vector closer
  const movedVector = new THREE.Vector3().subVectors(vectorB, displacement);

  return movedVector;
}

// Normal vector calculation
function calculateNormalVector(vertices) {
  // Ensure there are at least three vertices
  if (vertices.length < 3) {
    return null; // Insufficient vertices to compute the normal
  }

  const v0 = vertices[0];
  const v1 = vertices[1];
  const v2 = vertices[2];

  // Calculate two vectors along the edges of the triangle
  const vector1 = new THREE.Vector3().subVectors(v1, v0);
  const vector2 = new THREE.Vector3().subVectors(v2, v0);

  // Calculate the cross product of the vectors to get the normal vector
  const normalVector = new THREE.Vector3().crossVectors(vector1, vector2).normalize();

  return normalVector;
}



// FACES CALCULATION FUNCTIONS //

// Face creation
function createFace(vertices){

  vertices.push(vertices[0]); // to close geometry
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
  const face = new THREE.Line(geometry, material);
  //scene.add(face);
  return face;

}

// Face division
function faceDivision(coordinates, division, delta = 0){
  
  // Calculate the centroid of the face
  const centroid = center3D(coordinates);

  const originalArea = calculateAreaOfFace(coordinates); // Function to calculate the area of the original face
  let newArea;

  if(delta == 0){ // originalArea/17.52436972951624; – from area variable
    if(division == 1) delta = originalArea/17.52436972951624; // For the first division
    else if(division == 2) delta = originalArea/17.52436972951624; // For the second division
    else if(division == 3) delta = originalArea/17.52436972951624; // For the third division
    else if(division >= 4) delta = originalArea/17.52436972951624; // For the fouth division
  }
  
  // Calculate the area of the new face (1/5th of the original face)
  if(division == 1) newArea = originalArea / 7.63855; // For the first division
  else if(division == 2) newArea = originalArea / 5.63855; // For the second division
  else if(division == 3) newArea = originalArea / 5.63855; // For the third division
  else if(division >= 4) newArea = originalArea / 5.63855; // For the fouth division

  // Get the coordinates for the new face at the centroid
  // Calculate the scaling factor for the new face based on area
  const scaleFactor = Math.sqrt(newArea / originalArea);

  // Create the new coordinates by scaling down the original coordinates from the centroid
  let newFaceCoordinates = [];
  for (let i = 0; i < coordinates.length; i++) {
    const vectorFromCentroid = new THREE.Vector3().subVectors(coordinates[i], centroid);
    const scaledVector = vectorFromCentroid.multiplyScalar(scaleFactor);
    const newCoordinate = new THREE.Vector3().addVectors(centroid, scaledVector);
    newFaceCoordinates.push(newCoordinate);
  }
  
  //addLabel(coordinates[0], "o");
  //addLabel(newFaceCoordinates[0], "x");
  let subCoords = [];
  
  ///////////////////////////////// FINDING COORDINATES BEGIN /////////////////////////////////
  if(false/*division == 2*/){ 
    /*let areasEqual = false;
    const startFaceCoordinates = newFaceCoordinates;
    let rands = [];
    let range = 0.1; // Range for deviation

    function getRandomNumber(min, max) {
      return Math.random() * (max - min) + min;
    }

    while(!areasEqual){
      subCoords = [];
      rands = [];
      newFaceCoordinates = Array.from(startFaceCoordinates);
      let rand;

      for(let i = 0; i < newFaceCoordinates.length; i += 1){
          rand = getRandomNumber(-range, range);
          rands.push(rand);
          newFaceCoordinates[i] = moveVectorAway(coordinates[i], newFaceCoordinates[i], rand);
      }

      const normalVector = calculateNormalVector(coordinates);

      // Rotate the new face by 180 degrees around the normal of the original face's plane
      const axisOfRotation = new THREE.Vector3().copy(normalVector).normalize();
      const angleOfRotation = Math.PI; // 180 degrees in radians

      const quaternion = new THREE.Quaternion().setFromAxisAngle(axisOfRotation, angleOfRotation);

      const zeroVector = new THREE.Vector3(0, 0, 0);

      // Apply the rotation to each point of newFaceCoordinates around the centroid
      for (let i = 0; i < newFaceCoordinates.length; i++) {
        const vectorFromCentroid = new THREE.Vector3().subVectors(newFaceCoordinates[i], centroid);
        vectorFromCentroid.applyQuaternion(quaternion);
        const rotatedCoord = new THREE.Vector3().addVectors(centroid, vectorFromCentroid);
        // Move vectors away from the dodecahedron center
        const movedCoord = moveVectorAway(zeroVector, rotatedCoord, delta);
        newFaceCoordinates[i].copy(movedCoord);
      }

      subCoords.push(newFaceCoordinates);

      for(let i = 0; i < 5; i += 1){
        subCoords.push([newFaceCoordinates[i], 
                        center1D(coordinates[(i + 2) % 5], coordinates[(i + 3) % 5]),
                        moveVectorCloser(zeroVector, coordinates[(i + 3) % 5], delta),
                        center1D(coordinates[(i + 3) % 5], coordinates[(i + 4) % 5]),
                        newFaceCoordinates[(i + 1) % 5]]);
      }

      const areas = [];
      for(let i = 0; i < subCoords.length; i += 1){
        const area = calculateAreaOfFace(subCoords[i]);
        areas.push(area);
      }

      areasEqual = true;

      let arr = areas;

      let difference = 0;
      const maxDeviation = 0.002;//0.005;

      for (let i = 1; i < arr.length; i++) {
        difference = Math.abs(arr[i] - arr[i - 1]);
        if(difference > maxDeviation){ 
          areasEqual = false; 
          break; 
        }
      }
	  
      //range = difference/2;

      console.log(`Difference: ${difference}   Max deviation: ${maxDeviation}`);
    }
    console.log(`FINISH ONE!`);
    sub2deviations.push(rands);*/
  } 
  else ///////////////////////////////// FINDING COORDINATES END /////////////////////////////////
  {
    const normalVector = calculateNormalVector(coordinates);

    // Rotate the new face by 180 degrees around the normal of the original face's plane
    const axisOfRotation = new THREE.Vector3().copy(normalVector).normalize();
    const angleOfRotation = Math.PI; // 180 degrees in radians

    const quaternion = new THREE.Quaternion().setFromAxisAngle(axisOfRotation, angleOfRotation);

    // Apply the rotation to each point of newFaceCoordinates around the centroid
    for (let i = 0; i < newFaceCoordinates.length; i++) {
      const vectorFromCentroid = new THREE.Vector3().subVectors(newFaceCoordinates[i], centroid);
      vectorFromCentroid.applyQuaternion(quaternion);
      const rotatedCoord = new THREE.Vector3().addVectors(centroid, vectorFromCentroid);
      // Move vectors away from the dodecahedron center
      const movedCoord = moveVectorAway(zeroVector, rotatedCoord, delta);
      newFaceCoordinates[i].copy(movedCoord);
    }

    subCoords.push(newFaceCoordinates);

    for(let i = 0; i < 5; i += 1){
      subCoords.push([newFaceCoordinates[i], 
                      center1D(coordinates[(i + 2) % 5], coordinates[(i + 3) % 5]),
                      moveVectorCloser(zeroVector, coordinates[(i + 3) % 5], delta),
                      center1D(coordinates[(i + 3) % 5], coordinates[(i + 4) % 5]),
                      newFaceCoordinates[(i + 1) % 5]]);
    }
  }
  
  
  return subCoords; // Coordinates for 5 subdivision faces
  
}



// LABEL FUNCTIONS //

// Function to create a text label for a point
function createTextLabel(text, position) {
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = '12px Arial';
  context.fillStyle = 'white';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.scale.set(2.75, 1.5, 1.0); // Adjust size of the text label

  return sprite;
  
}

// Function to check if a label exists at a specific point
function labelExists(position) {
  
  return labelsMap[position] !== undefined;
  
}

// Function to add a label at a specific point if it doesn't already exist
function addLabel(point, text) {
  
  const positionKey = `${point.x.toFixed(2)},${point.y.toFixed(2)},${point.z.toFixed(2)}`;
  if (!labelExists(positionKey)) {
    //const labelText = `(${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`;
    const labelText = text;
    const label = createTextLabel(labelText, point);
    labelsMap[positionKey] = label;
    scene.add(label);
    return label;
  }
  
}



function animate() {
    requestAnimationFrame(animate);

    /*
    // Delta changing //
    
    deltaDiv += 0.0001;
  	console.log(deltaDiv);

    for (let i = 0; i < coords.length; i += 1) {
        sub1coords = faceDivision(coords[i], deltaDiv);
        for (let j = 0; j < sub1coords.length; j += 1) {
            const area = calculateAreaOfFace(sub1coords[j]);
            const face = createFace(sub1coords[j]);
            
            // Add the face to the scene
            scene.add(face);
            
            // Schedule the removal of the face after a delay
            setTimeout(() => {
                scene.remove(face);
            }, 100); // Adjust the delay (in milliseconds) as needed
        }
    }
    */
    

    renderer.render(scene, camera);
    controls.update();
}

function onWindowResize() {

    const aspect = window.innerWidth / window.innerHeight;

    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;

    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}