var savedUsers = new Array();
var currentUser;


class User{
	constructor(username , password , firstName , lastName , email ,birthDate) {
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.birthDate = birthDate;
	}
}

$(document).ready(function(){
	var user = new User('k','k','k','k','k@gmail.com','8.12.1994');
	savedUsers.push(user);
	currentUser = user;        
})

function ShowDiv(id)
{	
	//hide all divs
	var div1 = document.getElementById('welcome');
	div1.style.visibility="hidden";
	var div2 = document.getElementById('register');
	div2.style.visibility="hidden";
	var div3 = document.getElementById('login');
	div3.style.visibility="hidden";;
	var div4 = document.getElementById('chooseSettings');
	div4.style.visibility="hidden";
	var div5 = document.getElementById('ready');
	div5.style.visibility="hidden";
	var div6 = document.getElementById('game');
	div6.style.visibility="hidden";
	
	//show only one div
	var selectedDiv = document.getElementById(id);
	selectedDiv.style.visibility = "visible";
	
	if(id != 'game'){
		//window.clearInterval(interval);
		//window.clearInterval(intervalMonsters);
		//window.clearInterval(intervalStar);
		//window.clearInterval(intervalStrawberry);
		//window.clearInterval(intervalCherry);
		//mainMusic.pause();
		//mainMusic.currentTime = 0;
	}
}

/*************************ABOUT*********************************/
function ShowDialog(){
	document.getElementById("about").showModal();
}
function CloseDialog(){
	document.getElementById("about").close();
}
//close the about dialog when click outside of it with the mouse
//to close the new html <dialog> tag by clicking on its ::backdrop
//https://stackoverflow.com/questions/25864259/how-to-close-the-new-html-dialog-tag-by-clicking-on-its-backdrop
var dialog = document.getElementById('about');
	dialog.addEventListener('click', function (event) {
		var rect = dialog.getBoundingClientRect();
		var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
		&& rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
		if (!isInDialog) {
			dialog.close();
		}
});

//check register form
//https://stackoverflow.com/questions/14460925/how-to-add-validation-rules-with-messages-in-jquery-validation
//https://jqueryvalidation.org/
$(document).ready(function(){
	$("#registerForm").validate({
		rules: {
			UsernameRegister: {
				required: true,
				minlength: 1,
				doesUsernameNotExist: true,
			},
			PasswordRegister: {
				required: true,
				minlength: 6,
				isLegalPassword: true,
			},
			FirstName: { 
				required:true,
				minlength: 1,
				checkIfOnlyLetters: true,
			},
			LastName: {
				required:true,
				minlength: 1,
				checkIfOnlyLetters: true,
			},					
			Email: {
				required: true,
				email: true
			},
			BirthDate: {
				required: true,
				minlength: 2,
			},
		},
		messages: {
			UsernameRegister: {
				required:"Please enter a username",
				minlength: "Please enter a username",
				doesUsernameNotExist: "This username already exists, please enter another username",
			},
			PasswordRegister: {
				required: "Please provide a password",
				minlength: "Your password must be at least 6 characters long",
				isLegalPassword: "The password must include only letters and digits",
			},
			FirstName: {
				required: "Please enter your First Name",
				minlength: "Please enter your First Name",
				checkIfOnlyLetters: "First name must include only letters",
				},
			LastName: {
				required: "Please enter your Last Name",
				minlength: "Please enter your Last Name",
				checkIfOnlyLetters: "Last name must include only letters",
			},
			Email: {
				required: "Please enter a valid email address",
				email: "This is not a valid email, please enter a valid email address",
			},
			BirthDate: {
				required: "Please enter your birth date",	
				minlength: "Please enter your birth date",	
			},
		},

		submitHandler : function(form) {
			AddUser(document.getElementById('UsernameRegister').value,document.getElementById('PasswordRegister').value,
			document.getElementById('FirstName').value,document.getElementById('LastName').value,document.getElementById('Email').value,document.getElementById('BirthDate').value);	
			//form.submit();
		},
	}); 

	$.validator.addMethod("doesUsernameNotExist", function(value ,element) {
		return this.optional(element) || !(value in savedUsers);
	});

	//https://stackoverflow.com/questions/18746234/jquery-validate-plugin-password-check-minimum-requirements-regex
	$.validator.addMethod("isLegalPassword", function(value , element) {
		return this.optional(element) || /[A-Za-z]/i.test(value) && /\d/.test(value);
	});

	$.validator.addMethod("checkIfOnlyLetters", function(value , element) {
		return this.optional(element) || /^[A-Za-z]+$/i.test(value) || /^[a-zA-Z]+$/i.test(value) ;
		
	});

});

function AddUser(username ,password ,firstName ,lastName ,email ,birthDate){
	var user = new User(username , password, firstName ,lastName ,email ,birthDate);
	savedUsers.push(user);
	currentUser = user;
	ShowDiv('login');	
}

