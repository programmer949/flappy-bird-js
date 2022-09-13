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
    sw: parseInt(cs.width),
    sh: parseInt(cs.height),
    birdW: parseInt(45),
    birdH: parseInt(35),
    pipeW: parseInt(60),
    pipeH: parseInt(180),
    groundW: parseInt(cs.width),
};
const birdCords = {
    birdX: parseInt(64),
    birdY: parseInt(0),
};
const gap = 100;
const vrtclSpc = parseInt(size.pipeH + gap);
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
    x: parseInt(size.sw),
    y: parseInt(0),
};
body.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        if (!gOver && gState === 1 && pressed === false) {
            pressed = true;
            sfx.flpSnd.play();
            parseInt((gravity = -4));
            (imgs.bird.src = "./assets/img/bird-2.png"),
                setTimeout(() => {
                    parseInt((gravity = 3));
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
        parseInt((gravity = -4));
        (imgs.bird.src = "./assets/img/bird-2.png"),
            setTimeout(() => {
                parseInt((gravity = 3));
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
        setInterval(() => parseInt((size.groundW = size.sw + 24)), 10);
        setInterval(() => parseInt((size.groundW = size.sw)), 20);
        const birdLeft = parseInt(birdCords.birdX);
        const birdRight = parseInt(birdCords.birdX + size.birdW);
        const birdTop = parseInt(birdCords.birdY);
        const birdBottom = parseInt(birdCords.birdY + size.birdH);
        const pipeLeft = parseInt(pipes[i].x);
        const pipeRight = parseInt(pipes[i].x + size.pipeW);
        const pipeTop = parseInt(pipes[i].y + vrtclSpc);
        const pipeBottom = parseInt(pipes[i].y + size.pipeH);
        if (
            birdRight >= pipeLeft &&
            birdLeft <= pipeRight &&
            (birdTop <= pipeBottom || birdBottom >= pipeTop)
        ) {
            sfx.hitSnd.play();
            gOver = true;
        } else if (birdBottom === parseInt(size.sh - size.sh / 4)) {
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
        cx.drawImage(
            imgs.bgImg,
            0,
            parseInt(size.sh / 2),
            parseInt(size.sw),
            parseInt(size.sh / 2)
        );
        parseInt((birdCords.birdY += gravity));
        for (let i = 0; i < pipes.length; i++) {
            colDetector(i);
            pipes[i].x -= 2;
            if (
                pipes.length &&
                parseInt(pipes[i].x) === parseInt(size.sw / 2)
            ) {
                pipes.push({
                    x: parseInt(size.sw),
                    y: parseInt(
                        Math.floor((Math.random() * size.pipeH) / 2) -
                            size.pipeH / 2
                    ),
                });
                score++;
            } else if (
                i > 0 &&
                pipes.length &&
                parseInt(pipes[i - 1].x === -size.pipeW)
            ) {
                pipes.shift();
            }
        }
        for (let j = 0; j < pipes.length; j++) {
            cx.drawImage(
                imgs.pTop,
                parseInt(pipes[j].x),
                parseInt(pipes[j].y),
                size.pipeW,
                size.pipeH
            );
            cx.drawImage(
                imgs.pBottom,
                parseInt(pipes[j].x),
                parseInt(pipes[j].y + vrtclSpc),
                size.pipeW,
                size.pipeH
            );
        }
        cx.drawImage(
            imgs.bird,
            parseInt(birdCords.birdX),
            parseInt(birdCords.birdY),
            parseInt(size.birdW),
            parseInt(size.birdH)
        );
        cx.drawImage(
            imgs.ground,
            0,
            parseInt(size.sh - size.sh / 4),
            parseInt(size.groundW),
            parseInt(size.sh / 4)
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
        parseInt(size.sh / 2 - 28)
    );
    cx.fillText(
        "\nPress ↑ or click to control the bird,",
        4,
        parseInt(size.sh / 2)
    );
    cx.fillText(
        "\nPress R to restart the game.",
        4,
        parseInt(size.sh / 2 + 28)
    );
}

gLoop();
