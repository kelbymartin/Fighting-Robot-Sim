"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

// Initialize light and material variables
var lightPosition = vec4(2.0, -5.0, 1.0, 0.0 );
var lightAmbient = vec4(0.75, 0.75, 0.75, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.1745, 0.01175, 0.01175, 1.0 );
var materialDiffuse = vec4( 0.61424, 0.04136, 0.04136, 1.0);
var materialSpecular = vec4( 0.727811, 0.626959, 0.626959, 1.0 );
var materialShininess = 0.6;

var ambientColor, diffuseColor, specularColor;
//

var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;

//2

var torsor2Id = 0;
var headr2Id  = 1;
var head1r2Id = 1;
var head2r2Id = 10;
var leftUpperArmr2Id = 2;
var leftLowerArmr2Id = 3;
var rightUpperArmr2Id = 4;
var rightLowerArmr2Id = 5;
var leftUpperLegr2Id = 6;
var leftLowerLegr2Id = 7;
var rightUpperLegr2Id = 8;
var rightLowerLegr2Id = 9;

var stackr2 = [];

var figurer2 = [];


//2

var torsoHeight = 5.0;
var torsoWidth = 1.0;
var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth = 1.0;

var numNodes = 10;
var numAngles = 11;
var angle = 0;

var theta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);
//2
for( var i=0; i<numNodes; i++) figurer2[i] = createNoder2(null, null, null, null);
//2

var vBuffer;
var modelViewLoc;

// Add buffer and array for normals
var nBuffer;
var normalsArray = [];
//

var pointsArray = [];

//button variables

	//dodging
	var r1dod = false;
	var r1dodamt = 0.0;
	var r1dodcnt = 0;
	var r2dod = false;
	var r2dodamt = 0.0;
	var r2dodcnt = 0;

	//right punch
	var r1rightpunch = false;
	var r1rightpunchamt = 0.0;
	var r1rightpunchcnt = 0;
	var r1rightpunchcnt2 = 0;
	var r2rightpunch = false;
	var r2rightpunchamt = 0.0;
	var r2rightpunchcnt = 0;
	var r2rightpunchcnt2 = 0;

	//left punch
	var r1leftpunch = false;
	var r1leftpunchamt = 0.0;
	var r1leftpunchcnt = 0;
	var r1leftpunchcnt2 = 0;
	var r2leftpunch = false;
	var r2leftpunchamt = 0.0;
	var r2leftpunchcnt = 0;
	var r2leftpunchcnt2 = 0;

	//block
	var r1blk = false;
	var r2blk = false;
	
	//win
	var r1w = false;
	var r1wamt = 0.0;
	var r1wcnt = 0;
	var r2w = false;
	var r2wamt = 0.0;
	var r2wcnt = 0;
	
	//Simulate
	var simulate = false;
	var simcnt = 0;

