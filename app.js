var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var durationOfGame;
var extraTime;
var blocked;

//Monsters
var numOfMonsters;
var monster1 = new Object();
var monster2 = new Object();
var monster3 = new Object();
var monster4 = new Object();
monster1.id = 111;
monster2.id = 112;
monster3.id = 113;
monster4.id = 114;
monster1.behind = false;
monster2.behind = false;
monster3.behind = false;
monster4.behind = false;
var intervalMonsters;

//points_50
var points_50 = new Object();
var points_50_Game;
var intervalPoints_50;
points_50.notSeen = 0;
points_50.id = 50;

//Music
var isMeut = false;
var backgroundMusic = new Audio('./resources/pacmanMusic.mp3');
var loseSound;
var winSound;
var encounterSound;

var numOfBalls;
var ballsLeftToEat;
var colorBalls_5;
var colorBalls_15;
var colorBalls_25;

var keyUp;
var keyDown;
var keyRight;
var keyLeft;
var direction;
var lives;

//boom
var disapeerBoom = new Object();
disapeerBoom.i = null;
disapeerBoom.j = null;
var intervalBoom;
shape.i = null;
shape.j = null;

/************************** new game  *************************/
function newGame(){
	backgroundMusic.currentTime = 0;
	window.clearInterval(interval);
	window.clearInterval(intervalMonsters);
	window.clearInterval(intervalPoints_50);
	window.clearInterval(intervalBoom);
	Start();
}

/************************** mute or umute  *************************/
function mute(){ // Turns from unmute to mute
	backgroundMusic.pause();
	loseSound.pause();
	encounterSound.pause();
	$("#mute").hide();
	$("#unmute").show();
	isMeut = true;	
}
function unmute (){ //// Turns from mute to unmute
	backgroundMusic.play();
	loseSound.play();
	encounterSound.play();
	$("#unmute").hide();
	$("#mute").show();	
	isMeut = false;	
}


