const cs = document.querySelector("canvas");
const cx = cs.getContext("2d");
const imgs = {
    bgImg: new Image(),
    bgImgSrc: "./assets/img/bg.png",
    pTop: new Image(),
    pTopSrc: "./assets/img/ptop.png",
    pBottom: new Image(),
    pBottomSrc: "./assets/img/pbottom.png",
    bird: new Image(),
    birdSrc: "./assets/img/bird-1.png",
    ground: new Image(),
    groundSrc: "./assets/img/ground.png",
};
imgs.bgImg.src = imgs.bgImgSrc;
imgs.pTop.src = imgs.pTopSrc;
imgs.pBottom.src = imgs.pBottomSrc;
imgs.bird.src = imgs.birdSrc;
imgs.ground.src = imgs.groundSrc;
const sfx = {
    startSnd: new Audio(),
    startSndSrc: "./assets/sfx/start.wav",
    flpSnd: new Audio(),
    flpSndSrc: "./assets/sfx/flap.wav",
    hitSnd: new Audio(),
    hitSndSrc: "./assets/sfx/hit.wav",
    dieSnd: new Audio(),
    dieSndSrc: "./assets/sfx/die.wav",
    scoreSnd: new Audio(),
    scoreSndSrc: "./assets/sfx/score.wav",
};
sfx.startSnd.src = sfx.startSndSrc;
sfx.flpSnd.src = sfx.flpSndSrc;
sfx.hitSnd.src = sfx.hitSndSrc;
sfx.dieSnd.src = sfx.dieSndSrc;
sfx.scoreSnd.src = sfx.scoreSndSrc;
const size = {
    sw: cs.width,
    sh: cs.height,
    birdW: 45,
    birdH: 35,
    pipeW: 60,
    pipeH: 180,
    groundW: cs.width,
};
const birdCords = {
    birdX: 64,
    birdY: 0,
};
const gap = 100;
const vrtclSpc = size.pipeH + gap;
const pipes = [];
const body = document.body;
let gOver = false;
let gravity = 5;
let gState = 0;
let pressed = false;
let score = 0;
let plays = false;
let hs = localStorage.getItem("hs");
pipes[0] = {
    x: size.sw,
    y: 0,
};
body.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        if (!gOver && gState === 1 && pressed === false) {
            pressed = true;
            sfx.flpSnd.play();
            gravity = -4;
            (imgs.bird.src = "./assets/img/bird-2.png"),
                setTimeout(() => {
                    gravity = 3;
                    pressed = false;
                }, 200);
            setTimeout(() => (imgs.bird.src = "./assets/img/bird-1.png"), 150);
        }
    } else if (gState === 0 && e.key === "Enter") {
        sfx.startSnd.play();
        cs.style.border = "none";
        gState = 1;
    } else if (gState === 1 && e.key.toLowerCase() === "r") {
        location.reload();
    }
});
cs.addEventListener("click", () => {
    if (!gOver && gState === 1 && pressed === false) {
        pressed = true;
        sfx.flpSnd.play();
        gravity = -4;
        (imgs.bird.src = "./assets/img/bird-2.png"),
            setTimeout(() => {
                gravity = 3;
                pressed = false;
            }, 200);
        setTimeout(() => (imgs.bird.src = "./assets/img/bird-1.png"), 150);
    } else if (gState === 0) {
        sfx.startSnd.play();
        gState = 1;
        cs.style.border = "none";
    }
});
const colDetector = (i) => {
    if (!gOver && gState === 1) {
        setInterval(() => (size.groundW = size.sw + 24), 10);
        setInterval(() => (size.groundW = size.sw), 20);
        const birdLeft = birdCords.birdX;
        const birdRight = birdCords.birdX + size.birdW;
        const birdTop = birdCords.birdY;
        const birdBottom = birdCords.birdY + size.birdH;
        const pipeLeft = pipes[i].x;
        const pipeRight = pipes[i].x + size.pipeW;
        const pipeTop = pipes[i].y + vrtclSpc;
        const pipeBottom = pipes[i].y + size.pipeH;
        if (
            birdRight >= pipeLeft &&
            birdLeft <= pipeRight &&
            (birdTop <= pipeBottom || birdBottom >= pipeTop)
        ) {
            sfx.hitSnd.play();
            gOver = true;
        } else if (birdBottom === size.sh - size.sh / 4) {
            sfx.dieSnd.play();
            gOver = true;
        } else if (plays === false && birdRight >= pipeRight) {
            plays = true;
            sfx.scoreSnd.play();
            setTimeout(() => (plays = false), 1000);
        }
    }
};
const gLoop = () => {
    if (!gOver && gState === 1) {
        cx.clearRect(0, 0, size.sw, size.sh);
        cx.fillStyle = "#00d1ff";
        cx.fillRect(0, 0, size.sw, size.sh);
        cx.drawImage(imgs.bgImg, 0, size.sh / 2, size.sw, size.sh / 2);
        birdCords.birdY += gravity;
        for (let i = 0; i < pipes.length; i++) {
            colDetector(i);
            pipes[i].x -= 2;
            if (pipes.length && pipes[i].x === size.sw / 2) {
                pipes.push({
                    x: size.sw,
                    y:
                        Math.floor((Math.random() * size.pipeH) / 2) -
                        size.pipeH / 2,
                });
                score++;
            } else if (
                i > 0 &&
                pipes.length &&
                pipes[i - 1].x === -size.pipeW
            ) {
                pipes.shift();
            }
        }
        for (let j = 0; j < pipes.length; j++) {
            cx.drawImage(
                imgs.pTop,
                pipes[j].x,
                pipes[j].y,
                size.pipeW,
                size.pipeH
            );
            cx.drawImage(
                imgs.pBottom,
                pipes[j].x,
                pipes[j].y + vrtclSpc,
                size.pipeW,
                size.pipeH
            );
        }
        cx.drawImage(
            imgs.bird,
            birdCords.birdX,
            birdCords.birdY,
            size.birdW,
            size.birdH
        );
        cx.drawImage(
            imgs.ground,
            0,
            size.sh - size.sh / 4,
            size.groundW,
            size.sh / 4
        );
        cx.fillStyle = "black";
        cx.font = "14px Consolas";
        cx.fillText(`Score: ${score}`, 10, 20);
        hs ? cx.fillText(`High Score: ${hs}`, 10, 40) : null;
    } else if (gOver) {
        cx.clearRect(0, 0, size.sw, size.sh);
        cs.style.backgroundColor = "black";
        cx.fillStyle = "red";
        cx.font = "24px Tahoma";
        cx.fillText(`Game Over!`, 100, 240);
        score > hs ? localStorage.setItem("hs", score) : null;
        setTimeout(() => location.reload(), 500);
    }
    requestAnimationFrame(gLoop);
};
if (gState === 0) {
    cs.style.backgroundColor = "black";
    cx.fillStyle = "yellow";
    cx.font = "14px Consolas";
    cx.fillText(
        "Press enter or click to start the game,",
        12,
        size.sh / 2 - 28
    );
    cx.fillText("\nPress ↑ or click to control the bird,", 4, size.sh / 2);
    cx.fillText("\nPress R to restart the game.", 4, size.sh / 2 + 28);
}

gLoop();
