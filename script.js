const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const imgs = {
    bg: new Image(),
    bgSrc: "./assets/img/bg.png",
    pipeTop: new Image(),
    pipeTopSrc: "./assets/img/ptop.png",
    pipeBottom: new Image("./assets/img/pbottom.png"),
    pipeBottomSrc: "./assets/img/pbottom.png",
    bird: new Image(),
    birdSrc: "./assets/img/bird.png",
    ground: new Image(),
    groundSrc: "./assets/img/ground.png",
};
imgs.bg.src = imgs.bgSrc;
imgs.pipeTop.src = imgs.pipeTopSrc;
imgs.pipeBottom.src = imgs.pipeBottomSrc;
imgs.bird.src = imgs.birdSrc;
imgs.ground.src = imgs.groundSrc;
const sfx = {
    start: new Audio("./assets/sfx/start.wav"),
    flap: new Audio("./assets/sfx/flap.wav"),
    hit: new Audio("./assets/sfx/hit.wav"),
    die: new Audio("./assets/sfx/die.wav"),
    score: new Audio("./assets/sfx/score.wav"),
};
const bird = {
    x: 64,
    y: 0,
    width: 40,
    height: 30,
    gravity: 6,
};
const pipes = [];
pipes[0] = {
    x: width,
    y: 0,
    width: 60,
    height: 180,
    speed: 2,
    space: 275,
};
const game = {
    over: false,
    state: 0,
    pressed: false,
    plays: false,
    score: 0,
    highScore: localStorage.getItem("hs"),
};

window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowUp" || e.key == "Up") {
        if (!game.over && game.state == 1 && !game.pressed) {
            game.pressed = true;
            sfx.flap.play();
            bird.gravity = -4;
            imgs.bird.src = "./assets/img/bird2.png";
            setTimeout(() => {
                bird.gravity = 2;
                game.pressed = false;
            }, 200);
            setTimeout(() => (imgs.bird.src = "./assets/img/bird.png"), 150);
        }
    } else if (game.state == 0 && e.key == "Enter") {
        sfx.start.play();
        canvas.style.border = "none";
        game.state = 1;
    } else if (game.state == 1 && e.key.toLowerCase() == "r") location.reload();
});

canvas.addEventListener("click", () => {
    if (!game.over && game.state == 1 && !game.pressed) {
        game.pressed = true;
        sfx.flap.play();
        bird.gravity = -4;
        imgs.bird.src = "./assets/img/bird2.png";
        setTimeout(() => {
            bird.gravity = 2;
            game.pressed = false;
        }, 200);
        setTimeout(() => (imgs.bird.src = "./assets/img/bird.png"), 150);
    } else if (game.state == 0) {
        sfx.start.play();
        canvas.style.border = "none";
        game.state = 1;
    }
});

const drawBackground = () => {
    context.fillStyle = "#00d1ff";
    context.fillRect(0, 0, width, height);
    context.drawImage(imgs.bg, 0, height / 2, width, height / 2);
};

const drawBird = () => {
    context.drawImage(
        imgs.bird,
        bird.x,
        Math.floor(bird.y),
        bird.width,
        bird.height
    );
};

const clear = () => context.clearRect(0, 0, width, height);

const spawnPipes = (i) => {
    if (pipes.length && pipes[i].x == width / 2) {
        pipes.push({
            x: width,
            y:
                Math.floor((Math.random() * pipes[0].height) / 2) -
                pipes[0].height / 2,
            width: pipes[0].width,
            height: pipes[0].height,
            speed: pipes[0].speed,
            space: pipes[0].space,
        });
        i > 0 ? game.score++ : null;
    }
    if (i > 0 && pipes.length && pipes[i - 1].x == -pipes[0].width)
        pipes.shift();
};

const moveBird = () => (bird.y += bird.gravity);

const movePipes = (j) => (pipes[j].x -= pipes[0].speed);

const drawPipes = (i) => {
    context.drawImage(
        imgs.pipeTop,
        Math.floor(pipes[i].x),
        pipes[i].y,
        pipes[0].width,
        pipes[0].height
    );
    context.drawImage(
        imgs.pipeBottom,
        Math.floor(pipes[i].x),
        pipes[i].y + pipes[0].space,
        pipes[0].width,
        pipes[0].height
    );
};

const collisions = (i) => {
    if (!game.over && game.state == 1) {
        const birdLeft = bird.x;
        const birdRight = bird.x + bird.width;
        const birdTop = bird.y;
        const birdBottom = bird.y + bird.height;
        const pipeLeft = pipes[i].x;
        const pipeRight = pipes[i].x + pipes[0].width;
        const pipeTop = pipes[i].y + pipes[0].space + 5;
        const pipeBottom = pipes[i].y + pipes[0].height - 5;
        if (
            birdRight >= pipeLeft &&
            birdLeft <= pipeRight &&
            (birdTop <= pipeBottom || birdBottom >= pipeTop)
        ) {
            sfx.hit.play();
            game.over = true;
        } else if (birdBottom == height - height / 4) {
            sfx.die.play();
            game.over = true;
        } else if (!game.plays && birdRight >= pipeRight) {
            game.plays = true;
            sfx.score.play();
            setTimeout(() => (game.plays = false), 1000);
        }
    }
};

const drawGround = () =>
    context.drawImage(imgs.ground, 0, height - height / 4, width, height / 4);

const drawScore = () => {
    context.fillStyle = "black";
    context.font = "14px Consolas";
    context.fillText(`Score: ${game.score}`, 10, 20);
    game.highScore
        ? context.fillText(`High Score: ${game.highScore}`, 10, 40)
        : null;
};

const drawStartScreen = () => {
    context.fillStyle = "yellow";
    context.font = "14px Consolas";
    context.fillText(
        "Press enter or click to start the game,",
        12,
        height / 2 - 28
    );
    context.fillText("\nPress ↑ or click to control the bird,", 4, height / 2);
    context.fillText("\nPress R to restart the game.", 4, height / 2 + 28);
};

const showGameOver = () => {
    clear();
    context.fillStyle = "red";
    context.font = "24px Tahoma";
    context.fillText("Game Over!", 100, 240);
    game.score > game.highScore ? localStorage.setItem("hs", game.score) : null;
    setTimeout(() => location.reload(), 500);
};

if (game.state == 0) drawStartScreen();

const mainLoop = () => {
    if (!game.over && game.state == 1) {
        drawBackground();
        drawBird();
        for (let i = 0; i < pipes.length; i++) drawPipes(i);
        moveBird();
        for (let j = 0; j < pipes.length; j++) {
            spawnPipes(j);
            movePipes(j);
            collisions(j);
        }
        drawGround();
        drawScore();
    } else if (game.over) showGameOver();
    requestAnimationFrame(mainLoop);
};

mainLoop();