function Start() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 140;
	var food_remain = numOfBalls;
	ballsLeftToEat = numOfBalls;
	var food_5 = Math.floor(numOfBalls*0.6);
	var food_15 = Math.floor(numOfBalls*0.3);
	var food_25 = Math.floor(numOfBalls*0.1);
	var numOfMonstersLeftArrangeOnBoard = numOfMonsters;
	var serialNumberOfMonsters=111 //start from 111
	var pacman_remain = 1;
	start_time = new Date();
	extraTime = 0;
	lives = 5;
	points_50_Game =true;

	if(!isMeut){
		backgroundMusic.play();
	}
	loseSound = new Audio('./resources/loseSound.mp3');
	winSound = new Audio('./resources/winSound.mp3');
	encounterSound = new Audio('./resources/encounterSound.mp3');
	
	
	
	keyUp = $("#up_key").val();
	keyDown = $("#down_key").val();
	keyRight = $("#right_key").val();
	keyLeft = $("#left_key").val();

	for (var i = 0; i < 14; i++) {
		board[i] = new Array();
		for (var j = 0; j < 8; j++) {
			// place of monsters
			if(((i == 0 && j == 0) || (i == 0 && j == 7) || (i == 13 && j == 0) || (i == 13 && j == 7)) && numOfMonstersLeftArrangeOnBoard > 0){
				board[i][j] = serialNumberOfMonsters;
				serialNumberOfMonsters++;
				numOfMonstersLeftArrangeOnBoard--;
			}
			// walls
			else if((i == 4 && j == 1) || (i == 4 && j == 2) || (i == 1 && j == 2) || (i == 7 && j == 2) ||
			(i==7 && j==3) || (i==6 && j==2) || (i==5 && j==5) || (i==5 && j==6) || (i==11 && j==5) || (i==11 && j==6)||
			(i==12 && j==6) || (i==13 && j==6) || (i==2 && j==6) || (i==2 && j==7) || (i==12 && j==1)){
				board[i][j] = 4;
			}
			//Moving score - 50 point
			else if(i == 4 && j == 0){
				board[i][j] = 50;
				points_50.i = i;
				points_50.j =j;
			}
			//balls , pacman , empty
			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) { //balls
					food_remain--;
					var num = Math.random();
					if(num < 0.6 && food_5 > 0){
						food_5--;
						board[i][j] = 5;
					}
					else if(num < 0.9 && food_15 > 0){
						food_15--;
						board[i][j] = 15;
					}
					else if (food_25 > 0){
						food_25--;
						board[i][j] = 25;
					};
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt  ) { //pacman
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 999;
				} else { //empty
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var findEmptyCell = findRandomEmptyCell(board);
		food_remain--;
		var num = Math.random();
		if(num < 0.6 && food_5 > 0){
			food_5--;
			board[findEmptyCell[0]][findEmptyCell[1]] = 5;
		}
		else if(num < 0.9 && food_15 > 0){
			food_15--;
			board[findEmptyCell[0]][findEmptyCell[1]] = 15;
		}
		else if (food_25 > 0){
			food_25--;
			board[findEmptyCell[0]][findEmptyCell[1]] = 25;
		}
	}

	// add clock
	var findEmptyCell = findRandomEmptyCell(board);
	board[findEmptyCell[0]][findEmptyCell[1]] = 10;

	
	keysDown = {};
	addEventListener("keydown",	function(e) {
		if(e.key == keyUp)
		keysDown[keyUp] = true;
		if(e.key == keyDown)
		keysDown[keyDown] = true;
		if(e.key == keyRight)
		keysDown[keyRight] = true;
		if(e.key == keyLeft)
		keysDown[keyLeft] = true;
	},
	false
	);
	addEventListener("keyup",function(e) {
		keysDown[e.keyCode] = false;
	},
	false
	);

	interval = setInterval(UpdatePosition, 5);
	intervalMonsters = setInterval(monsters_Move, 700);
	intervalPoints_50 = setInterval(Points_50_Move, 650);
	intervalBoom = setInterval(Boom_Move,1500);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 14);
	var j = Math.floor(Math.random() * 8);
	while (board[i][j] != 0) {	
		i = Math.floor(Math.random() * 14);
		j = Math.floor(Math.random() * 8);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[keyUp]) {
		direction = "up";
		return 1;
	}
	if (keysDown[keyDown]) {
		direction = "down";
		return 2;
	}
	if (keysDown[keyRight]) {
		direction = "right";
		return 3;
	}
	if (keysDown[keyLeft]) {
		direction = "left";
		return 4;
	}
}