//button variables

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId:

    m = rotate(theta[torsoId], 0, 1, 0 );
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:


    m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	m = mult(m, rotate(theta[head1Id], 1, 0, 0))
	m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftUpperArmId, null);
    break;


    case leftUpperArmId:

    m = translate(-(torsoWidth+upperArmWidth), 0.9*torsoHeight, 0.0);
	m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
	m = mult(m, rotateX(120));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:

    m = translate(torsoWidth+upperArmWidth, 0.9*torsoHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
	m = mult(m, rotateX(120));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:

    m = translate(-(torsoWidth+upperLegWidth), 0.1*upperLegHeight, 0.0);
	m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:

    m = translate(torsoWidth+upperLegWidth, 0.1*upperLegHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
    break;

    case leftLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
	m = mult(m, rotateX(-90));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
	m = mult(m, rotateX(-90));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    }

}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth*1.5, headHeight*1.25, headWidth*1.5) );
	
	// r2 WIN
	if(r2w){
		instanceMatrix = mult(instanceMatrix, translate(0.75, 0.75, 0.75));
	}
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
		
	//RIGHT PUNCH
	if(r1rightpunch){
		if(r1rightpunchcnt < 10){
			r1rightpunchamt += .5;
			instanceMatrix = mult(instanceMatrix, translate(-r1rightpunchamt*.5, 0.0, -r1rightpunchamt*.5));
			r1rightpunchcnt++;
		}
		else if(r1rightpunchcnt < 20){
			r1rightpunchamt -= .5;
			instanceMatrix = mult(instanceMatrix, translate(-r1rightpunchamt*.5, 0.0, -r1rightpunchamt*.5));
			r1rightpunchcnt++;
		}
		else{
			r1rightpunchcnt = 0;
			r1rightpunch = false;
		}
	}
	
	//BLOCK
	if(r1blk){
		instanceMatrix = mult(instanceMatrix, translate(-0.5,-0.5,-0.5));
	}
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
	
	//RIGHT PUNCH
	if(r1rightpunch){
		if(r1rightpunchcnt2 < 10){
			r1rightpunchamt += .5;
			instanceMatrix = mult(instanceMatrix, translate(-r1rightpunchamt *1.5, 0.0, -r1rightpunchamt));
			r1rightpunchcnt2++;
		}
		else if(r1rightpunchcnt2 < 20){
			r1rightpunchamt -= .5;
			instanceMatrix = mult(instanceMatrix, translate(-r1rightpunchamt*1.5, 0.0, -r1rightpunchamt));
			r1rightpunchcnt2++;
		}
		else{
			r1rightpunchcnt2 = 0;
			r1rightpunch = false;
		}
	}
	
	//BLOCK
	if(r1blk){
		instanceMatrix = mult(instanceMatrix, translate(1.0,0.5,-0.5));
	}
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
	
	//LEFT PUNCH
	if(r1leftpunch){
		if(r1leftpunchcnt < 10){
			r1leftpunchamt += .5;
			instanceMatrix = mult(instanceMatrix, translate(-r1leftpunchamt*.5, 0.0, -r1leftpunchamt*.5));
			r1leftpunchcnt++;
		}
		else if(r1leftpunchcnt < 20){
			r1leftpunchamt -= .5;
			instanceMatrix = mult(instanceMatrix, translate(-r1leftpunchamt*.5, 0.0, -r1leftpunchamt*.5));
			r1leftpunchcnt++;
		}
		else{
			r1leftpunchcnt = 0;
			r1leftpunch = false;
		}
	}
	
	//BLOCK
	if(r1blk){
		instanceMatrix = mult(instanceMatrix, translate(-0.5,-0.5,-0.5));
	}	
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
	
	//LEFT PUNCH
	if(r1leftpunch){
		if(r1leftpunchcnt2 < 10){
			r1leftpunchamt += .5;
			instanceMatrix = mult(instanceMatrix, translate(-r1leftpunchamt *1.5, 0.0, -r1leftpunchamt));
			r1leftpunchcnt2++;
		}
		else if(r1leftpunchcnt2 < 20){
			r1leftpunchamt -= .5;
			instanceMatrix = mult(instanceMatrix, translate(-r1leftpunchamt*1.5, 0.0, -r1leftpunchamt));
			r1leftpunchcnt2++;
		}
		else{
			r1leftpunchcnt2 = 0;
			r1leftpunch = false;
		}
	}
	
	//BLOCK
	if(r1blk){
		instanceMatrix = mult(instanceMatrix, translate(1.0,0.5,-0.5));
	}	
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
	// Add code for normals
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);	
	
    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[b]);
    pointsArray.push(vertices[c]);
    pointsArray.push(vertices[d]);
	
	normalsArray.push(normal);
	normalsArray.push(normal);
	normalsArray.push(normal);
	normalsArray.push(normal);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

//2

