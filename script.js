function addClass(addclass) {
    document.getElementById("container").classList.add(addclass);
}
function removeClass(removeClass){
    document.getElementById("container").classList.remove(removeClass);
}

let imgFood=document.getElementById('food');
let imgBomb=document.getElementById('bomb');
let imgBlock=document.getElementById('block');
let imgBody=document.getElementById('body');
let imgHead=document.getElementById('head');
let imgDeadHead=document.getElementById('dead-head');
let imgDeadBody=document.getElementById('dead-body');
let dom_canvas=document.createElement('canvas');
let dom_highScore=document.getElementById('high-score');
document.getElementById('canvas').appendChild(dom_canvas);
let ctx=dom_canvas.getContext('2d');
let velocityX=0;
let velocityY=0;
let score=0;
let w,h;

function resizeCanvas(){
    if(window.innerWidth>770){
        w=(dom_canvas.width=700);
        h=(dom_canvas.height=700);
    }
    else if(window.innerWidth<=770 && window.innerWidth>630){
        w=(dom_canvas.width=560);
        h=(dom_canvas.height=560);
    }
    else if(window.innerWidth<=630 && window.innerWidth>500){
        w=(dom_canvas.width=420);
        h=(dom_canvas.height=420);
    }
    else if(window.innerWidth<=500 && window.innerWidth>360){
        w=(dom_canvas.width=350);
        h=(dom_canvas.height=350);
    }
    else if(window.innerWidth<=360){
        w=(dom_canvas.width=300);
        h=(dom_canvas.height=300);
    }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class SnakeGame{
    constructor(cells,speed,key,value){
        this.x=w/2;
        this.y=h/2;
        this.foodX=0;
        this.foodY=0;
        this.headRotation=0;
        this.snakeBody=[];
        this.bodyLength=2;
        this.lastBodyPosition = [0, 0];
        this.cells=cells;
        this.cellSize=w/cells;
        this.speed = speed;
        this.key=key;
        this.value=value;
    }
    foodPosition() {
        this.foodX=~~(Math.random()*this.cells)*this.cellSize;
        this.foodY=~~(Math.random()*this.cells)*this.cellSize;
    }
    drawFood(){
        ctx.drawImage(imgFood, this.foodX, this.foodY, imgFood.width * (this.cellSize / imgFood.width), imgFood.height * (this.cellSize / imgFood.height));
    }
    foodCollision(){
        if(this.x==this.foodX && this.y==this.foodY){
            this.foodPosition();
            this.bodyLength++;
            this.incrementScore();
        }
    }
    controls(e){
        this.direction(e.key);
    }
    handleInteraction(){
        let startingX, startingY, endingX, endingY;
        let moving = false;
        const touchstart=(event)=> {
            startingX = event.touches[0].clientX;
            startingY = event.touches[0].clientY;
        }
        const touchmove=(event)=> {
            moving = true;
            endingX = event.touches[0].clientX;
            endingY = event.touches[0].clientY;
        }
        const touchend=(event)=> {
            if (!moving) return;
            let touchDirection;
            if ( Math.abs(endingX - startingX) > Math.abs(endingY - startingY) ) {
                if ( endingX > startingX ) touchDirection = "ArrowRight";
                else touchDirection = "ArrowLeft";
            } else {
                if ( endingY > startingY ) touchDirection = "ArrowDown";
                else touchDirection = "ArrowUp";
            }
            this.direction(touchDirection);
            event.preventDefault();
            moving = false;
        }
        document.addEventListener("touchend", touchend);
        document.addEventListener("touchstart", touchstart);
        document.addEventListener("touchmove", touchmove);
    }
    direction(event){
        if(event=="ArrowUp" && velocityY!=1){
            velocityX=0;
            velocityY=-1;
            this.headRotation=-Math.PI/2; // -90 deg
        }
        if(event=="ArrowDown" && velocityY!=-1){
            velocityX=0;
            velocityY=1;
            this.headRotation=Math.PI/2; // 90 deg
        }
        if(event=="ArrowLeft" && velocityX!=1){
            velocityX=-1;
            velocityY=0;
            this.headRotation=Math.PI; // 180 deg
        }
        if(event=="ArrowRight" && velocityX!=-1){
            velocityX=1;
            velocityY=0;
            this.headRotation=0; // 0 deg
        }
    }
    snakePosition(){
        this.x+=velocityX*this.cellSize;
        this.y+=velocityY*this.cellSize;
    }
    drawSnake(){
        // Body
        for (let i = 0; i < this.snakeBody.length; i++) {
            ctx.drawImage(imgBody, this.snakeBody[i][0], this.snakeBody[i][1], imgBody.width * (this.cellSize / imgBody.width), imgBody.height * (this.cellSize / imgBody.height));
            if(this.snakeBody[i][0]==this.foodX && this.snakeBody[i][1]==this.foodY){
                this.foodPosition();
            }
        }
        this.snakeBody.unshift([this.x,this.y]);
        if(this.snakeBody.length>this.bodyLength){
            this.lastBodyPosition=this.snakeBody[this.snakeBody.length-1];
            this.snakeBody.pop();
        }
        // Head
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.headRotation);
        if(this.headRotation==Math.PI){
            ctx.translate(-this.cellSize,-this.cellSize);
        }
        if(this.headRotation==-Math.PI/2){
            ctx.translate(-this.cellSize,0);
        }
        if(this.headRotation==Math.PI/2){
            ctx.translate(0,-this.cellSize);
        }
        ctx.drawImage(imgHead, 0, 0, imgHead.width * (this.cellSize / imgHead.width), imgHead.height * (this.cellSize / imgHead.height));
        ctx.restore();
    }
    draw(){
        this.drawFood();
        this.drawSnake();
    }
    drawDeadSnake(){
        // Body
        ctx.drawImage(imgDeadBody, this.lastBodyPosition[0], this.lastBodyPosition[1], imgBody.width * (this.cellSize / imgBody.width), imgBody.height * (this.cellSize / imgBody.height));
        for (let i = 0; i < this.snakeBody.length; i++) {
            ctx.drawImage(imgDeadBody, this.snakeBody[i][0], this.snakeBody[i][1], imgBody.width * (this.cellSize / imgBody.width), imgBody.height * (this.cellSize / imgBody.height));
        }
        // Head
        ctx.save();
        if(this.headRotation==0){ // right
            ctx.translate(this.x-this.cellSize,this.y);
        }
        if(this.headRotation==Math.PI/2){ // down
            ctx.translate(this.x,this.y-this.cellSize);
            ctx.rotate(this.headRotation);
            ctx.translate(0,-this.cellSize)
        }
        if(this.headRotation==Math.PI){ // left
            ctx.translate(this.x+this.cellSize,this.y);
        }
        if(this.headRotation==-Math.PI/2){ // up
            ctx.translate(this.x,this.y+this.cellSize);
            ctx.rotate(this.headRotation);
            ctx.translate(-this.cellSize,0);
        }
        ctx.drawImage(imgDeadHead, 0, 0, imgDeadHead.width * (this.cellSize / imgDeadHead.width), imgDeadHead.height * (this.cellSize / imgDeadHead.height));
        ctx.restore();
    }
    clear(){
        ctx.clearRect(0,0,w,h);
    }
    incrementScore(){
        score++;
        document.getElementById('score').innerText=`Score: ${score}`;
        this.value=score>=this.value?score:this.value;
        window.localStorage.setItem(this.key, this.value);
        dom_highScore.innerText=`High Score: ${this.value}`;
    }
    isGameOver(){
        let gameOver=false;
        if(velocityX===0 && velocityY===0) return false;
        if(this.x<0||this.x+this.cellSize>w||this.y+this.cellSize>h||this.y<0){
            gameOver=true;
        }
        for (let i = 0; i < this.snakeBody.length; i++) {
            if(this.snakeBody[i][0] == this.x && this.snakeBody[i][1] == this.y){
                gameOver=true;
                break;
            }
        }
        if(gameOver){
            this.drawDeadSnake();
            setTimeout(function(){
                document.querySelector(".container").style.display = "flex";
                addClass("game-over-container");
                let gameOverC = document.getElementById("container").classList.contains("game-over-container");
                if (gameOverC) {
                    document.querySelector(".game-over-container").innerHTML = "<button class='button'>Game Over</button>";
                }
                document.querySelector(".game-over-container>.button").addEventListener("click",()=>location.reload());
            }, 1500);
        }
        return gameOver;
    }
}