function Draw() {
	canvas.width = canvas.width; //clean board
	showScore.value = score;
	showTime.value = time_elapsed;
	for (var i = 0; i < 14; i++) {
		for (var j = 0; j < 8; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 999) { //place of pacman
				context.beginPath();
				context.fillStyle = pac_color; //color
				if(direction === "up"){//pacman move up
					context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI); // half circle up 
					// context.beginPath();
					// context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
					// context.fillStyle = "black"; //color of 5
					// context.fill();  
				}
				else if(direction === "down"){//pacman move down
					context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI); // half circle down
					// context.beginPath();
					// context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
					// context.fillStyle = "black"; //color of 5
					// context.fill();
				}
				else if(direction === "left"){//pacman move left
					context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle left
					// context.beginPath();
					// context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
					// context.fillStyle = "black"; //color of 5
					// context.fill();
				}
				else {//pacman move right	
					context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle right
					// context.beginPath();
					// context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
					// context.fillStyle = "black"; //color of 5
					// context.fill();
				}
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				//context.stroke();
				context.beginPath();
				context.fillStyle = "black"; //color
				if(direction === "up"){//pacman move up
					context.arc(center.x + 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
					// context.beginPath();
					// context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
					// context.fillStyle = "black"; //color of 5
					// context.fill();
				}
				else if(direction === "down"){//pacman move down
					context.arc(center.x - 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
					// context.beginPath();
					// context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
					// context.fillStyle = "black"; //color of 5
					// context.fill();
				}
				else if(direction === "left"){//pacman move left
					context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
					// context.beginPath();
					// context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
					// context.fillStyle = "black"; //color of 5
					// context.fill();
				}
				else {//pacman move right
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
					// context.beginPath();
					// context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
					// context.fillStyle = "black"; //color of 5
					// context.fill();
				}
				context.fillStyle = "black"; //color
				context.fill();
				context.stroke();
			} else if (board[i][j] == 5) { // place of ball 5
				context.beginPath();
				context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBalls_5; //color of 5
				context.fill();
			}
			else if (board[i][j] == 15) { // place of ball 15
				context.beginPath();
				context.arc(center.x, center.y, 9, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBalls_15; //color of 15
				context.fill();
			}
			else if (board[i][j] == 25) { // place of ball 25
				context.beginPath();
				context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBalls_25; //color of 25
				context.fill();
			}
			else if(board[i][j] == 111){ //monster1
				var ghost1Img = new Image;
				monster1.i = i;
				monster1.j = j;
				ghost1Img.src = "./resources/ghost1.png";
				context.beginPath();
				context.drawImage(ghost1Img,center.x - 30, center.y - 30, 60, 60 * ghost1Img.height / ghost1Img.width);	
			} 
			else if(board[i][j] == 112){ //monster2
				var ghost2Img = new Image;
				monster2.i = i;
				monster2.j = j;
				ghost2Img.src = "./resources/ghost2.png";
				context.beginPath();
				context.drawImage(ghost2Img,center.x - 30, center.y - 30, 60, 60 * ghost2Img.height / ghost2Img.width);
			} 
			else if(board[i][j] == 113){ //monster3
				var ghost3Img = new Image;
				monster3.i = i;
				monster3.j = j;
				ghost3Img.src = "./resources/ghost3.png";
				context.beginPath();
				context.drawImage(ghost3Img,center.x - 30, center.y - 30, 60, 60 * ghost3Img.height / ghost3Img.width);
			} 
			//ghost4
			else if(board[i][j] == 114){//monster4
				var ghost4Img = new Image;
				monster4.i = i;
				monster4.j = j;
				ghost4Img.src = "./resources/ghost4.png";
				context.beginPath();
				context.drawImage(ghost4Img,center.x - 30, center.y - 30, 60, 60 * ghost4Img.height / ghost4Img.width);
			}
			else if (board[i][j] == 4) {//wall
				var wallImg = new Image;
				wallImg.src="./resources/wallwhite.png"
				context.beginPath();
				context.drawImage(wallImg,center.x - 30, center.y - 30, 60, 60 * wallImg.height / wallImg.width);
			}
			//clock
			else if (board[i][j] == 10) {
				var clockImg = new Image;
				clockImg.src="./resources/clock.png"
				context.beginPath();
				context.drawImage(clockImg,center.x - 30, center.y - 30, 60, 60 * clockImg.height / clockImg.width);
			}
			//point_50
			else if(board[i][j] == 50 && points_50_Game){
				var starImg = new Image;
				starImg.src = "./resources/50points.png";
				context.beginPath();
				context.drawImage(starImg,center.x - 30, center.y - 30, 60, 60 * starImg.height / starImg.width);
			}
			//boom
			else if (board[i][j] == 700){
				var boom = new Image;
				boom.src = "./resources/boom.png";		
				context.beginPath();
				context.drawImage(boom,center.x - 30, center.y - 30, 60, 60 * boom.height / boom.width);
				disapeerBoom.i = i;
				disapeerBoom.j = j;	
			}
		}
	}
}

