const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY =10 ;
let snakeBody = [];
let velocityX=0, velocityY=0;
let setIntervalId;
let score = 0;
// Getting highest score from storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText=`High Score: ${highScore}`;

const changeFoodPosition =() => {
	//Passing a random 0-30 value as food position
	foodX = Math.floor(Math.random() * 30) + 1;
	foodY = Math.floor(Math.random() * 30) + 1;

}
const handleGameOver = () => {
	// clearing the timer and reloading the game over page
	clearInterval(setIntervalId);
	alert("Game Over! Press OK to replay....");
	location.reload();
}
const changeDirection=(e)=>{
	console.log(e);
	if(e.key==="ArrowUp" && velocityY != 1) {
		velocityX=0;
		velocityY=-1;
	} else if(e.key==="ArrowDown"&& velocityY != -1) {
			velocityX=0;
			velocityY=1;
		}
		else if(e.key==="ArrowLeft"&& velocityX != 1) {
			velocityX=-1;
			velocityY=0;
		}
		else if(e.key==="ArrowRight"&& velocityX != -1) {
			velocityX=1;
			velocityY=0;
		}
}
controls.forEach(key => {
	// Calling changDirection on each key click and passing key dataset as an object
	key.addEventListener("click", () => changeDirection({key: key.dataset.key}) );
});
const initGame = () => {
	if(gameOver) return handleGameOver();
	let htmlMarkup =`<div class="food" style = "grid-area: ${foodY} / ${foodX}"></div>`;
	if(snakeX === foodX && snakeY == foodY){
		changeFoodPosition();
		snakeBody.push([foodX, foodY]); //Pushing food position to snake body array
		score++; // Increment score by 1
		highScore=score>=highScore ? score : highScore;
		localStorage.setItem("high-score", highScore);
		scoreElement.innerText = `Score: ${score}`;
		highScoreElement.innerText=`High Score: ${highScore}`;
	}
	for (let i=snakeBody.length - 1; i > 0; i--){
		// Shifting forwar the values of elements in the snake body by one
		snakeBody[i] = snakeBody[i - 1];
	}
	snakeBody[0]=[snakeX, snakeY]; //setting first element of snake body to current snake position

	snakeX+=velocityX;
	snakeY+=velocityY;
	// Checking if the snake's head is out of wall, if so telling gameOver to true
	if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
		gameOver = true;
	}
	for (let i=0; i< snakeBody.length; i++){
		// Adding div for each part of snake's body
		htmlMarkup+=`<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
		// Checking if the snake head hit the body, if so set gameOver to true
		if(i !==0 && snakeBody[0][1]===snakeBody[i][1] && snakeBody[0][0]===snakeBody[i][0]){
			gameOver=true;
		}
	} 
	


	playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 200);
document.addEventListener("keydown", changeDirection);