function createNoder2(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodesr2(r2Id) {

    var m = mat4();

    switch(r2Id) {

    case torsor2Id:

    m = rotate(theta[torsor2Id], 0, 1, 0 );
    figurer2[torsor2Id] = createNoder2( m, torsor2, null, headr2Id );
    break;

    case headr2Id:
    case head1r2Id:
    case head2r2Id:


    m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	m = mult(m, rotate(theta[head1r2Id], 1, 0, 0))
	m = mult(m, rotate(theta[head2r2Id], 0, 1, 0));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figurer2[headr2Id] = createNoder2( m, headr2, leftUpperArmr2Id, null);
    break;


    case leftUpperArmr2Id:

    m = translate(-(torsoWidth+upperArmWidth), 0.9*torsoHeight, 0.0);
	m = mult(m, rotate(theta[leftUpperArmr2Id], 1, 0, 0));
	m = mult(m, rotateX(120));
    figurer2[leftUpperArmr2Id] = createNoder2( m, leftUpperArmr2, rightUpperArmr2Id, leftLowerArmr2Id );
    break;

    case rightUpperArmr2Id:

    m = translate(torsoWidth+upperArmWidth, 0.9*torsoHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperArmr2Id], 1, 0, 0));
	m = mult(m, rotateX(120));
    figurer2[rightUpperArmr2Id] = createNoder2( m, rightUpperArmr2, leftUpperLegr2Id, rightLowerArmr2Id );
    break;

    case leftUpperLegr2Id:

    m = translate(-(torsoWidth+upperLegWidth), 0.1*upperLegHeight, 0.0);
	m = mult(m , rotate(theta[leftUpperLegr2Id], 1, 0, 0));
    figurer2[leftUpperLegr2Id] = createNode( m, leftUpperLegr2, rightUpperLegr2Id, leftLowerLegr2Id );
    break;

    case rightUpperLegr2Id:

    m = translate(torsoWidth+upperLegWidth, 0.1*upperLegHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperLegr2Id], 1, 0, 0));
    figurer2[rightUpperLegr2Id] = createNoder2( m, rightUpperLegr2, null, rightLowerLegr2Id );
    break;

    case leftLowerArmr2Id:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmr2Id], 1, 0, 0));
	m = mult(m, rotateX(-90));
    figurer2[leftLowerArmr2Id] = createNoder2( m, leftLowerArmr2, null, null );
    break;

    case rightLowerArmr2Id:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmr2Id], 1, 0, 0));
	m = mult(m, rotateX(-90));
    figurer2[rightLowerArmr2Id] = createNoder2( m, rightLowerArmr2, null, null );
    break;

    case leftLowerLegr2Id:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegr2Id], 1, 0, 0));
    figurer2[leftLowerLegr2Id] = createNoder2( m, leftLowerLegr2, null, null );
    break;

    case rightLowerLegr2Id:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegr2Id], 1, 0, 0));
    figurer2[rightLowerLegr2Id] = createNoder2( m, rightLowerLegr2, null, null );
    break;

    }

}

function traverser2(r2Id) {

   if(r2Id == null) return;
   stackr2.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figurer2[r2Id].transform);
   figurer2[r2Id].render();
   if(figurer2[r2Id].child != null) traverser2(figurer2[r2Id].child);
    modelViewMatrix = stackr2.pop();
   if(figurer2[r2Id].sibling != null) traverser2(figurer2[r2Id].sibling);
}

function torsor2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function headr2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth*1.5, headHeight*1.25, headWidth*1.5) );
	
	//r1 WIN
	if(r1w){
		instanceMatrix = mult(instanceMatrix, translate(0.75, 0.75, 0.75));
	}
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArmr2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
	
	//RIGHT PUNCH
	if(r2rightpunch){
		if(r2rightpunchcnt < 10){
			r2rightpunchamt += .5;
			instanceMatrix = mult(instanceMatrix, translate(-r2rightpunchamt*.5, 0.0, -r2rightpunchamt*.5));
			r2rightpunchcnt++;
		}
		else if(r2rightpunchcnt < 20){
			r2rightpunchamt -= .5;
			instanceMatrix = mult(instanceMatrix, translate(-r2rightpunchamt*.5, 0.0, -r2rightpunchamt*.5));
			r2rightpunchcnt++;
		}
		else{
			r2rightpunchcnt = 0;
			r2rightpunch = false;
		}
	}
	
	//BLOCK
	if(r2blk){
		instanceMatrix = mult(instanceMatrix, translate(-0.5,-0.5,-0.5));
	}	
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArmr2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
	
	//RIGHT PUNCH
	if(r2rightpunch){
		if(r2rightpunchcnt2 < 10){
			r2rightpunchamt += .5;
			instanceMatrix = mult(instanceMatrix, translate(-r2rightpunchamt *1.5, 0.0, -r2rightpunchamt));
			r2rightpunchcnt2++;
		}
		else if(r2rightpunchcnt2 < 20){
			r2rightpunchamt -= .5;
			instanceMatrix = mult(instanceMatrix, translate(-r2rightpunchamt*1.5, 0.0, -r2rightpunchamt));
			r2rightpunchcnt2++;
		}
		else{
			r2rightpunchcnt2 = 0;
			r2rightpunch = false;
		}
	}

	//BLOCK
	if(r2blk){
		instanceMatrix = mult(instanceMatrix, translate(1.0,0.5,-0.5));
	}
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArmr2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
	
	//LEFT PUNCH
	if(r2leftpunch){
		if(r2leftpunchcnt < 10){
			r2leftpunchamt += .5;
			instanceMatrix = mult(instanceMatrix, translate(-r2leftpunchamt*.5, 0.0, -r2leftpunchamt*.5));
			r2leftpunchcnt++;
		}
		else if(r2leftpunchcnt < 20){
			r2leftpunchamt -= .5;
			instanceMatrix = mult(instanceMatrix, translate(-r2leftpunchamt*.5, 0.0, -r2leftpunchamt*.5));
			r2leftpunchcnt++;
		}
		else{
			r2leftpunchcnt = 0;
			r2leftpunch = false;
		}
	}
	
	//BLOCK
	if(r2blk){
		instanceMatrix = mult(instanceMatrix, translate(-0.5,-0.5,-0.5));
	}		
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArmr2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
	
	//LEFT PUNCH
	if(r2leftpunch){
		if(r2leftpunchcnt2 < 10){
			r2leftpunchamt += .5;
			instanceMatrix = mult(instanceMatrix, translate(-r2leftpunchamt *1.5, 0.0, -r2leftpunchamt));
			r2leftpunchcnt2++;
		}
		else if(r2leftpunchcnt2 < 20){
			r2leftpunchamt -= .5;
			instanceMatrix = mult(instanceMatrix, translate(-r2leftpunchamt*1.5, 0.0, -r2leftpunchamt));
			r2leftpunchcnt2++;
		}
		else{
			r2leftpunchcnt2 = 0;
			r2leftpunch = false;
		}
	}
	
	//BLOCK
	if(r2blk){
		instanceMatrix = mult(instanceMatrix, translate(1.0,0.5,-0.5));
	}		
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLegr2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLegr2() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLegr2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLegr2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quadr2(a, b, c, d) {
	// Add code for normals
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);	
	
    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[b]);
    pointsArray.push(vertices[c]);
    pointsArray.push(vertices[d]);
	
	normalsArray.push(normal);
	normalsArray.push(normal);
	normalsArray.push(normal);
	normalsArray.push(normal);
}