/*************************************** move interval *****************************************/
function monsters_Move() {
	if (numOfMonsters == 1) {
		if (UpdateNextStepMonster(monster1) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			GhostEatMe();
			board[0][0] = 111;
		}
	}
	else if (numOfMonsters == 2) {
		if (UpdateNextStepMonster(monster1) == false || UpdateNextStepMonster(monster2) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			GhostEatMe();
			board[0][0] = 111;
			board[0][7] = 112;
		}
	}
	else if (numOfMonsters == 3) {
		if (UpdateNextStepMonster(monster1) == false || UpdateNextStepMonster(monster2) == false || UpdateNextStepMonster(monster3) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			board[monster3.i][monster3.j] = monster3.notSeen;
			GhostEatMe();
			board[0][0] = 111;
			board[0][7] = 112;
			board[13][0] = 113;
		}
	}
	else if (numOfMonsters == 4) {
		if (UpdateNextStepMonster(monster1) == false || UpdateNextStepMonster(monster2) == false || UpdateNextStepMonster(monster3) == false || UpdateNextStepMonster(monster4) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			board[monster3.i][monster3.j] = monster3.notSeen;
			board[monster4.i][monster4.j] = monster4.notSeen;
			GhostEatMe();
			board[0][0] = 111;
			board[0][7] = 112;
			board[13][0] = 113;
			board[13][7] = 114;
		}
	}
}


function Boom_Move() {
	if (disapeerBoom.i != null && disapeerBoom.j!=null){
		board[disapeerBoom.i][disapeerBoom.j] = 0;
	}
}

function Points_50_Move(){
	if(points_50_Game && UpdateNextStepMonster(points_50) == false){ //pacman eat 50 points
		board[points_50.i][points_50.j] = 0;
		points_50_Game = false;
		score = score +50 +points_50.notSeen;
		points_50.notSeen = 0;
	}
}