class SGMedium extends SnakeGame{
    constructor(cells,speed,key,value,bombsQuantity){
        super(cells,speed,key,value);
        this.health=100;
        this.bomb=true;
        this.bombPositions=[];
        this.bombsQuantity=bombsQuantity;
        this.initBombsQuantity=~~(this.bombsQuantity/2);
    }
    bombPosition() {
        for (let i = 0; i < this.bombsQuantity; i++) {
            let bombX=~~(Math.random()*this.cells)*this.cellSize;
            let bombY=~~(Math.random()*this.cells)*this.cellSize;
            if(bombX!=this.x && bombY!=this.y){
                this.bombPositions.push([bombX,bombY]);
            }
        }
    }
    drawBomb(){
        for (let i = 0; i < this.bombPositions.length; i++) {
            if(this.bombPositions[i]){
                ctx.drawImage(imgBomb, this.bombPositions[i][0], this.bombPositions[i][1], imgBomb.width * (this.cellSize / imgBomb.width), imgBomb.height * (this.cellSize / imgBomb.height));
                if(this.foodX==this.bombPositions[i][0] && this.foodY==this.bombPositions[i][1]){
                    this.foodPosition();
                }
                if(this.x==this.bombPositions[i][0] && this.y==this.bombPositions[i][1]){
                    this.bombPositions.splice(i,1);
                    this.health-=5;
                    document.querySelector(".health").style = `width: ${this.health}%;`;
                    document.getElementById("health").innerText = `${this.health}%`;
                }
            }
        }
        if(this.bodyLength>=Math.pow(this.cells,2)-(this.cells*3)){
            this.bomb=false;
            this.bombsQuantity=0;
            this.bombPosition=[];
        }
    }
    draw(){
        this.drawBomb();
        this.drawFood();
        this.drawSnake();
    }
    foodCollision(){
        if(this.x==this.foodX && this.y==this.foodY){
            if(this.bomb){
                this.bombsQuantity--;
                if(this.bombsQuantity<=0) this.bombsQuantity=this.initBombsQuantity;
                this.bombPositions=[];
                this.bombPosition();
            }
            this.foodPosition();
            this.bodyLength++;
            this.incrementScore();
        }
    }
    isGameOver(){
        let gameOver=false;
        if(velocityX===0 && velocityY===0) return false;
        if(this.health<=0||this.x<0||this.x+this.cellSize>w||this.y+this.cellSize>h||this.y<0){
            gameOver=true;
        }
        for (let i = 0; i < this.snakeBody.length; i++) {
            if(this.snakeBody[i][0] == this.x && this.snakeBody[i][1] == this.y){
                gameOver=true;
                break;
            }
        }
        if(gameOver){
            this.drawDeadSnake();
            setTimeout(function(){
                document.querySelector(".container").style.display = "flex";
                addClass("game-over-container");
                let gameOverC = document.getElementById("container").classList.contains("game-over-container");
                if (gameOverC) {
                    document.querySelector(".game-over-container").innerHTML = "<button class='button'>Game Over</button>";
                }
                document.querySelector(".game-over-container>.button").addEventListener("click",()=>location.reload());
            }, 1500);
        }
        return gameOver;
    }
}