function cuber2()
{
    quadr2( 1, 0, 3, 2 );
    quadr2( 2, 3, 7, 6 );
    quadr2( 3, 0, 4, 7 );
    quadr2( 6, 5, 1, 2 );
    quadr2( 4, 5, 6, 7 );
    quadr2( 5, 4, 0, 1 );
}

//2

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 0.0, 1.0 );

	// Enable the depth test
    gl.enable(gl.DEPTH_TEST);
	//

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();


	// Create and bind buffer for normals
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
	//

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	
	// Add ambient, diffuse, and specular products
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
	//

	//Robot 1 buttons
		document.getElementById("r1Left").onclick = function(){
			r1leftpunch = !r1leftpunch;
	};
		document.getElementById("r1Right").onclick = function(){
			r1rightpunch = !r1rightpunch;
	};
		document.getElementById("r1Block").onclick = function(){
			r1blk = !r1blk;
	};
		document.getElementById("r1Dodge").onclick = function(){
			r1dod = !r1dod;
	};
		document.getElementById("r1Win").onclick = function(){
			r1w = true;
	};
	
	//Robot 2 buttons
		document.getElementById("r2Left").onclick = function(){
			r2leftpunch = !r2leftpunch;
	};	
		document.getElementById("r2Right").onclick = function(){
			r2rightpunch = !r2rightpunch;
	};	
		document.getElementById("r2Block").onclick = function(){
			r2blk = !r2blk;
	};
		document.getElementById("r2Dodge").onclick = function(){
			r2dod = !r2dod;
	};
		document.getElementById("r2Win").onclick = function(){
			r2w = true;
	};
	
	
	
	document.getElementById("sim").onclick = function(){
		simulate = true;
	};
	//Reset handled in html
	
		// Send uniform locations for lighting and material properties
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );
    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);
	   //
	

    for(i=0; i<numNodes; i++) initNodes(i);

	//2
    for(i=0; i<numNodes; i++) initNodesr2(i);
	//2
	
    render();
}