function UpdatePosition() {
	if(shape.i != null && shape.j != null){
		board[shape.i][shape.j] = 0;
	}

	var x = GetKeyPressed();
	if (x == 1) { //up
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) { //down
		if (shape.j < 7 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) { //right
		if (shape.i < 13 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
		
	}
	if (x == 4) { //left
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (board[shape.i][shape.j] == 5) { //5 points
		score+= 5;
		board[shape.i][shape.j] = 0;
		ballsLeftToEat--;
	}
	else if(board[shape.i][shape.j] == 15){ // 15 points
		score+= 15;
		board[shape.i][shape.j] = 0;
		ballsLeftToEat--;
	}
	else if(board[shape.i][shape.j] == 25){ //25 points
		score+= 25;
		board[shape.i][shape.j] = 0;
		ballsLeftToEat--;
	}
	else if(board[shape.i][shape.j] == 111 || board[shape.i][shape.j] == 112 || board[shape.i][shape.j] == 113 || board[shape.i][shape.j] == 114){ //Collision with a monster
		monsters_Move();
		board[shape.i][shape.j]=700; //Collision
	}
	else if(board[shape.i][shape.j] == 50){ //50 points
		score+= 50;
		board[shape.i][shape.j] = points_50.notSeen;
		points_50_Game = false;
	}
	else if(board[shape.i][shape.j] == 10){ //extra time
		extraTime = 20;
		board[shape.i][shape.j] == 0;
	}	

	board[shape.i][shape.j] = 999;
	var currentTime = new Date();
	time_elapsed = durationOfGame + extraTime - (currentTime - start_time) / 1000;
	time_elapsed = time_elapsed.toFixed(2);
	document.getElementById('showTime').innerHTML = time_elapsed;
	document.getElementById('showScore').innerHTML = score;
	document.getElementById('showLives').innerHTML = lives;
	keysDown[keyUp] = false;
	keysDown[keyDown] = false;
	keysDown[keyRight] = false;
	keysDown[keyLeft] = false;

	if(lives == 0){
		backgroundMusic.pause();
		backgroundMusic.currentTime = 0;
		if(!isMeut){
			loseSound.play();
		}
		window.alert("Loser!");
		window.clearInterval(interval);
		window.clearInterval(intervalMonsters);
		window.clearInterval(intervalPoints_50);
		window.clearInterval(intervalBoom);
	}
	else if (time_elapsed <= 0.00){
		if (score < 100){
			backgroundMusic.pause();
			backgroundMusic.currentTime = 0;
			if(!isMeut){
				loseSound.play();
			}
			window.alert("You are better than " + score + " points!");
			window.clearInterval(interval);
			window.clearInterval(intervalMonsters);
			window.clearInterval(intervalPoints_50);
			window.clearInterval(intervalBoom);
		}
		else{
			backgroundMusic.pause();
			backgroundMusic.currentTime = 0;
			if(!isMeut){
				winSound.play();
			}
			window.alert("Winner!!!");
			window.clearInterval(interval);
			window.clearInterval(intervalMonsters);
			window.clearInterval(intervalPoints_50);
			window.clearInterval(intervalBoom);
		}
	}
	else {
		Draw();
	}
}


function GhostEatMe(){
	//mainMusic.pause();
	board[shape.i][shape.j] = 700;
	//mainMusic.play();
	if(!isMeut){
		boing.play();
	}
	lives--;
	score = score - 10;
	var emptyCell = findRandomEmptyCell(board);
	shape.i = emptyCell[0];
	shape.j = emptyCell[1];
	board[shape.i][shape.j] = 2;
	document.getElementById('showScore').innerHTML = score;
	document.getElementById('showLives').innerHTML = lives;
}



function UpdatePosition() {
	if(shape.i != null && shape.j != null){
		board[shape.i][shape.j] = 0;
	}
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 7 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i < 13 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (x == 4) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (board[shape.i][shape.j] == 5) {
		score+= 5;
		board[shape.i][shape.j] = 0;
		foodLeftOnBoard--;
	}
	else if(board[shape.i][shape.j] == 15){
		score+= 15;
		board[shape.i][shape.j] = 0;
		foodLeftOnBoard--;
	}
	else if(board[shape.i][shape.j] == 25){
		score+= 25;
		board[shape.i][shape.j] = 0;
		foodLeftOnBoard--;
	}
	else if(board[shape.i][shape.j] == 111 || board[shape.i][shape.j] == 112 || board[shape.i][shape.j] == 113 || board[shape.i][shape.j] == 114){
		monstersMove();
		board[shape.i][shape.j]=700;
	}
	else if(board[shape.i][shape.j] == 50){
		score+= 50;
		board[shape.i][shape.j] = points_50.notSeen;
		points_50_Game = false;
	}
	else if(board[shape.i][shape.j] == 10){
		extraTime = 20;
		board[shape.i][shape.j] == 0;
	}	
	board[shape.i][shape.j] = 999;
	var currentTime = new Date();
	time_elapsed = durationOfGame + extraTime - (currentTime - start_time) / 1000;
	time_elapsed = time_elapsed.toFixed(2);
	document.getElementById('showTime').innerHTML = time_elapsed;
	document.getElementById('showScore').innerHTML = score;
	document.getElementById('showLives').innerHTML = lives;
	keysDown[keyUp] = false;
	keysDown[keyDown] = false;
	keysDown[keyRight] = false;
	keysDown[keyLeft] = false;

	if(lives == 0){
		mainMusic.pause();
		mainMusic.currentTime = 0;
		if(!isMeut){
			loseSound.play();
		}
		window.alert("Loser!");
		window.clearInterval(interval);
		window.clearInterval(intervalMonsters);
		window.clearInterval(intervalPoints_50);
		window.clearInterval(intervalBoom);

	}
	else if (time_elapsed <= 0.00){
		if (score < 100){
			mainMusic.pause();
			mainMusic.currentTime = 0;
			if(!isMeut){
				loseSound.play();
			}
			window.alert("You are better than " + score + " points!");
			window.clearInterval(interval);
			window.clearInterval(intervalMonsters);
			window.clearInterval(intervalPoints_50);
			window.clearInterval(intervalBoom);

		}
		else{
			mainMusic.pause();
			mainMusic.currentTime = 0;
			if(!isMeut){
				winSound.play();
			}
			window.alert("Winner!!!");
			window.clearInterval(interval);
			window.clearInterval(intervalMonsters);
			window.clearInterval(intervalPoints_50);;
			window.clearInterval(intervalBoom);
		}
	}
	else {
		Draw();
	}
}

function GhostEatPacman(){
	board[shape.i][shape.j] = 700;
	if(!isMeut){
		encounterSound.play();
	}
	lives--;
	score = score - 10;
	var findEmptyCell = findRandomEmptyCell(board);
	shape.i = findEmptyCell[0];
	shape.j = findEmptyCell[1];
	board[shape.i][shape.j] = 999;
	document.getElementById('showScore').innerHTML = score;
	document.getElementById('showLives').innerHTML = lives;
}


function UpdateNextStepMonster(monster) { //to change
	var x=monster.i;
	var y= monster.j;
	var move;
	var priority = iAmClose(monster);
	var monsterCanMove = false;
	var firstTry = true;
	var try1 = 0;
	var try2 = 0;
	var try3 = 0;
	var try4 = 0;
	var tryAllMoves = 0;
	while ((!monsterCanMove  && tryAllMoves < 10)){
		if(priority > 0 && firstTry){
			move = priority;
			firstTry = false;
		}
		else{
			move = Math.floor(Math.random() * 5 + 1);
		}
		
		if (move == 1) { // up
			if (y > 0 && board[x][y-1] != 4 && board[x][y-1] != 111 && board[x][y-1] != 112 && board[x][y-1] != 113 && board[x][y-1] != 114 && board[x][y-1] != 50 && board[x][y-1] != 10) {
				y = y -1;
				monsterCanMove=true;
				try1 = 1;
			}	
		}
		if (move == 2) { //down
			if (y < 7 &&  board[x][y+1] != 4 && board[x][y+1] != 111 && board[x][y+1] != 112 && board[x][y+1] != 113 && board[x][y+1] != 114 && board[x][y+1] != 50 && board[x][y+1] != 10) {
				y = y +1;
				monsterCanMove =true;
				tryAllMoves = tryAllMoves+2;
				try2 =2;
			}	
		} 
		if (move == 3) { //right
			if (x < 13 && board[x+1][y] != 4 && board[x+1][y] != 111 && board[x+1][y] != 112 && board[x+1][y] != 113 && board[x+1][y] != 114 && board[x+1][y] != 50 && board[x+1][y] != 10) {
				x = x +1;
				monsterCanMove =true;
				try3=3;
			}
		}
		if (move == 4) { //left
			if (x > 0 &&  board[x-1][y] != 4 && board[x-1][y]!= 111 && board[x-1][y]!= 112 && board[x-1][y]!= 113 && board[x-1][y]!= 114 && board[x-1][y] != 50 && board[x-1][y] != 10) {
				x = x -1;
				monsterCanMove =true;
				try4=4;
			}
		}
		tryAllMoves = try1+try2+try3+try4;	
	}
	board[monster.i][monster.j] = monster.notSeen;
	monster.i = x;
	monster.j = y;
	if (board[monster.i][monster.j] == 999) {	
		return false; //lose
	}
	else if (board[monster.i][monster.j] == 0 || board[monster.i][monster.j] == 5 || board[monster.i][monster.j] == 15 || board[monster.i][monster.j] == 25) {	
		monster.notSeen = board[monster.i][monster.j];
	}
	board[monster.i][monster.j] = monster.id;
	return true;
	}

function isMonster(monster){
	if(monster.id == 101 || monster.id == 102 || monster.id == 103 || monster.id == 104){
		return true;
	}
	return false;
}
		
function iAmClose(monster){
	if(isMonster(monster)){
		if(monster.j > shape.j){ //up
			return 1; 
		}
		if(monster.j < shape.j){ //down
			return 2;
		}
		if(monster.i < shape.i){ //right
			return 3; 
		}
		if(monster.i < shape.i){ //left
			return 4;
		}
	}
	else{
		return 0;
	}
}