class SGHard extends SGMedium{
    constructor(cells,speed,key,value,bombsQuantity){
        super(cells,speed,key,value,bombsQuantity);
        this.blocksQuantity=12;
        this.blockPositions=[];
    }
    blockPosition() {
        for (let i = 0; i < this.blocksQuantity; i++) {
            let blockX=~~(Math.random()*this.cells)*this.cellSize;
            let blockY=~~(Math.random()*this.cells)*this.cellSize;
            if(blockX!==this.x && blockY!==this.y){
                this.blockPositions.push([blockX,blockY]);
            }
        }
    }
    drawBlock(){
        for (let i = 0; i < this.blockPositions.length; i++) {
            ctx.drawImage(imgBlock, this.blockPositions[i][0], this.blockPositions[i][1], imgBlock.width * (this.cellSize / imgBlock.width), imgBlock.height * (this.cellSize / imgBlock.height));
            if(this.foodX==this.blockPositions[i][0] && this.foodY==this.blockPositions[i][1]){
                this.foodPosition();
            }
        }
        if(this.snakeBody.length>=Math.pow(this.cells,2)-(this.cells*3)){
            this.block=false;
            this.blocksQuantity=0;
            this.blockPositions=[];
        }
    }
    draw(){
        this.drawBomb();
        this.drawBlock();
        this.drawFood();
        this.drawSnake();
    }
    isGameOver(){
        let gameOver=false;
        if(velocityX===0 && velocityY===0) return false;
        if(this.health<=0||this.x<0||this.x+this.cellSize>w||this.y+this.cellSize>h||this.y<0){
            gameOver=true;
        }
        for (let i = 0; i < this.snakeBody.length; i++) {
            if(this.snakeBody[i][0] == this.x && this.snakeBody[i][1] == this.y){
                gameOver=true;
                break;
            }
        }
        for (let i = 0; i < this.blockPositions.length; i++) {
            if(this.x==this.blockPositions[i][0] && this.y==this.blockPositions[i][1]){
                gameOver=true;
                break;
            }
        }
        if(gameOver){
            this.drawDeadSnake();
            setTimeout(function(){
                document.querySelector(".container").style.display = "flex";
                addClass("game-over-container");
                let gameOverC = document.getElementById("container").classList.contains("game-over-container");
                if (gameOverC) {
                    document.querySelector(".game-over-container").innerHTML = "<button class='button'>Game Over</button>";
                }
                document.querySelector(".game-over-container>.button").addEventListener("click",()=>location.reload());
            }, 1500);
        }
        return gameOver;
    }
}

