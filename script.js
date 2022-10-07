const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const body = document.body;
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
    birdSrc: "./assets/img/bird-1.png",
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
    w: 40,
    h: 30,
};
const gap = 85;
const pipes = [];
pipes[0] = { x: width, y: 0, w: 60, h: 180, speed: 2 };
const vSpace = pipes[0].h + gap;
let gOver = false;
let gState = 0;
let pressed = false;
let gravity = 5;
let plays = false;
let score = 0;
let highScore = localStorage.getItem("hs");

body.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "Up") {
        if (!gOver && gState === 1 && pressed === false) {
            pressed = true;
            sfx.flap.play();
            Math.floor((gravity = -4));
            (imgs.bird.src = "./assets/img/bird-2.png"),
                setTimeout(() => {
                    Math.floor((gravity = 2));
                    pressed = false;
                }, 200);
            setTimeout(() => (imgs.bird.src = "./assets/img/bird-1.png"), 150);
        }
    } else if (gState === 0 && e.key === "Enter") {
        sfx.start.play();
        canvas.style.border = "none";
        gState = 1;
    } else if (gState === 1 && e.key.toLowerCase() === "r") {
        location.reload();
    }
});

canvas.addEventListener("click", () => {
    if (!gOver && gState === 1 && pressed === false) {
        pressed = true;
        sfx.flap.play();
        Math.floor((gravity = -4));
        (imgs.bird.src = "./assets/img/bird-2.png"),
            setTimeout(() => {
                Math.floor((gravity = 2));
                pressed = false;
            }, 200);
        setTimeout(() => (imgs.bird.src = "./assets/img/bird-1.png"), 150);
    } else if (gState === 0) {
        sfx.start.play();
        canvas.style.border = "none";
        gState = 1;
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
        Math.floor(bird.x),
        Math.floor(bird.y),
        bird.w,
        bird.h
    );
};

const clear = () => context.clearRect(0, 0, width, height);

const spawnPipes = (i) => {
    if (pipes.length && Math.floor(pipes[i].x) === Math.floor(width / 2)) {
        pipes.push({
            x: width,
            y: Math.floor((Math.random() * pipes[0].h) / 2) - pipes[0].h / 2,
            w: pipes[0].w,
            h: pipes[0].h,
            speed: pipes[0].speed,
        });
        score++;
    } else if (
        i > 0 &&
        pipes.length &&
        Math.floor(pipes[i - 1].x === -pipes[0].w)
    ) {
        pipes.shift();
    }
};

const moveBird = () => Math.floor((bird.y += gravity));

const movePipes = (j) => (pipes[j].x -= pipes[0].speed);

const drawPipes = (i) => {
    context.drawImage(
        imgs.pipeTop,
        Math.floor(pipes[i].x),
        Math.floor(pipes[i].y),
        pipes[0].w,
        pipes[0].h
    );
    context.drawImage(
        imgs.pipeBottom,
        Math.floor(pipes[i].x),
        Math.floor(pipes[i].y + vSpace),
        pipes[0].w,
        pipes[0].h
    );
};

const collisions = (i) => {
    if (!gOver && gState === 1) {
        const birdLeft = Math.floor(bird.x);
        const birdRight = Math.floor(bird.x + bird.w);
        const birdTop = Math.floor(bird.y);
        const birdBottom = Math.floor(bird.y + bird.h);
        const pipeLeft = Math.floor(pipes[i].x);
        const pipeRight = Math.floor(pipes[i].x + pipes[0].w);
        const pipeTop = Math.floor(pipes[i].y + vSpace + 5);
        const pipeBottom = Math.floor(pipes[i].y + pipes[0].h - 5);
        if (
            birdRight >= pipeLeft &&
            birdLeft <= pipeRight &&
            (birdTop <= pipeBottom || birdBottom >= pipeTop)
        ) {
            sfx.hit.play();
            gOver = true;
        } else if (birdBottom === Math.floor(height - height / 4)) {
            sfx.die.play();
            gOver = true;
        } else if (plays === false && birdRight >= pipeRight) {
            plays = true;
            sfx.score.play();
            setTimeout(() => (plays = false), 1000);
        }
    }
};

const drawGround = () => {
    context.drawImage(
        imgs.ground,
        0,
        Math.floor(height - height / 4),
        Math.floor(width),
        Math.floor(height / 4)
    );
};

const drawScore = () => {
    context.fillStyle = "black";
    context.font = "14px Consolas";
    context.fillText(`Score: ${score}`, 10, 20);
    highScore ? context.fillText(`High Score: ${highScore}`, 10, 40) : null;
};

const drawStartScreen = () => {
    canvas.style.backgroundColor = "black";
    context.fillStyle = "yellow";
    context.font = "14px Consolas";
    context.fillText(
        "Press enter or click to start the game,",
        12,
        Math.floor(height / 2 - 28)
    );
    context.fillText(
        "\nPress ↑ or click to control the bird,",
        4,
        Math.floor(height / 2)
    );
    context.fillText(
        "\nPress R to restart the game.",
        4,
        Math.floor(height / 2 + 28)
    );
};

const showGameOver = () => {
    clear();
    canvas.style.backgroundColor = "black";
    context.fillStyle = "red";
    context.font = "24px Tahoma";
    context.fillText("Game Over!", 100, 240);
    score > highScore ? localStorage.setItem("hs", score) : null;
    setTimeout(() => location.reload(), 500);
};

if (gState === 0) drawStartScreen();

const mainLoop = () => {
    if (!gOver && gState === 1) {
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
    } else if (gOver) showGameOver();
    requestAnimationFrame(mainLoop);
};

mainLoop();
