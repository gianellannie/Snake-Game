function drawGameBoard(p){
    document.querySelector(".game").style=`grid-template-columns: repeat(${p}, 1fr);grid-template-rows: repeat(${p}, 1fr);`;
}
function addClass(addclass) {
    document.getElementById("container").classList.add(addclass);
}
function removeClass(removeClass){
    document.getElementById("container").classList.remove(removeClass);
}

let htmlMarkup;
let gameOver=false;
let setIntervalId;
let velocityX=0,velocityY=0;
let score = 0;
const scoreElement=document.querySelector(".score");
const game=document.querySelector(".game");
document.querySelector(".health-bar").style.display = "none";

class SnakeGame{
    constructor(x,y,gameBoard){
        this.x=x;
        this.y=y;
        this.foodX=1;
        this.foodY=1;
        this.rotate=0;
        this.snakeBody=[];
        this.gameBoard=gameBoard;
    }
    changeFoodPosition() {
        this.foodX=Math.floor(Math.random()*this.gameBoard+1); 
        this.foodY=Math.floor(Math.random()*this.gameBoard+1);
    }
    changeDirection(e){
        switch (true) {
            case e.key==="ArrowUp" && velocityY!==1:
                velocityX=0;
                velocityY=-1;
                this.rotate=-90;
                break;
            case e.key==="ArrowDown" && velocityY!==-1:
                velocityX=0;
                velocityY=1;
                this.rotate=90;
                break;
            case e.key==="ArrowLeft" && velocityX!==1:
                velocityX=-1;
                velocityY=0;
                this.rotate=180;
                break;
            case e.key==="ArrowRight" && velocityX!==-1:
                velocityX=1;
                velocityY=0;
                this.rotate=0;
                break;
            default:
                break;
        }
        this.initGame();
    }
    draw(){
        htmlMarkup=`<div style="grid-area:${this.foodY}/${this.foodX}"><img src="img/food.svg" alt="food"></div>`;
        this.snakeBody[0]=[this.x,this.y];
        htmlMarkup+=`<div class="snake-head" style="grid-area:${this.y}/${this.x}"><img src="img/head.svg" style="transform: rotate(${this.rotate}deg);" alt="snake-head"></div>`;
        for(let i=1;i<this.snakeBody.length;i++){
            htmlMarkup+=`<div class="snake-body${i}" style="grid-area:${this.snakeBody[i][1]}/${this.snakeBody[i][0]}"><img src="img/body.svg" alt="snake-body"></div>`;
            if(this.foodX===this.snakeBody[i][0]&&this.foodY===this.snakeBody[i][1]){
                this.changeFoodPosition();
            }
            if(this.snakeBody[0][1]===this.snakeBody[i][1]&&this.snakeBody[0][0]===this.snakeBody[i][0]){
                gameOver=true;
            }
        }
    }
    initGame(){
        if(gameOver) return this.handleGameOver();
        if(this.x===this.foodX && this.y===this.foodY){
            this.changeFoodPosition();
            this.snakeBody.push([this.foodX,this.foodY]);
            score++;
            scoreElement.innerHTML=`Score: ${score}`;
        }
        for(let i=this.snakeBody.length-1;i>0;i--){
            this.snakeBody[i]=this.snakeBody[i-1];
        }
        this.x+=velocityX;
        this.y+=velocityY;
        this.draw();
        if(this.x<=0||this.x>this.gameBoard||this.y<=0||this.y>this.gameBoard){
            gameOver=true;
        }
        else if(gameOver===false){
            game.innerHTML=htmlMarkup;
        }
    }
    handleGameOver(){
        clearInterval(setIntervalId);
        document.querySelector(".snake-head>img").src="img/dead-head.svg";
        for(let i=1;i<this.snakeBody.length;i++){
            let imagenSnakeBody=document.querySelector(`.snake-body${i}>img`);
            if(imagenSnakeBody){
                imagenSnakeBody.src="img/dead-body.svg";
            }
        }
        setTimeout(function(){
            document.querySelector(".container").style.display = "block";
            addClass("game-over-container");
            let gameOverC = document.getElementById("container").classList.contains("game-over-container");
            if (gameOverC) {
                document.querySelector(".game-over-container").innerHTML = "<button class='button game-over-b'>Game Over</button>";
            }
            let gameOverButton=document.querySelector(".game-over-b");
            const clickGameOverButton=()=>{
                location.reload();
            }
            gameOverButton.addEventListener("click",clickGameOverButton);
        }, 1500);
    }
}
class SGMedium extends SnakeGame{
    constructor(x,y,gameBoard){
        super(x,y,gameBoard);
        this.bombX=1;
        this.bombY=1;
        this.health=100;
    }
    changeBombPosition() {
        this.bombX=Math.floor(Math.random()*this.gameBoard+1); 
        this.bombY=Math.floor(Math.random()*this.gameBoard+1);
    }
    draw(){
        htmlMarkup=`<div style="grid-area:${this.foodY}/${this.foodX}"><img src="img/food.svg" alt="food"></div>`;
        htmlMarkup+=`<div style="grid-area:${this.bombY}/${this.bombX}"><img src="img/bomb.svg" alt="bomb"></div>`;
        this.snakeBody[0]=[this.x,this.y];
        htmlMarkup+=`<div class="snake-head" style="grid-area:${this.y}/${this.x}"><img src="img/head.svg" style="transform: rotate(${this.rotate}deg);" alt="snake-head"></div>`;
        for(let i=1;i<this.snakeBody.length;i++){
            htmlMarkup+=`<div class="snake-body${i}" style="grid-area:${this.snakeBody[i][1]}/${this.snakeBody[i][0]}"><img src="img/body.svg" alt="snake-body"></div>`;
            if(this.foodX===this.snakeBody[i][0]&&this.foodY===this.snakeBody[i][1]){
                this.changeFoodPosition();
            }
            else if (this.bombX===this.snakeBody[i][0]&&this.bombY===this.snakeBody[i][1]){
                this.changeBombPosition();
            }
            if(this.snakeBody[0][1]===this.snakeBody[i][1]&&this.snakeBody[0][0]===this.snakeBody[i][0]){
                gameOver=true;
            }
        }
    }
    initGame(){
        if(gameOver) return this.handleGameOver();
        if(this.x===this.foodX && this.y===this.foodY){
            this.changeBombPosition();
            this.changeFoodPosition();
            this.snakeBody.push([this.foodX,this.foodY]);
            score++;
            scoreElement.innerHTML=`Score: ${score}`;
        }
        if(this.x===this.bombX && this.y===this.bombY){
            this.changeBombPosition();
            this.health-=10;
            document.querySelector(".health").style = `width: ${this.health}%;`;
            document.getElementById("health").textContent = `${this.health}%`;
        }
        for(let i=this.snakeBody.length-1;i>0;i--){
            this.snakeBody[i]=this.snakeBody[i-1];
        }
        this.x+=velocityX;
        this.y+=velocityY;
        this.draw();
        if(this.health===0||this.x<=0||this.x>this.gameBoard||this.y<=0||this.y>this.gameBoard){
            gameOver=true;
        }
        else if(gameOver===false){
            game.innerHTML=htmlMarkup;
        }
    }
}
class SGHard extends SGMedium{
    constructor(x,y,gameBoard){
        super(x,y,gameBoard);
        this.blockX=1;
        this.blockY=1;
        this.health=100;
    }
    changeBlockPosition() {
        this.blockX=Math.floor(Math.random()*this.gameBoard+1); 
        this.blockY=Math.floor(Math.random()*this.gameBoard+1);
    }
    draw(){
        htmlMarkup=`<div style="grid-area:${this.foodY}/${this.foodX}"><img src="img/food.svg" alt="food"></div>`;
        htmlMarkup+=`<div style="grid-area:${this.bombY}/${this.bombX}"><img src="img/bomb.svg" alt="bomb"></div>`;
        htmlMarkup+=`<div style="grid-area:${this.blockY}/${this.blockX}"><img src="img/block.svg" alt="block"></div>`;
        this.snakeBody[0]=[this.x,this.y];
        htmlMarkup+=`<div class="snake-head" style="grid-area:${this.y}/${this.x}"><img src="img/head.svg" style="transform: rotate(${this.rotate}deg);" alt="snake-head"></div>`;
        for(let i=1;i<this.snakeBody.length;i++){
            htmlMarkup+=`<div class="snake-body${i}" style="grid-area:${this.snakeBody[i][1]}/${this.snakeBody[i][0]}"><img src="img/body.svg" alt="snake-body"></div>`;
            if(this.foodX===this.snakeBody[i][0]&&this.foodY===this.snakeBody[i][1]){
                this.changeFoodPosition();
            }
            else if (this.bombX===this.snakeBody[i][0]&&this.bombY===this.snakeBody[i][1]){
                this.changeBombPosition();
            }
            else if (this.blockX===this.snakeBody[i][0]&&this.blockY===this.snakeBody[i][1]){
                this.changeBlockPosition();
            }
            if(this.snakeBody[0][1]===this.snakeBody[i][1]&&this.snakeBody[0][0]===this.snakeBody[i][0]){
                gameOver=true;
            }
        }
    }
    initGame(){
        if(gameOver) return this.handleGameOver();
        if(this.x===this.foodX && this.y===this.foodY){
            this.changeBlockPosition();
            this.changeBombPosition();
            this.changeFoodPosition();
            this.snakeBody.push([this.foodX,this.foodY]);
            score++;
            scoreElement.innerHTML=`Score: ${score}`;
        }
        else if(this.x===this.bombX && this.y===this.bombY){
            this.changeBombPosition();
            this.health-=10;
            document.querySelector(".health").style = `width: ${this.health}%;`;
            document.getElementById("health").textContent = `${this.health}%`;
        }
        for(let i=this.snakeBody.length-1;i>0;i--){
            this.snakeBody[i]=this.snakeBody[i-1];
        }
        this.x+=velocityX;
        this.y+=velocityY;
        this.draw();
        if((this.x===this.blockX&&this.y===this.blockY)||this.health===0||this.x<=0||this.x>this.gameBoard||this.y<=0||this.y>this.gameBoard){
            gameOver=true;
        }
        else if(gameOver===false){
            game.innerHTML=htmlMarkup;
        }
    }
}