function CheckLogIn(username,password){
	if(username != "" && password != ""){
		var isExist = false;
		savedUsers.forEach(user => {
			if(user.username==username && user.password==password){
				isExist = true;
				currUser = user;
			}
		});
		if(isExist){
			ShowDiv('chooseSettings');
		}
		else{
			window.alert("The username or password is incorrect, Please try again.");
		}   
	}
	else{
		window.alert("Please insert a username and password");
	}
	}

function updateUp() {
	$(document).keydown(function(event){
		document.getElementById('up_key').value = event.key;
		keyUp = event.key;
		$(document).unbind()
	});
}
function updateDown() {
	$(document).keydown(function(event){
		document.getElementById('down_key').value = event.key;
		keyDown = event.key;
		$(document).unbind()
	});
}

function updateRight() {
	$(document).keydown(function(event){
		document.getElementById('right_key').value = event.key;
		keyRight = event.key;
		$(document).unbind()
	});
}

function updateLeft() {
	$(document).keydown(function(event){
		document.getElementById('left_key').value = event.key;
		keyLeft = event.key;
		$(document).unbind()
	});
}

function updateBalls() {
	document.getElementById('num_Balls').value='';
}

function CheckSettings(upKey, downKey, rightKey, leftKey, numOfBalls, colorBalls_5, colorBalls_15, colorBalls_25, numOfMonsters, durationOfGame){
	if (upKey == "up key"){
		window.alert("please choose an up key")
	}
	else if (downKey == "down key"){
		window.alert("please choose a down key")
	}
	else if (rightKey == "right key"){
		window.alert("please choose a right key")
	}
	else if (leftKey == "left key"){
		window.alert("please choose a left key")
	}
	else if (!(/^\d+$/.test(numOfBalls)) || !(numOfBalls >= 50 && numOfBalls <= 90)){
		window.alert("number of balls must be between 50 to 90")
	}
	else if (colorBalls_5 == colorBalls_15 || colorBalls_5 == colorBalls_25 || colorBalls_15 == colorBalls_25){
		window.alert("please choose a different color for each ball")
	}
	else if (!(/^\d+$/.test(numOfBalls) && durationOfGame >= 60)){
		window.alert("game duration must be atleast 60 seconds")
	}
	else{
		this.numOfBalls = numOfBalls;
		this.colorBalls_5 = colorBalls_5;
		this.colorBalls_15 = colorBalls_15;
		this.colorBalls_25 = colorBalls_25;
		this.numOfMonsters = parseInt(numOfMonsters);
		this.durationOfGame = parseInt(durationOfGame);

		// username not working
		//document.getElementById('showUserName').innerHTML = currentUser.username;
		document.getElementById('showUpKey').innerHTML = upKey;
		document.getElementById('showDownKey').innerHTML = downKey;
		document.getElementById('showRightKey').innerHTML = rightKey;
		document.getElementById('showLeftKey').innerHTML = leftKey;
		document.getElementById('showNumOfBalls').innerHTML = numOfBalls;

		document.getElementById('showColorBalls_5').innerHTML = colorBalls_5;
		document.getElementById('showColorBalls_5').style.color = colorBalls_5;

		document.getElementById('showColorBalls_15').innerHTML = colorBalls_15;
		document.getElementById('showColorBalls_15').style.color = colorBalls_15;

		document.getElementById('showColorBalls_25').innerHTML = colorBalls_25;
		document.getElementById('showColorBalls_25').style.color = colorBalls_25;

		document.getElementById('showNumOfMonsters').innerHTML = numOfMonsters;
		document.getElementById('showDurationOfGame').innerHTML = durationOfGame+" sec";

		document.getElementById('showUserName').innerHTML = currentUser.username;
		ShowDiv('ready');
		//Start();
	}
}
function random(){
	document.getElementById('up_key').value = 'ArrowUp';
	document.getElementById('down_key').value = 'ArrowDown';
	document.getElementById('right_key').value = 'ArrowRight';
	document.getElementById('left_key').value = 'ArrowLeft';
	document.getElementById('num_Balls').value = getRandomNumber(50, 91);
	var colors = new Array();
	colors[1] = 'deeppink';
	colors[2] = 'lime';
	colors[3] = 'red';
	colors[4] = 'orange';

	var color5 = getRandomNumber(1, 5);
	var color15 = getRandomNumber(1, 5);
	while(color5 == color15){
		color15 = getRandomNumber(1, 5);
	}
	var color25 = getRandomNumber(1, 5);
	while(color5 == color25 || color15 == color25){
		color25 = getRandomNumber(1, 5);
	}

	document.getElementById('colorBalls_5').value = colors[color5];
	document.getElementById('colorBalls_15').value = colors[color15];
	document.getElementById('colorBalls_25').value = colors[color25];
	document.getElementById('numOfMonsters').value = getRandomNumber(1, 5);
	document.getElementById('durationOfGame').value = getRandomNumber(60, 181);
}


function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}