const drawGame = (c) => {
    c.snakePosition();
    let result=c.isGameOver();
    if(result) return;
    c.clear();
    c.foodCollision();
    c.draw();
    setTimeout(()=>drawGame(c),1000/c.speed);
}

document.querySelector(".health-bar").style.display = "none";

const developerContainer=param=>{
    let developerButton=document.querySelector(".icon-developer");
    const clickDeveloperButton=()=>{
        removeClass("start-container");
        removeClass("info-container");
        removeClass("difficulty-container");
        addClass("developer-container");
        let developerC = document.getElementById("container").classList.contains("developer-container");
        if (developerC) {
            document.querySelector(".developer-container").innerHTML = "<p>Developer by Gianella Annie - 2024</p><p>Inspired by <a href='https://www.youtube.com/@SINERGIA_AR'>SINERGIA</a></p>";
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
        document.querySelector(".difficulty-container").innerHTML = "<p>Select difficulty:</p><button id='easy-b' class='button'>Easy</button><button id='medium-b' class='button'>Medium</button><button id='hard-b' class='button'>Hard</button>";
    }

    document.getElementById("easy-b").addEventListener("click", ()=>{
        let highScoreEasy=window.localStorage.getItem('high-score-easy')||0;
        let snakeEasy=new SnakeGame(10,7,'high-score-easy',highScoreEasy);
        removeClass("difficulty-container");
        document.querySelector(".container").style.display = "none";
        snakeEasy.foodPosition();
        drawGame(snakeEasy);
        snakeEasy.handleInteraction();
        document.addEventListener('keydown',snakeEasy.controls.bind(snakeEasy));
        dom_highScore.innerText=`High Score: ${highScoreEasy}`;
    });
    document.getElementById("medium-b").addEventListener("click", ()=>{
        let highScoreMedium=window.localStorage.getItem('high-score-medium')||0;
        let snakeMedium=new SGMedium(14,10,'high-score-medium',highScoreMedium,10);
        removeClass("difficulty-container");
        document.querySelector(".container").style.display = "none";
        document.querySelector(".game-details > hr").style.display = "none";
        document.querySelector(".health-bar").style.display = "block";
        snakeMedium.bombPosition();
        snakeMedium.foodPosition();
        drawGame(snakeMedium);
        snakeMedium.handleInteraction();
        document.addEventListener('keydown',snakeMedium.controls.bind(snakeMedium));
        dom_highScore.innerText=`High Score: ${highScoreMedium}`;
    });
    document.getElementById("hard-b").addEventListener("click", ()=>{
        let highScoreHard=window.localStorage.getItem('high-score-hard')||0;
        let snakeHard=new SGHard(16,13,'high-score-hard',highScoreHard,14);
        removeClass("difficulty-container");
        document.querySelector(".container").style.display = "none";
        document.querySelector(".game-details > hr").style.display = "none";
        document.querySelector(".health-bar").style.display = "block";
        snakeHard.bombPosition();
        snakeHard.blockPosition();
        snakeHard.foodPosition();
        drawGame(snakeHard);
        snakeHard.handleInteraction();
        document.addEventListener('keydown',snakeHard.controls.bind(snakeHard));
        dom_highScore.innerText=`High Score: ${highScoreHard}`;
    });
}
const clickInfoButton=()=>{
    developerContainer("clickInfoButton");
    removeClass("start-container");
    addClass("info-container");
    let infoC = document.getElementById("container").classList.contains("info-container");
    if (infoC) {
        document.querySelector(".info-container").innerHTML = "<div><div class='item'><img src='img/food.svg' alt='food'><div><p>FOOD</p><p>It increases your score.</p></div></div><div class='item'><img src='img/bomb.svg' alt='bomb'><div><p>BOMB</p><p>It decreases your health bar.</p></div></div><div class='item'><img src='img/block.svg' alt='block'><div><p>BLOCK</p><p>If you touch it, you lose the game.</p></div></div></div><button class='button exit-b'>Exit</button>";
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
        document.querySelector(".start-container").innerHTML = "<button class='icon-info'></button><button class='button'>Start Game</button>";
    }
    document.querySelector(".start-container>.button").addEventListener("click", clickStartButton);
    document.querySelector(".icon-info").addEventListener("click", clickInfoButton);
}

startContainer();