const developerContainer=p=>{
    let developerButton=document.querySelector(".icon-developer");
    const clickDeveloperButton=()=>{
        removeClass("start-container");
        removeClass("info-container")
        removeClass("difficulty-container");
        addClass("developer-container");
        let developerC = document.getElementById("container").classList.contains("developer-container");
        if (developerC) {
            document.querySelector(".developer-container").innerHTML = "<p>Developer by Gianella Annie</p>";
        }
        developerButton.addEventListener("click", ()=> {
            removeClass("developer-container");
            if(p==="startContainer"){
                startContainer();
            }
            else if(p==="clickInfoButton"){
                clickInfoButton();
            }
            else if(p==="clickStartButton"){
                clickStartButton();
            }
        });
    }
    developerButton.addEventListener("click", clickDeveloperButton);
}
const clickStartButton=()=>{
    developerContainer("clickStartButton");
    removeClass("start-container");
    addClass("difficulty-container");
    let difficultyC = document.getElementById("container").classList.contains("difficulty-container");
    if (difficultyC) {
        document.querySelector(".difficulty-container").innerHTML = "<div class='difficulty-s'><p>Select difficulty:</p><button class='button easy-b'>Easy</button><button class='button medium-b'>Medium</button><button class='button hard-b'>Hard</button></div>";
    }

    let easyButton=document.querySelector(".easy-b");
    let mediumButton=document.querySelector(".medium-b");
    let hardButton=document.querySelector(".hard-b");

    const clickEasyButton=()=>{
        removeClass("difficulty-container");
        document.querySelector(".container").style.display = "none";
        let snakeEasy = new SnakeGame(Math.floor(7/2),Math.floor(7/2),7);
        setIntervalId=setInterval(snakeEasy.initGame.bind(snakeEasy), 300);
        document.addEventListener("keydown",snakeEasy.changeDirection.bind(snakeEasy));
        snakeEasy.changeFoodPosition();
        snakeEasy.initGame();
    }
    const clickMediumButton=()=>{
        removeClass("difficulty-container");
        document.querySelector(".game-details > hr").style.display = "none";
        document.querySelector(".health-bar").style.display = "block";
        drawGameBoard(14);
        document.querySelector(".container").style.display = "none";
        let snakeMedium=new SGMedium(Math.floor(14/2),Math.floor(14/2),14);
        setIntervalId=setInterval(snakeMedium.initGame.bind(snakeMedium), 200);
        document.addEventListener("keydown",snakeMedium.changeDirection.bind(snakeMedium));
        snakeMedium.changeBombPosition();
        snakeMedium.changeFoodPosition();
        snakeMedium.initGame();
    }
    const clickHardButton=()=>{
        removeClass("difficulty-container");
        document.querySelector(".game-details > hr").style.display = "none";
        document.querySelector(".health-bar").style.display = "block";
        drawGameBoard(28);
        document.querySelector(".container").style.display = "none";
        let snakeHard=new SGHard(Math.floor(28/2),Math.floor(28/2),28);
        setIntervalId=setInterval(snakeHard.initGame.bind(snakeHard), 100);
        document.addEventListener("keydown",snakeHard.changeDirection.bind(snakeHard));
        snakeHard.changeBombPosition();
        snakeHard.changeBlockPosition();
        snakeHard.changeFoodPosition();
        snakeHard.initGame();
    }

    easyButton.addEventListener("click", clickEasyButton);
    mediumButton.addEventListener("click", clickMediumButton);
    hardButton.addEventListener("click", clickHardButton);
}
const clickInfoButton=()=>{
    developerContainer("clickInfoButton");
    removeClass("start-container");
    addClass("info-container");
    let infoC = document.getElementById("container").classList.contains("info-container");
    if (infoC) {
        document.querySelector(".info-container").innerHTML = "<div class='info-s'><div class='items'><div><img src='img/food.svg' alt='food'><p>Food</p></div><div><img src='img/bomb.svg' alt='bomb'><p>Bomb</p></div><div><img src='img/block.svg' alt='block'><p>Block</p></div></div><button class='button exit-b'>Exit</button><div>";
    }
    let exitButton=document.querySelector(".exit-b");
    const clickExitButton=()=>{
        removeClass("info-container");
        startContainer();
    }
    exitButton.addEventListener("click", clickExitButton);
}
const startContainer=()=>{
    developerContainer("startContainer");
    addClass("start-container");
    let startC = document.getElementById("container").classList.contains("start-container");
    if (startC) {
        document.querySelector(".start-container").innerHTML = "<button class='icon-info'><img src='img/info.svg' alt='info'></button><button class='button start-b'>Start Game</button>";
    }
    let startButton=document.querySelector(".start-b");
    let infoButton=document.querySelector(".icon-info");
    infoButton.addEventListener("click", clickInfoButton);
    startButton.addEventListener("click", clickStartButton);
}

startContainer();
