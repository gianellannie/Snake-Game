function addClass(addclass) {
    document.getElementById("container").classList.add(addclass);
}
function removeClass(removeClass){
    document.getElementById("container").classList.remove(removeClass);
}
function drawGameBoard(param){
    document.querySelector(".game").style=`grid-template-columns: repeat(${param}, 1fr);grid-template-rows: repeat(${param}, 1fr);`;
}
function clickButton(snakeClass,param){
    removeClass("difficulty-container");
    document.querySelector(".container").style.display = "none";
    setIntervalId=setInterval(snakeClass.initGame.bind(snakeClass), param);
    document.addEventListener("keydown",snakeClass.changeDirection.bind(snakeClass));
    snakeClass.changeFoodPosition();
    snakeClass.initGame();
}

let htmlMarkup;
let gameOver=false;
let setIntervalId;
let velocityX=0,velocityY=0;
let score = 0;
const scoreElement=document.querySelector(".score");
const game=document.querySelector(".game");
const highScoreElement=document.querySelector(".high-score");
document.querySelector(".health-bar").style.display = "none";

class SnakeGame{
    constructor(x,y,gameBoard,value,key){
        this.x=x;
        this.y=y;
        this.foodX=1;
        this.foodY=1;
        this.value=value;
        this.key=key;
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
    drawFood(){
        htmlMarkup=`<div style="grid-area:${this.foodY}/${this.foodX}"><img src="img/food.svg" alt="food"></div>`;
    }
    drawSnake(){
        this.snakeBody[0]=[this.x,this.y];
        htmlMarkup+=`<div class="snake-head" style="grid-area:${this.y}/${this.x}"><img src="img/head.svg" style="transform: rotate(${this.rotate}deg);" alt="snake-head"></div>`;
        for(let i=1;i<this.snakeBody.length;i++){
            htmlMarkup+=`<div class="snake-body${i}" style="grid-area:${this.snakeBody[i][1]}/${this.snakeBody[i][0]}"><img src="img/body.svg" alt="snake-body"></div>`;
            if(this.foodX===this.snakeBody[i][0]&&this.foodY===this.snakeBody[i][1]) this.changeFoodPosition();
            if(this.snakeBody[0][1]===this.snakeBody[i][1]&&this.snakeBody[0][0]===this.snakeBody[i][0]) gameOver=true;
        }
    }
    draw(){
        this.drawFood();
        this.drawSnake();
    }
    initGame(){
        if(gameOver) return this.handleGameOver();
        if(this.x===this.foodX && this.y===this.foodY){
            this.changeFoodPosition();
            this.snakeBody.push([this.foodX,this.foodY]);
            score++;
            scoreElement.innerHTML=`Score: ${score}`;
            this.value=score>=this.value?score:this.value;
            sessionStorage.setItem(this.key, this.value);
            highScoreElement.innerHTML=`High Score: ${this.value}`;
        }
        for(let i=this.snakeBody.length-1;i>0;i--){
            this.snakeBody[i]=this.snakeBody[i-1];
        }
        this.x+=velocityX;
        this.y+=velocityY;
        this.draw();
        if(this.x<=0||this.x>this.gameBoard||this.y<=0||this.y>this.gameBoard) gameOver=true;
        else if(gameOver===false) game.innerHTML=htmlMarkup;
    }
    handleGameOver(){
        clearInterval(setIntervalId);
        let imagenSnakeHead=document.querySelector(".snake-head>img");
        if(imagenSnakeHead) imagenSnakeHead.src="img/dead-head.svg";
        for(let i=1;i<this.snakeBody.length;i++){
            let imagenSnakeBody=document.querySelector(`.snake-body${i}>img`);
            if(imagenSnakeBody) imagenSnakeBody.src="img/dead-body.svg";
        }
        setTimeout(function(){
            document.querySelector(".container").style.display = "block";
            addClass("game-over-container");
            let gameOverC = document.getElementById("container").classList.contains("game-over-container");
            if (gameOverC) {
                document.querySelector(".game-over-container").innerHTML = "<button class='button game-over-b'>Game Over</button>";
            }
            document.querySelector(".game-over-b").addEventListener("click",()=>location.reload());
        }, 1500);
    }
}
class SGMedium extends SnakeGame{
    constructor(x,y,gameBoard,value,key,bombsQuantity){
        super(x,y,gameBoard,value,key);
        this.health=100;
        this.bomb=true;
        this.bombPosition=[];
        this.bombsQuantity=bombsQuantity;
        this.initBombsQuantity=Math.floor(this.bombsQuantity/2);
    }
    changeBombPosition() {
        for (let i = 0; i < this.bombsQuantity; i++) {
            let bombX=Math.floor(Math.random()*this.gameBoard+1);
            let bombY=Math.floor(Math.random()*this.gameBoard+1);
            this.bombPosition.push([bombX,bombY]);
        }
    }
    drawBomb(){
        for (let i = 0; i < this.bombPosition.length; i++) {
            htmlMarkup+=`<div style="grid-area:${this.bombPosition[i][1]}/${this.bombPosition[i][0]}"><img src="img/bomb.svg" alt="bomb"></div>`;
            Math.pow(this.gameBoard,2)-(this.gameBoard*2)
            if(this.x===this.bombPosition[i][0] && this.y===this.bombPosition[i][1]){
                this.bombsQuantity++;
                this.bombPosition.splice(i,1);
                this.health-=5;
                document.querySelector(".health").style = `width: ${this.health}%;`;
                document.getElementById("health").textContent = `${this.health}%`;
            }
            else if(this.foodX===this.bombPosition[i][0]&&this.foodY===this.bombPosition[i][1]) this.changeFoodPosition();
        }
        if(this.snakeBody.length>=Math.pow(this.gameBoard,2)-(this.gameBoard*4)){
            this.bomb=false;
            this.bombsQuantity=0;
            this.bombPosition=[];
        }
    }
    draw(){
        this.drawFood();
        this.drawBomb();
        this.drawSnake();
    }
    initGame(){
        if(gameOver) return this.handleGameOver();
        if(this.x===this.foodX && this.y===this.foodY){
            if(this.bomb){
                this.bombsQuantity--;
                if(this.bombsQuantity<=0) this.bombsQuantity=this.initBombsQuantity;
                this.bombPosition=[];
                this.changeBombPosition();
            }
            this.changeFoodPosition();
            this.snakeBody.push([this.foodX,this.foodY]);
            score++;
            scoreElement.innerHTML=`Score: ${score}`;
            this.value=score>=this.value?score:this.value;
            sessionStorage.setItem(this.key, this.value);
            highScoreElement.innerHTML=`High Score: ${this.value}`;
        }
        for(let i=this.snakeBody.length-1;i>0;i--){
            this.snakeBody[i]=this.snakeBody[i-1];
        }
        this.x+=velocityX;
        this.y+=velocityY;
        this.draw();
        if(this.health<=0||this.x<=0||this.x>this.gameBoard||this.y<=0||this.y>this.gameBoard) gameOver=true;
        else if(gameOver===false) game.innerHTML=htmlMarkup;
    }
}
class SGHard extends SGMedium{
    constructor(x,y,gameBoard,value,key,bombsQuantity,blocksQuantity){
        super(x,y,gameBoard,value,key,bombsQuantity);
        this.blockPosition=[];
        this.blocksQuantity=blocksQuantity;
    }
    changeBlockPosition() {
        for (let i = 0; i < this.blocksQuantity; i++) {
            let blockX=Math.floor(Math.random()*this.gameBoard+1);
            let blockY=Math.floor(Math.random()*this.gameBoard+1);
            this.blockPosition.push([blockX,blockY]);
        }
    }
    drawBlock(){
        for (let i = 0; i < this.blockPosition.length; i++) {
            htmlMarkup+=`<div style="grid-area:${this.blockPosition[i][1]}/${this.blockPosition[i][0]}"><img src="img/block.svg" alt="block"></div>`;
            if(this.foodX===this.blockPosition[i][0]&&this.foodY===this.blockPosition[i][1]) this.changeFoodPosition();
            if(this.x===this.blockPosition[i][0]&&this.y===this.blockPosition[i][1]) gameOver=true;
        }
        if(this.snakeBody.length>=Math.pow(this.gameBoard,2)-(this.gameBoard*2)){
            this.block=false;
            this.blocksQuantity=0;
            this.blockPosition=[];
        }
    }
    draw(){
        this.drawFood();
        this.drawBomb();
        this.drawBlock();
        this.drawSnake();
    }
}

const developerContainer=param=>{
    let developerButton=document.querySelector(".icon-developer");
    const clickDeveloperButton=()=>{
        removeClass("start-container");
        removeClass("info-container");
        removeClass("difficulty-container");
        addClass("developer-container");
        let developerC = document.getElementById("container").classList.contains("developer-container");
        if (developerC) {
            document.querySelector(".developer-container").innerHTML = "<div><p>Developer by Gianella Annie - 2024</p><p>Inspired by <a class='inspired' href='https://www.youtube.com/@SINERGIA_AR'>SINERGIA</a></p></div>";
        }
        developerButton.addEventListener("click", ()=> {
            removeClass("start-container");
            removeClass("info-container");
            removeClass("difficulty-container");
            removeClass("developer-container");
            if(param==="startContainer") startContainer();
            else if(param==="clickInfoButton") clickInfoButton();
            else if(param==="clickStartButton") clickStartButton();
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

    document.querySelector(".easy-b").addEventListener("click", ()=>{
        let highScoreEasy=sessionStorage.getItem('high-score-easy')||0;
        drawGameBoard(7);
        let snakeEasy = new SnakeGame(Math.floor(7/2),Math.floor(7/2),7,highScoreEasy,'high-score-easy');
        clickButton(snakeEasy,300);
        highScoreElement.innerHTML=`High Score: ${highScoreEasy}`;
    });
    document.querySelector(".medium-b").addEventListener("click", ()=>{
        let highScoreMedium=sessionStorage.getItem('high-score-medium')||0;
        document.querySelector(".game-details > hr").style.display = "none";
        document.querySelector(".health-bar").style.display = "block";
        drawGameBoard(14);
        let snakeMedium=new SGMedium(Math.floor(14/2),Math.floor(14/2),14,highScoreMedium,'high-score-medium',14);
        snakeMedium.changeBombPosition();
        clickButton(snakeMedium,200);
        highScoreElement.innerHTML=`High Score: ${highScoreMedium}`;
    });
    document.querySelector(".hard-b").addEventListener("click", ()=>{
        let highScoreHard=sessionStorage.getItem('high-score-hard')||0;
        document.querySelector(".game-details > hr").style.display = "none";
        document.querySelector(".health-bar").style.display = "block";
        drawGameBoard(28);
        let snakeHard=new SGHard(Math.floor(28/2),Math.floor(28/2),28,highScoreHard,'high-score-hard',18,24);
        snakeHard.changeBombPosition();
        snakeHard.changeBlockPosition();
        clickButton(snakeHard,100);
        highScoreElement.innerHTML=`High Score: ${highScoreHard}`;
    });
}
const clickInfoButton=()=>{
    developerContainer("clickInfoButton");
    removeClass("start-container");
    addClass("info-container");
    let infoC = document.getElementById("container").classList.contains("info-container");
    if (infoC) {
        document.querySelector(".info-container").innerHTML = "<div class='info-s'><div class='items'><div><img src='img/food.svg' alt='food'><p>Food</p></div><div><img src='img/bomb.svg' alt='bomb'><p>Bomb</p></div><div><img src='img/block.svg' alt='block'><p>Block</p></div></div><button class='button exit-b'>Exit</button><div>";
    }
    const clickExitButton=()=>{
        removeClass("info-container");
        startContainer();
    }
    document.querySelector(".exit-b").addEventListener("click", clickExitButton);
}
const startContainer=()=>{
    developerContainer("startContainer");
    addClass("start-container");
    let startC = document.getElementById("container").classList.contains("start-container");
    if (startC) {
        document.querySelector(".start-container").innerHTML = "<button class='icon-info'><img src='img/info.svg' alt='info'></button><button class='button start-b'>Start Game</button>";
    }
    document.querySelector(".start-b").addEventListener("click", clickStartButton);
    document.querySelector(".icon-info").addEventListener("click", clickInfoButton);
}

startContainer();