var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		
		//1
		//Red Plastic Numbers
		//0.0	0.0	0.0	0.5	0.0	0.0	0.7	0.6	0.6	.25
		var materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
		var materialDiffuse = vec4( 0.5, 0.0, 0.0, 1.0);
		var materialSpecular = vec4( 0.7, 0.6, 0.6, 1.0 );
		var materialShininess = 0.25;
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(-4.0,0.0,4.0));
		modelViewMatrix = mult(modelViewMatrix, rotateY(145));
		
		if(r1w){
			r1wamt -= 5;
			modelViewMatrix = mult(modelViewMatrix, rotateX(r1wamt));
			r1wcnt++;
		}
		
		if(r1dod){
			if(r1dodcnt < 10){
				r1dodamt += .05;
				modelViewMatrix = mult(modelViewMatrix, translate(r1dodamt,0.0,0.0));
				r1dodcnt++;
			}
			else if(r1dodcnt < 20){
				r1dodamt -= .05;
				modelViewMatrix = mult(modelViewMatrix, translate(r1dodamt,0.0,0.0));
				r1dodcnt++;
			}
			else{
				r1dodcnt = 0;
			}
				
		}
		
        traverse(torsoId);
		//1
		

	lightPosition = vec4(-4.0, -5.0, 10.0, 0.0 );			
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );
    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);		
		
		//2
		//Cyan Plastic Numbers
		//0.0	0.1	0.06	0.0	0.50980392	0.50980392	0.50196078	0.50196078	0.50196078	.25
		var materialAmbient = vec4( 0.0, 0.1, 0.06, 1.0 );
		var materialDiffuse = vec4( 0.0, 0.50980392, 0.50980392, 1.0);
		var materialSpecular = vec4( 0.50196078, 0.50196078, 0.50196078, 1.0 );
		var materialShininess = 0.25;
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(4.0,0.0,-4.0));
		modelViewMatrix = mult(modelViewMatrix, rotateY(-35));
		
		if(r2w){
			r2wamt -= 5;
			modelViewMatrix = mult(modelViewMatrix, rotateX(r2wamt));
			r2wcnt++;
		}
		
		if(r2dod){
			if(r2dodcnt < 10){
				r2dodamt += .05;
				modelViewMatrix = mult(modelViewMatrix, translate(r2dodamt,0.0,0.0));
				r2dodcnt++;
			}
			else if(r2dodcnt < 20){
				r2dodamt -= .05;
				modelViewMatrix = mult(modelViewMatrix, translate(r2dodamt,0.0,0.0));
				r2dodcnt++;
			}
			else{
				r2dodcnt = 0;
			}
				
		}
		traverser2(torsor2Id);
		//2
		

	lightPosition = vec4(4.0, -5.0, 4.0, 0.0 );		
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );
    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);	
	   
	   
	if(simulate){
		if(simcnt < 10){
			r1leftpunch = true;
			r2blk = true;
			simcnt++;
		}
		else if(simcnt < 50){
			r1leftpunch = false;
			r2blk = false;
			r1dod = true;
			simcnt++;
		}
		else if(simcnt < 100){
			r2leftpunch = true;
			simcnt++;
		}
		else if(simcnt < 150){
			r2leftpunch = false;
			r2rightpunch = true;
			simcnt++;
		}
		else if(simcnt < 200){
			r2rightpunch = false;
			r1dod = false;
			r1rightpunch = true;
			simcnt++;
		}
		else if(simcnt < 250){
			r1blk = true
			r1rightpunch = false;
			simcnt++;
		}
		else if(simcnt < 300){
			r2leftpunch = true;
			simcnt++;
		}
		else if(simcnt < 350){
			r2leftpunch = false;
			simcnt++;
		}
		else if(simcnt < 400){
			r2dod = true;
			simcnt++;
		}
		else if(simcnt < 450){
			r1blk = false;
			r1dod = true;
			simcnt++;
		}
		else if(simcnt < 500){
			r1rightpunch = true;
			simcnt++;
		}
		else if(simcnt < 550){
			r2dod = false;
			r1blk = true;
			r1rightpunch = false
			simcnt++;
		}
		else if(simcnt < 600){
			r2leftpunch = true
			r1dod = false;
			simcnt++;
		}
		else if(simcnt < 650){
			r2blk = true;
			r1blk = false;
			r2leftpunch = false;
			simcnt++;
		}
		else if(simcnt < 675){
			r2blk = false;
			r2rightpunch = true;
			simcnt++;
		}
		else if(simcnt < 700){
			r2rightpunch = false;
			simcnt++;
		}
		else{
			r2w = true;
		}
	}		
	   
	   if(r1wcnt == 360/5){
		   alert( "Blue Bot Wins! Reset to play again." );
	   }
	   if(r2wcnt == 360/5){
		   alert( "Red Bot Wins! Reset to play again." );
	   }
	   
        requestAnimFrame(render);
		
}
