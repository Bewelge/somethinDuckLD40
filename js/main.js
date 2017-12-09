var mainCanvas = null;
var ctx = null;
var bgCanvas = null;
var ctxBG = null;
var gameBoard = null;
var hlfSize = 0;
var qrtSize = 0;
var paused = false;
var lastTick = 0;
var ticker = 0;
var doneTicks = 0;
var tickSpeed = 10;
var Player = null;
var muted = false;
var highscore = 0;
var newHighscore = false;
var camX = 0;
var camY = 0;
var gameBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var bgAudio = new Audio("sounds/bgAudio2.mp3");
var quackAudio = new Audio("sounds/quack.mp3");
var quackQuackAudio = new Audio("sounds/quackQuack.mp3");
var eatAudio = new Audio("sounds/eat.mp3");
var snapAudio = new Audio("sounds/snap.mp3");
var burpAudio = new Audio("sounds/Burp.mp3");
var attackAudio = new Audio("sounds/duckAttack.mp3");
var chickEatAudio = new Audio("sounds/chickEat.mp3");
var swallowAudio = new Audio("sounds/swallow.mp3");
var fartAudio = new Audio("sounds/fart.mp3");



var doneTicks = 0;
$(".menuButton").on("mouseenter", function() {
    if (!muted) {

        //quackQuackAudio.play();
    }
})
$(".muteButton").on("click", function() {
    if ($(this).hasClass("disabled")) {
        $(this).removeClass("disabled");
    } else {
        $(this).addClass("disabled");
    }
})

function showInstructions() {
    $('#instructions').css('display', 'block');
}

function showChangelog() {
    $('#changelog').css('display', 'block');
}

function hideInstructions() {
    $('#instructions').css('display', 'none');
}

function hideChangelog() {
    $('#changelog').css('display', 'none');
}

function hideFirstTime() {
    $('#firstTime').css('display', 'none');
}

function showCredits() {
    $('#credits').css('display', 'block');
}

function hideCredits() {
    $('#credits').css('display', 'none');
}

function mainMenu() {
    $("#mainMenu").css("display", "block");
    $("#pauseButton").css("display", "none");
    $("#gameOver").css("display", "none");
}

function restart() {
    paused = false;
    crocodiles = [];
    snakes = [];
    breads = [];
    crumbs = [];
    ducklings = [];
    ducklingOnMap = [];
    totalEaten = 0;
    snakeEaten=0;
    crocEaten=0;
    crocKilled=0;
    raised = 0;
    totalDucklings = 0;
    longestChain = 0;
    player.x = width / 2 - 34;
    player.y = height / 2 - 34;
    player.dir = Math.PI;
    player.path = [];
    dead = false;
    Points = 0;
    bgAudio.playBackRate = 0.7;
    $("#gameOver").css("display", "none");
    $("#pauseButton").css("display", "block");
    $("#HUD").css("display", "block");
    $("#mainMenu").css("display", "none");


}

function start() {
    quackAudio.volume = 0.4;
    quackQuackAudio.volume = 0.4;
    attackAudio.volume = 0.4;
    burpAudio.volume = 0.2;
    bgAudio.playbackRate = 0.7;
    bgAudio.volume = 1;
    snapAudio.volume = 0.5;
    chickEatAudio.volume = 0.1;
    fartAudio.volume = 0.6;
    swallowAudio.volume = 0.25;
    console.log(234);
    dead = true;
    if (window.localStorage.getItem(("highScore"))) {
        highscore = window.localStorage.getItem("highScore");
    }
    if (!window.localStorage.getItem("playedBefore")) {
        $("#firstTime").css("display", "block");
        try {

            window.localStorage.setItem("playedBefore", true);
        } catch (e) {
            console.error(e);
        }
    }
    width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth / 1;
    height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
    width = Math.floor(width);
    height = Math.floor(height);
    $("body").css("width", width);
    $("body").css("height", height);
    hlfSize = Math.floor(Math.min(width, height) / 2);
    qrtSize = Math.floor(hlfSize / 2);

    //snakes.push(new snake(width / 2, height / 2, 0));
    ducklingOnMap.push(new duckling(-64, height/2, -Math.PI));
    window.setTimeout(function() {
        crocodiles.push(new crocodile(-256,height/2, -Math.PI));
        //crocodiles.push(new crocodile(width+256,height/2, 0));
    },1);
    window.setTimeout(function() {
        snakes.push(new snake(width/2, height + 64, 0.5*Math.PI));
    },2900);
    console.log(qrtSize);


    bgCanvas = createCanvas(width,
        height,
        0,
        0,
        "bg",
        "bg",
        0,
        0,
        true);

    $("body").append(bgCanvas);

    document.addEventListener("keydown", keyDownMine);
    document.addEventListener("keyup", keyUpMine);
    mainCanvas = document.getElementById("undefined");
    bgCanvas = document.getElementById("bg");

    ctxBG = bgCanvas.getContext("2d");

    player = new Player(width / 2, height / 2, Math.PI / 2, 100);

    if (!audioMuted) {
        bgAudio.play();
    }

    gameOver("123");
    tick();

}

var symbolSpriteSheet;

function oneSpriteItem(name, x, y, w, h) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function makeJSONLine(oneSprite) {
    let str = '"';
    str += oneSprite.name;
    str += '":';
    str += "			";
    str += "{";
    str += '"' + "x" + '":' + oneSprite.x + ',';
    str += '"' + "y" + '":' + oneSprite.y + ',';
    str += '"' + "w" + '":' + oneSprite.w + ',';
    str += '"' + "h" + '":' + oneSprite.h + '}';
    return str;
}

function makeJSONFile(arr) {
    let str = "{";
    for (let key = 0; key < arr.length; key++) {
        if (key != 0) {
            str += ",";
        }
        str += makeJSONLine(new oneSpriteItem(
            arr[key].getAttribute("name"),
            arr[key].getAttribute("x"),
            arr[key].getAttribute("y"),
            arr[key].getAttribute("width"),
            arr[key].getAttribute("height")
        ));
    }
    str += "}";
    return str;
}
var images = {
    duck: null,
};
var breads = [];

function loadImges() {
    images.duck = new Image();
    images.duck.src = "img/Duck2.png";
    images.duck.onload = function() {
        checkReadImages();

    }
    images.blood = new Image();
    images.blood.src = "img/Blood.png";
    images.blood.onload = function() {
        checkReadImages();

    }
    images.crumb = new Image();
    images.crumb.src = "img/Crumb.png";
    images.crumb.onload = function() {
        checkReadImages();
    }
    images.bow = new Image();
    images.bow.src = "img/Bow.png";
    images.bow.onload = function() {
        checkReadImages();
    }
    images.bread = new Image();
    images.bread.src = "img/Bread.png";
    images.bread.onload = function() {
        checkReadImages();
    }

    for (let i = 0; i <= 7; i++) {
        images["DuckSwim" + i] = new Image();
        images["DuckSwim" + i].src = "img/DuckSwim" + i + ".png";
        images["DuckSwim" + i].onload = function() {
            checkReadImages();
        }
    }
    for (let i = 0; i <= 9; i++) {
        images["DuckIdle" + i] = new Image();
        images["DuckIdle" + i].src = "img/DuckIdle" + i + ".png";
        images["DuckIdle" + i].onload = function() {
            checkReadImages();
        }
    }
    for (let i = 0; i <= 7; i++) {
        images["Crocodile" + i] = new Image();
        images["Crocodile" + i].src = "img/Crocodile" + i + ".png";
        images["Crocodile" + i].onload = function() {
            checkReadImages();
        }
    }
    images["CrocodileDead"] = new Image();
    images["CrocodileDead"].src = "img/CrocodileDead.png";
    images["CrocodileDead"].onload = function() {
        checkReadImages();
    }

    images["SnakeHead"] = new Image();
    images["SnakeHead"].src = "img/SnakeHead.png";
    images["SnakeHead"].onload = function() {
        checkReadImages();
    }
    images["SnakeBody"] = new Image();
    images["SnakeBody"].src = "img/SnakeBody.png";
    images["SnakeBody"].onload = function() {
        checkReadImages();
    }
    images["SnakeBodyRed"] = new Image();
    images["SnakeBodyRed"].src = "img/SnakeBodyRed.png";
    images["SnakeBodyRed"].onload = function() {
        checkReadImages();
    }
    images["SnakeBodyBlack"] = new Image();
    images["SnakeBodyBlack"].src = "img/SnakeBodyBlack.png";
    images["SnakeBodyBlack"].onload = function() {
        checkReadImages();
    }
    images["SnakeBodyWhite"] = new Image();
    images["SnakeBodyWhite"].src = "img/SnakeBodyWhite.png";
    images["SnakeBodyWhite"].onload = function() {
        checkReadImages();
    }

    images.duckling = new Image();
    images.duckling.src = "img/Duckling2.png";
    images.duckling.onload = function() {
        checkReadImages();
    }
    images.duckGirl = new Image();
    images.duckGirl.src = "img/DuckGirl2.png";
    images.duckGirl.onload = function() {
            checkReadImages();
        }
        // images.crocodile = new Image();
        // images.crocodile.src = "img/Crocodile3.png";
        // images.crocodile.onload = function() {
        //     checkReadImages();
        // }
    images.heart = new Image();
    images.heart.src = "img/heart3.png";
    images.heart.onload = function() {
        checkReadImages();
    }

}
loadImges();

function assignSymbolSpriteSheetImages(e) {
    for (let key in e) {
        images[key] = e[key];
    }
    checkReadImages();
}
var imagesToLoad = 38;

function checkReadImages() {
    imagesToLoad--;
    if (!imagesToLoad) {

        start();

    }
}

function tick(restart) {
    var now = window.performance.now(); // current time in ms

    if (restart) {
        $("#mainMenu").css("display", "none");
        $("#gameOver").css("display", "none");
        lastTick = now;
    }
    var deltaTime = now - lastTick; // amount of time elapsed since last tick

    lastTick = now;


    ticker += deltaTime;

    //ticker = Math.min(ticker,tickSpeed);
    doneTicks = 0;

    drawGame();
    while (ticker > tickSpeed) {
        ticker -= tickSpeed;
        doneTicks++;
        if (doneTicks > 100) {
            ticker = 0;

        }
        if (moved) {

            readyToSpawn = true;

            moved = false;

        }

        step();

    }
    if (!paused) {
        theLoop = window.requestAnimationFrame(function() {
            tick(false);
        });
    } else {
        theLoop = null;
    }

}
var crocodiles = [];

function drawGame() {
    ctxBG.clearRect(0, 0, width, height);
    drawBackground();
    drawBg();
    drawPlayerTrail();
    drawBread();
    drawCrumbs();
    drawCrocodiles();
    drawSnakes();
    drawDucklings();
    drawGoingAway();
    drawPlayer();
    drawEnemies();
    drawHeart();
    drawPointIncreases();
    drawMenu();

    drawBlood();
    drawParticles();

}
let bgTick = 1000;
let bgTicker = 1;
let bgGoingBack = false;

function drawBackground() {
    let thicknessStripes = Math.floor(height / 35);
    let amountStripes = Math.floor(height / (thicknessStripes * 2)) + 1;
    ctxBG.lineWidth = thicknessStripes;
    if (!bgGoingBack) {
        bgTicker++;
        if (bgTicker >= bgTick / 2 && !bgGoingBack) {
            bgGoingBack = true;
        }
    } else {
        bgTicker--;
        if (bgTicker <= 0) {
            bgGoingBack = false;
        }
    }

    ctxBG.strokeStyle = "rgba(255,255,255," + (0.02 + bgTicker / 10000) + ")";

    for (let i = -1; i < amountStripes + 1; i++) {
        let curX = -2 * (2 * Math.PI / 0.03);
        let curY = thicknessStripes + i * thicknessStripes * 2 - camY % (2 * thicknessStripes);
        ctxBG.beginPath();
        ctxBG.moveTo(curX, curY)
        while (curX < width + 2 * (2 * Math.PI / 0.03)) {
            curX += 10;

            ctxBG.lineTo(curX - camX % ((2 * Math.PI / 0.03)), bgTicker / 300 * Math.sin(0.03 * curX) * 15 + curY);
        }
        ctxBG.stroke();

    }

}
var drawHitBoxes = false;

function drawCrumbs() {
    for (let key in crumbs) {
        crumbs[key].dir += 0.02;

        ctxBG.save();
        ctxBG.translate(crumbs[key].x, crumbs[key].y);
        ctxBG.rotate(crumbs[key].dir - Math.PI * 0.5);
        ctxBG.drawImage(images.crumb, 0, 0, 128, 128, 0 - 32, 0 - 32, 64, 64);
        ctxBG.restore();

        if (drawHitBoxes) {
            ctxBG.fillStyle = "rgba(255,255,255,0.4)";
            ctxBG.beginPath();
            ctxBG.moveTo(crumbs[key].x, crumbs[key].y);
            ctxBG.arc(crumbs[key].x, crumbs[key].y, 10, 0, Math.PI * 2, 0);
            ctxBG.fill();

        }
    }
}

function drawBread() {
    for (let key in breads) {
        breads[key].dir += breads[key].rotSpeed;

        ctxBG.save();
        ctxBG.translate(breads[key].x, breads[key].y);
        ctxBG.rotate(breads[key].dir - Math.PI * 0.5);
        ctxBG.drawImage(images.bread, 0, 0, 128, 128, 0 - 16, 0 - 16, 32, 32);
        ctxBG.restore();

        if (drawHitBoxes) {
            ctxBG.fillStyle = "rgba(255,255,255,0.4)";
            ctxBG.beginPath();
            ctxBG.moveTo(breads[key].x, breads[key].y);
            ctxBG.arc(breads[key].x, breads[key].y, 12, 0, Math.PI * 2, 0);
            ctxBG.fill();

        }
    }
}

function getMult() {
    return Math.ceil(ducklings.length * ducklings.length * 0.2);
}
var camMov = [];
var totalDucklings = 0;
var longestChain = 0;
var lastChicks = 0;
var curFontSize = 25;
var curBlue = 255;
var curGreen = 255;
var curRed = 255;

function drawMap() {
    let xOrig = 125;
    let yOrig = height - 125;
    let scale = 200 / 10000;
    ctxBG.fillStyle = "rgba(0,0,0,0.5)";
    ctxBG.fillRect(xOrig - 5 - scale * 5000, yOrig - 5 - scale * 5000, 10 + scale * 10000, 10 + scale * 10000);



    let tmpCamX = 0;
    let tmpCamY = 0;
    let sw2 = 0; //scale*width/2;
    let sh2 = 0; //scale*height/2;
    ctxBG.save();
    ctxBG.rect(xOrig + (scale * tmpCamX) - sw2, yOrig + (scale * tmpCamY) - sh2, width * scale, height * scale)
        //ctxBG.clip()
    for (let key in camMov) {
        if (camMov[key][0] == "x") {
            tmpCamX -= camMov[key][1];
        } else {
            tmpCamY -= camMov[key][1];
        }
        ctxBG.rect(xOrig + (scale * tmpCamX) - sw2, yOrig + (scale * tmpCamY) - sh2, width * scale, height * scale);
    }
    ctxBG.clip();
    ctxBG.fillStyle = "rgba(255,255,255,0.5)";
    ctxBG.fillRect(xOrig - scale * 5000, yOrig - scale * 5000, scale * 10000, scale * 10000);
    for (let loc in locations) {
        ctxBG.fillStyle = locations[loc].mapColor;
        ctxBG.fillRect(
            xOrig + scale * locations[loc].pos.x[0],
            yOrig + scale * locations[loc].pos.y[0],
            (locations[loc].pos.x[1] - locations[loc].pos.x[0]) * scale,
            (locations[loc].pos.y[1] - locations[loc].pos.y[0]) * scale)
    }

    ctxBG.fillStyle = "rgba(0,0,0,0.8)";
    ctxBG.beginPath();
    ctxBG.arc(xOrig + (player.x + camX) * scale - sw2, yOrig + (camY + player.y) * scale - sh2, 5, 0, Math.PI * 2, 0);
    ctxBG.closePath();
    ctxBG.fill();
    ctxBG.lineWidth = 2;
    ctxBG.strokeStyle = "rgba(0,0,0,1)";
    ctxBG.strokeRect(xOrig + (scale * camX) - sw2, yOrig + (scale * camY) - sh2, width * scale, height * scale);
    ctxBG.restore();
}
var mapHidden = false;

function drawMenu() {
    if (!mapHidden) {
        //  drawMap();
    }
    if (dead) {
        return;
    }
    ctxBG.font = "25px 'Ranchers', cursive";
    ctxBG.fillStyle = "rgba(" + curRed + "," + curGreen + "," + curBlue + ",0.8)";
    if (lastChicks < ducklings.length) {
        curRed = 0;
        curBlue = 0;
        curGreen = 255;
        lastChicks = ducklings.length;
        ctxBG.font = "50px 'Ranchers', cursive";
        curFontSize = 50;
    } else if (lastChicks > ducklings.length) {
        curGreen = 0;
        curBlue = 0;
        curRed = 255;
        lastChicks = ducklings.length;
        ctxBG.font = "5px 'Ranchers', cursive";
        curFontSize = 5;
    } else {
        if (curBlue < 255) {
            curBlue += 5;
        }
        if (curRed < 255) {
            curRed += 5;
        }
        if (curGreen < 255) {
            curGreen += 5;
        }

        ctxBG.font = Math.max(25, curFontSize - 1) + "px 'Ranchers', cursive";
        if (curFontSize > 25) {
            curFontSize--;
        } else if (curFontSize < 25) {
            curFontSize += 0.2;
        }
    }

    if (ducklings.length == 1) {
        ctxBG.fillText(ducklings.length + " Duckling!", 100, 100);
    } else {
        ctxBG.fillText(ducklings.length + " Ducklings!", 100, 100);
        if (getMult() > 1) {
            ctxBG.font = "15px 'Ranchers', cursive";
            ctxBG.fillText("(" + "x" + (getMult() + 1) + " Bonus)", 100, 100 + curFontSize);
        }
    }
    if (raised > 0) {
        ctxBG.fillStyle = "rgba(255,255,255,0.8)";
        ctxBG.font = "25px 'Ranchers', cursive";
        ctxBG.fillText(raised + " Ducklings Raised!", width / 2 - 50, 100);
    }
    if (lastPoints > Points) {
        if (lastPoints - Points > 10000000) {
            lastPoints -= 10000000;
        } else if (lastPoints - Points > 1000000) {
            lastPoints -= 1000000;
        } else if (lastPoints - Points > 100000) {
            lastPoints -= 100000;
        } else if (lastPoints - Points > 10000) {
            lastPoints -= 10000;
        } else if (lastPoints - Points > 1000) {
            lastPoints -= 1000;
        } else if (lastPoints - Points > 100) {
            lastPoints -= 100;
        } else if (lastPoints - Points > 10) {
            lastPoints -= 10;
        } else {
            lastPoints--;
        }
        curFontSize = 10;
    } else if (lastPoints < Points) {
        if (Points - lastPoints > 10000000) {
            lastPoints += 10000000;
        } else if (Points - lastPoints > 1000000) {
            lastPoints += 1000000;
        } else if (lastPoints - Points > 100000) {
            lastPoints += 100000;
        } else if (Points - lastPoints > 10000) {
            lastPoints += 10000;
        } else if (lastPoints - Points > 1000) {
            lastPoints += 1000;
        } else if (Points - lastPoints > 100) {
            lastPoints += 100;
        } else if (lastPoints - Points > 10) {
            lastPoints += 10;
        } else {
            lastPoints++;
        }
        curFontSize = 50;
    } else {
        if (curFontSize < 25) {
            curFontSize += 0.2;
        } else if (curFontSize > 25) {
            curFontSize -= 0.2;
        }
        if (Math.abs(curFontSize - 25) < 0.3) {
            curFontSize = 25;
        }

    }
    ctxBG.font = 25 + "px 'Ranchers', cursive";
    ctxBG.fillStyle = "rgba(255,255,255,0.8)";

    ctxBG.fillText("Points: " + lastPoints, width - 150, 100);

    if (breadEaten > 0) {
        let tx = "Stomach: " + breadEaten + " / " + stomachSize + " Toast";
        let wd = ctxBG.measureText(tx).width;
        ctxBG.fillText(tx, width / 2 - wd / 2, height - 100);
        let tx2 = "Press 'Space' to Feed!";
        let wd2 = ctxBG.measureText(tx2).width;
        ctxBG.fillText(tx2, width / 2 - wd2 / 2, height - 50);
    } else if (emptyStomach > 0) {
        emptyStomach--;
        let tx = "Stomach is Empty!";
        let wd = ctxBG.measureText(tx).width;
        ctxBG.fillText(tx, width / 2 - wd / 2, height - 100);
    }

}
var paused = false;
var breadEaten = 0;
var stomachSize = 5;
var emptyStomach = 0;

function pause() {
    if (paused) {
        paused = false;
        lastTick = 0;
        ticker = 0;
        tick(true);
    } else {
        paused = true;

    }
}

function drawBg() {

}
var playerAnimationTick = 0;

function drawPlayerTrail() {
    if (player.path.length == 0) {
        return
    }
    ctxBG.strokeStyle = "rgba(255,255,255,0.2)";
    ctxBG.lineWidth = "17";
    ctxBG.fillStyle = "rgba(255,255,255,0.4)";
    let curX = player.x;
    let curY = player.y;

    if (player.path.length > 1) {


        ctxBG.beginPath();
        //ctxBG.shadowBlur=15;
        //ctxBG.shadowColor="rgba(0,0,250,1)";
        //ctxBG.shadowOffsetY=15;
        //ctxBG.shadowOffsetX=15;
        ctxBG.moveTo(curX, curY);
        ctxBG.lineTo(
            curX + Math.cos(player.dir) * 8,
            curY + Math.sin(player.dir) * 8);

        for (let key = player.path.length - 1; key > 1; key--) {
            player.path[key][4] += 0.05;
            ctxBG.strokeStyle = "rgba(255,255,255," + player.path[key][2] / 2500 + ")";
            let cx = (player.path[key][0] + Math.cos(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]) + player.path[key - 1][0] + Math.cos(player.path[key - 1][3] - Math.PI * 0.5) * 10 * (player.path[key][4])) / 2;

            let cy = (player.path[key][1] + Math.sin(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]) + player.path[key - 1][1] + Math.sin(player.path[key - 1][3] - Math.PI * 0.5) * 10 * (player.path[key][4])) / 2;

            ctxBG.quadraticCurveTo(
                player.path[key][0] + Math.cos(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]),
                player.path[key][1] + Math.sin(player.path[key][3] - Math.PI * 0.5) * 10 * (player.path[key][4]),
                cx, cy);
            ctxBG.stroke();
        }

        ctxBG.strokeStyle = "rgba(255,255,255," + player.path[0][2] / 2500 + ")";

        ctxBG.quadraticCurveTo(
            player.path[1][0] + Math.cos(player.path[1][3] - Math.PI * 0.5) * 10 * (player.path[1][4]),
            player.path[1][1] + Math.sin(player.path[1][3] - Math.PI * 0.5) * 10 * (player.path[1][4]),
            player.path[0][0] + Math.cos(player.path[0][3] - Math.PI * 0.5) * 10 * (player.path[0][4]),
            player.path[0][1] + Math.sin(player.path[0][3] - Math.PI * 0.5) * 10 * (player.path[0][4]));

        ctxBG.stroke();



        ctxBG.beginPath();
        //ctxBG.shadowBlur=15;
        //ctxBG.shadowColor="rgba(0,0,250,1)";
        //ctxBG.shadowOffsetY=15;
        //ctxBG.shadowOffsetX=15;
        ctxBG.moveTo(curX, curY);
        ctxBG.lineTo(
            curX + Math.cos(player.dir) * 8,
            curY + Math.sin(player.dir) * 8);

        for (let key = player.path.length - 1; key > 1; key--) {
            player.path[key][4] += 0.05;
            ctxBG.strokeStyle = "rgba(255,255,255," + player.path[key][2] / 2500 + ")";
            let cx = (player.path[key][0] + Math.cos(player.path[key][3] + Math.PI * 0.5) * 10 * (player.path[key][4]) + player.path[key - 1][0] + Math.cos(player.path[key - 1][3] + Math.PI * 0.5) * 10 * (player.path[key][4])) / 2;

            let cy = (player.path[key][1] + Math.sin(player.path[key][3] + Math.PI * 0.5) * 10 * (player.path[key][4]) + player.path[key - 1][1] + Math.sin(player.path[key - 1][3] + Math.PI * 0.5) * 10 * (player.path[key][4])) / 2;

            ctxBG.quadraticCurveTo(
                player.path[key][0] + Math.cos(player.path[key][3] + Math.PI * 0.5) * 10 * (player.path[key][4]),
                player.path[key][1] + Math.sin(player.path[key][3] + Math.PI * 0.5) * 10 * (player.path[key][4]),
                cx, cy);
            ctxBG.stroke();
        }

        ctxBG.strokeStyle = "rgba(255,255,255," + player.path[0][2] / 2500 + ")";

        ctxBG.quadraticCurveTo(
            player.path[1][0] + Math.cos(player.path[1][3] + Math.PI * 0.5) * 10 * (player.path[1][4]),
            player.path[1][1] + Math.sin(player.path[1][3] + Math.PI * 0.5) * 10 * (player.path[1][4]),
            player.path[0][0] + Math.cos(player.path[0][3] + Math.PI * 0.5) * 10 * (player.path[0][4]),
            player.path[0][1] + Math.sin(player.path[0][3] + Math.PI * 0.5) * 10 * (player.path[0][4]));

        ctxBG.stroke();


    }
}

function drawPlayer() {
    if (dead) {
        return;
    }

    //    ctxBG.lineCap = 'round';

    let im;
    playerAnimationTick++;
    if (playerAnimationTick > 5 - Math.max(0, Math.log(ducklings.length))) {
        playerAnimationTick = 0;
        player.animation++;
    }
    if (player.accX != 0 || player.accY != 0 || upClicked || downClicked) {
        im = images["DuckSwim" + (player.animation % 8)];
    } else {
        im = images["DuckIdle" + (player.animation % 10)]
    }
    ctxBG.save();
    ctxBG.translate(player.x, player.y);
    ctxBG.rotate(player.dir - Math.PI * 0.5);
    ctxBG.drawImage(im, 0, 0, 128, 128, 0 - 32, 0 - 32 - (player.attack % 10) * 2, 64, 64);
    ctxBG.restore();

    if (drawHitBoxes) {
        ctxBG.fillStyle = "rgba(255,155,155,0.4)";
        ctxBG.beginPath();
        ctxBG.moveTo(player.x - Math.cos(player.dir) * 0, player.y - Math.sin(player.dir) * 0);
        ctxBG.arc(player.x - Math.cos(player.dir) * 0, player.y - Math.sin(player.dir) * 0, 16, 0, Math.PI * 2, 0);
        ctxBG.closePath();
        ctxBG.fill();

        ctxBG.fillStyle = "rgba(255,255,255,0.4)";
        ctxBG.beginPath();
        ctxBG.moveTo(player.x - Math.cos(player.dir) * 20, player.y - Math.sin(player.dir) * 20);
        ctxBG.arc(player.x - Math.cos(player.dir) * 20, player.y - Math.sin(player.dir) * 20, 8, 0, Math.PI * 2, 0);
        ctxBG.closePath();
        ctxBG.fill();
    }
}
var ducklings = [];
var snakes = [];
var snakeAnimTicker = 0;
var snakeAnimTick = 1;
var resetSnakeAnim = false;

function drawSnakes() {
    snakeAnimTicker++;
    for (let key in snakes) {
        /*if (snakes[key].eaten) {
            snakes[key].eaten = false;
            snakes[key].animation = 1;
        }*/
        /*if (snakes[key].animation >= 1) {
            snakes[key].animation++
        }
        if (snakes[key].animation > 7) {
            snakes[key].animation = 0;
        }*/
        ctxBG.save();
        ctxBG.translate(snakes[key].x, snakes[key].y);
        ctxBG.rotate(snakes[key].dir - Math.PI * 0.5);
        let tmpSiz = 1;
        if (snakes[key].eaten[0] > 0 || snakes[key].eaten[1] > 0) {
            tmpSiz = Math.max(snakes[key].eaten[1],snakes[key].eaten[0]) / 10 + 1;
        }
        ctxBG.drawImage(images["SnakeHead"], 0, 0, 128, 128, -24 * tmpSiz, -24 * tmpSiz, 48 * tmpSiz, 48 * tmpSiz);

        if (snakeAnimTicker > snakeAnimTick) {
            resetSnakeAnim = true;
            if (snakes[key].animDir > 0) {
                if (snakes[key].animDir2 > 0) {
                    //console.log("c");
                    snakes[key].animation = (snakes[key].animation - 3);
                    if (snakes[key].animation <= 0) {
                        snakes[key].animation = 0;
                        snakes[key].animDir2 = -1;
                    }

                } else {
                    //console.log("d");
                    snakes[key].animation = (snakes[key].animation + 3);
                    if (snakes[key].animation >= 20) {
                        snakes[key].animation = 20;
                        snakes[key].animDir2 = -1;
                        snakes[key].animDir = -1;
                    }
                }
            } else {
                if (snakes[key].animDir2 < 0) {
                    //console.log("a");
                    snakes[key].animation = (snakes[key].animation - 3);
                    if (snakes[key].animation <= 0) {
                        snakes[key].animation = 0;
                        snakes[key].animDir2 = 1;
                    }

                } else {
                    //console.log("b");
                    snakes[key].animation = (snakes[key].animation + 3);
                    if (snakes[key].animation >= 20) {
                        snakes[key].animation = 20;
                        snakes[key].animDir2 = 1;
                        snakes[key].animDir = 1;
                        //  snakes[key].animDir = -1;
                    }
                }

            }
        }
        ctxBG.translate(0, 7);
        //console.log(snakes[0].animation);
        for (let i = Math.PI * 0.2; i < 15 + Math.PI * 0.2; i += 1) {
            let img = "SnakeBody";
            if (Math.floor(i % 8 - Math.PI * 0.2) % 3 == 0 && Math.floor(i % 8 - Math.PI * 0.2) % 4 != 0 && Math.floor(i % 8 - Math.PI * 0.2) % 5 != 0 && Math.floor(i % 8 - Math.PI * 0.2) % 6 != 0) {
                img += "Black";
            } else if (Math.floor(i % 8 - Math.PI * 0.2) % 4 == 0 && Math.floor(i % 8 - Math.PI * 0.2) % 5 != 0) {
                img += "White";
            } else if (Math.floor(i % 8 - Math.PI * 0.2) % 5 == 0) {
                img += "Black";
            } else {
                img += "Red";
            }
            if (snakes[key].animDir) {

            }
            let siz;
            // if (i < 3) {
            //    siz = 0.5;
            // } else {

            siz = snakes[key].eaten[Math.floor(i)] * 0.05 -i*0.01+ 0.75 / Math.sqrt(Math.max(1, Math.sqrt(Math.abs(i -3))));
            //}
            //ctxBG.rotate(((2-(1+(i%4)))) * 0.1);
            //ctxBG.rotate(((i - 2 * i * Math.floor(i/4)+ 4 * i * Math.floor(i/8))%4) * 0.2 * Math.min(2,2*Math.floor(i/2)));
            ctxBG.rotate(snakes[key].animDir * (Math.abs(20 - snakes[key].animation)) / 20 * Math.sin(0.4 * Math.PI * i));
            ctxBG.translate(0, 64 * siz / 3);
            ctxBG.drawImage(images[img], 0, 0, 128, 128, -32 * siz, -32 * siz, 64 * siz, 64 * siz);


            ctxBG.rotate(snakes[key].animDir * (-1) * ((Math.abs(20 - snakes[key].animation)) / 20 * Math.sin(0.4 * Math.PI * i)));
        }
        ctxBG.restore();


        if (drawHitBoxes) {
            ctxBG.fillStyle = "rgba(255,155,155,0.6)";
            ctxBG.beginPath();
            ctxBG.moveTo(snakes[key].x - Math.cos(snakes[key].dir) * 0, snakes[key].y - Math.sin(snakes[key].dir) * 0);
            ctxBG.arc(snakes[key].x - Math.cos(snakes[key].dir) * 0, snakes[key].y - Math.sin(snakes[key].dir) * 0, 14, 0, Math.PI * 2, 0);
            ctxBG.closePath();
            ctxBG.fill();
        }
        for (let eat = 0; eat <= snakes[key].eaten.length - 1; eat++) {
            if (snakes[key].eaten[eat] > 0) {
                let am = Math.min(snakes[key].eaten[eat], 1 + eat );
                snakes[key].eaten[eat] -= am;
                if (eat < snakes[key].eaten.length - 1) {
                    snakes[key].eaten[eat + 1] += am;
                }
                break;
            }

        }
    }
    if (resetSnakeAnim) {
        resetSnakeAnim = false;
        snakeAnimTicker = 0;
    }
}
var snakeEatenCounter = 0;

function veryCoolSwirl() {
    for (let key in snakes) {
        /*if (snakes[key].eaten) {
            snakes[key].eaten = false;
            snakes[key].animation = 1;
        }*/
        /*if (snakes[key].animation >= 1) {
            snakes[key].animation++
        }
        if (snakes[key].animation > 7) {
            snakes[key].animation = 0;
        }*/
        ctxBG.save();
        ctxBG.translate(snakes[key].x, snakes[key].y);
        ctxBG.rotate(snakes[key].dir - Math.PI * 0.5);
        ctxBG.drawImage(images["SnakeHead"], 0, 0, 128, 128, -32, -32, 64, 64);
        snakeAnimTicker++;
        if (snakeAnimTicker > snakeAnimTick) {
            resetSnakeAnim = true;
            snakes[key].animation = (snakes[key].animation + 0.1 * Math.PI);
        }
        for (let i = snakes[key].animation + Math.PI; i < snakes[key].animation + 8 * Math.PI; i += 1) {
            if (snakes[key].animDir) {

            }
            //ctxBG.rotate(((2-(1+(i%4)))) * 0.1);
            //ctxBG.rotate(((i - 2 * i * Math.floor(i/4)+ 4 * i * Math.floor(i/8))%4) * 0.2 * Math.min(2,2*Math.floor(i/2)));
            ctxBG.translate(0, 24);
            ctxBG.rotate(1 * Math.sin(0.1 * Math.PI * (i)));
            ctxBG.drawImage(images["SnakeBody"], 0, 0, 128, 128, -32, -32, 64, 64);
        }
        ctxBG.restore();


        if (drawHitBoxes) {
            ctxBG.fillStyle = "rgba(255,155,155,0.4)";
            ctxBG.beginPath();
            ctxBG.moveTo(snakes[key].x - Math.cos(snakes[key].dir) * 14, snakes[key].y - Math.sin(snakes[key].dir) * 14);
            ctxBG.arc(snakes[key].x - Math.cos(snakes[key].dir) * 14, snakes[key].y - Math.sin(snakes[key].dir) * 14, 16, 0, Math.PI * 2, 0);
            ctxBG.closePath();
            ctxBG.fill();
        }
    }
    if (resetSnakeAnim) {
        resetSnakeAnim = false;
        snakeAnimTicker = 0;
    }
}

function drawCrocodiles() {
    for (let key in crocodiles) {
        if (crocodiles[key].eaten) {
            crocodiles[key].eaten = false;
            crocodiles[key].animation = 1;
        }
        if (crocodiles[key].animation >= 1) {
            crocodiles[key].animation++
        }
        if (crocodiles[key].animation > 7) {
            crocodiles[key].animation = 0;
        }
        let img = images["Crocodile" + crocodiles[key].animation];
        if (crocodiles[key].dead) {
            img = images["CrocodileDead"];
        }
        ctxBG.save();
        ctxBG.translate(crocodiles[key].x, crocodiles[key].y);
        ctxBG.rotate(crocodiles[key].dir - Math.PI * 0.5);
        ctxBG.drawImage(img, 0, 0, 128, 512, -32, -32, 64, 256);
        ctxBG.restore();


        if (drawHitBoxes) {
            ctxBG.fillStyle = "rgba(255,155,155,0.6)";
            ctxBG.beginPath();
            ctxBG.moveTo(crocodiles[key].x - Math.cos(crocodiles[key].dir) * 14, crocodiles[key].y - Math.sin(crocodiles[key].dir) * 14);
            ctxBG.arc(crocodiles[key].x - Math.cos(crocodiles[key].dir) * 14, crocodiles[key].y - Math.sin(crocodiles[key].dir) * 14, 16, 0, Math.PI * 2, 0);
            ctxBG.closePath();
            ctxBG.fill();

            ctxBG.fillStyle = "rgba(255,255,255,0.4)";
            ctxBG.beginPath();
            ctxBG.moveTo(crocodiles[key].x + Math.cos(crocodiles[key].dir) * 7, crocodiles[key].y + Math.sin(crocodiles[key].dir) * 7);
            ctxBG.arc(crocodiles[key].x + Math.cos(crocodiles[key].dir) * 7, crocodiles[key].y + Math.sin(crocodiles[key].dir) * 7, 20, 0, Math.PI * 2, 0);
            ctxBG.closePath();
            ctxBG.fill();
        }
    }
}
var goingAway = [];

function moveGoingAway() {
    for (let key = goingAway.length - 1; key >= 0; key--) {
        goingAway[key].x -= 5 * Math.cos(goingAway[key].dir);
        goingAway[key].y -= 5 * Math.sin(goingAway[key].dir);
        if (goingAway[key].x > width + 64 || goingAway[key].x < -64 || goingAway[key].y > height + 64 || goingAway[key].y < -64) {
            goingAway.splice(key, 1);
            continue;
        }
        crocLoop:
            for (let croc in crocodiles) {
                if (Distance(goingAway[key].x, goingAway[key].y, crocodiles[croc].x - Math.cos(crocodiles[croc].dir) * 14, crocodiles[croc].y - Math.sin(crocodiles[croc].dir) * 14) < 32) {
                    goingAway.splice(key, 1);
                    if (!audioMuted) {
                        snapAudio.pause();
                        snapAudio.currentTime = 0;
                        snapAudio.play();
                    }
                    crocodiles[croc].eaten = true;
                    break crocLoop;
                }

            }
    }
}

function drawGoingAway() {
    for (let key in goingAway) {
        ctxBG.save();
        ctxBG.translate(goingAway[key].x, goingAway[key].y);
        ctxBG.rotate(goingAway[key].dir - Math.PI * 0.5);
        ctxBG.drawImage(images.DuckSwim0, 0, 0, 128, 128, -32, -32, 64, 64);
        ctxBG.restore();
    }
}

function drawDucklings() {
    if (ducklingOnMap.length > 0) {
        for (let duck = ducklingOnMap.length - 1; duck >= 0; duck--) {
            ctxBG.save();
            ctxBG.translate(ducklingOnMap[duck].x, ducklingOnMap[duck].y);
            ctxBG.rotate(ducklingOnMap[duck].dir - Math.PI * 0.5);
            ctxBG.drawImage(images["DuckSwim" + ducklingOnMap[duck].animation], 0, 0, 128, 128, -32, -32, 64, 64);
            //ctxBG.drawImage(images["bow"],0,0,128,128,-32,-32,64,64);
            ctxBG.restore();

            if (drawHitBoxes) {
                ctxBG.fillStyle = "rgba(255,155,155,0.4)";
                ctxBG.beginPath();
                ctxBG.moveTo(ducklingOnMap[duck].x - Math.cos(ducklingOnMap[duck].dir) * 0, ducklingOnMap[duck].y - Math.sin(ducklingOnMap[duck].dir) * 0);
                ctxBG.arc(ducklingOnMap[duck].x - Math.cos(ducklingOnMap[duck].dir) * 0, ducklingOnMap[duck].y - Math.sin(ducklingOnMap[duck].dir) * 0, 16, 0, Math.PI * 2, 0);
                ctxBG.closePath();
                ctxBG.fill();

                ctxBG.fillStyle = "rgba(255,255,255,0.4)";
                ctxBG.beginPath();
                ctxBG.moveTo(ducklingOnMap[duck].x - Math.cos(ducklingOnMap[duck].dir) * 22, ducklingOnMap[duck].y - Math.sin(ducklingOnMap[duck].dir) * 22);
                ctxBG.arc(ducklingOnMap[duck].x - Math.cos(ducklingOnMap[duck].dir) * 22, ducklingOnMap[duck].y - Math.sin(ducklingOnMap[duck].dir) * 22, 8, 0, Math.PI * 2, 0);
                ctxBG.closePath();
                ctxBG.fill();
            }

        }

    }
    for (let key in ducklings) {
        ctxBG.save();
        ctxBG.translate(ducklings[key].x, ducklings[key].y);
        ctxBG.rotate(ducklings[key].dir - Math.PI * 0.5);
        let growthMult = 48 * ducklings[key].growth / 100;
        ctxBG.drawImage(images.duckling, 0, 0, 128, 128, -24 - growthMult / 2, -24 - growthMult / 2, 48 + growthMult, 48 + growthMult);
        ctxBG.restore();

        if (drawHitBoxes) {
            ctxBG.fillStyle = "rgba(255,255,255,0.4)";
            ctxBG.beginPath();
            ctxBG.moveTo(ducklings[key].x, ducklings[key].y);
            ctxBG.arc(ducklings[key].x, ducklings[key].y, 8 + growthMult / 4, 0, Math.PI * 2, 0);
            ctxBG.closePath();
            ctxBG.fill();
        }
    }
}
var ducklingOnMap = [];

function spawnDuckling() {
    let tmpX = Math.random() * width;
    let tmpY = Math.random() * height;
    if (lastXDuckling != 0) {
        tmpX = lastXDuckling;
        lastXDuckling = 0;
    }
    if (lastYDuckling != 0) {
        tmpY = lastYDuckling;
        lastYDuckling = 0;
    }
    ducklingOnMap = (new duckling(tmpX, tmpY, Math.random() * Math.PI));
}

function spawnDuckGirl() {
    let x, y, dir;
    if (Math.random() > 0.5) {
        if (Math.random() > 0.5) {
            x = -64;
            y = Math.random() * height;
            if (lastXDuckling != 0) {
                x = lastXDuckling;
                y = Math.max(-64, Math.min(width + 64, x));
                lastXDuckling = 0;
            }
            if (lastYDuckling != 0) {
                y = lastYDuckling;
                y = Math.max(-64, Math.min(width + 64, y));
                lastYDuckling = 0;
            }
            if (Math.random() > 0.5) {
                dir = Math.PI * 0.75 + Math.random() * (0.25 * Math.PI);
            } else {
                dir = Math.PI * (-0.75) - Math.random() * 0.25 * Math.PI;
            }
        } else {
            x = width + 64
            y = Math.random() * height;
            if (lastXDuckling != 0) {
                x = lastXDuckling;
                y = Math.max(-64, Math.min(width + 64, x));
                lastXDuckling = 0;
            }
            if (lastYDuckling != 0) {
                y = lastYDuckling;
                y = Math.max(-64, Math.min(width + 64, y));
                lastYDuckling = 0;
            }
            dir = Math.random() * (0.25 * Math.PI) - Math.random() * 0.25 * Math.PI;
        }
    } else {
        if (Math.random() > 0.5) {
            x = Math.random() * width;
            y = -64;
            if (lastXDuckling != 0) {
                x = lastXDuckling;
                y = Math.max(-64, Math.min(width + 64, x));
                lastXDuckling = 0;
            }
            if (lastYDuckling != 0) {
                y = lastYDuckling;
                y = Math.max(-64, Math.min(width + 64, y));
                lastYDuckling = 0;
            }
            dir = Math.random() * (-Math.PI);
        } else {
            x = Math.random() * width;
            y = height + 64;
            if (lastXDuckling != 0) {
                x = lastXDuckling;
                y = Math.max(-64, Math.min(width + 64, x));
                lastXDuckling = 0;
            }
            if (lastYDuckling != 0) {
                y = lastYDuckling;
                y = Math.max(-64, Math.min(width + 64, y));
                lastYDuckling = 0;
            }
            dir = Math.PI * 0.25 + 0.5 * Math.random() * (Math.PI);

        }
    }
    ducklingOnMap.push(new duckling(x, y, dir));

}

function spawnSnake() {
    let x, y, dir;
    if (Math.random() > 0.5) {
        if (Math.random() > 0.5) {
            x = -64;
            y = Math.random() * height;
            if (Math.random() > 0.5) {
                dir = Math.PI * 0.5 + Math.random() * (0.5 * Math.PI);
            } else {
                dir = Math.PI * (-0.5) - Math.random() * 0.5 * Math.PI;
            }
        } else {
            x = width + 64
            y = Math.random() * height;
            dir = Math.random() * (0.5 * Math.PI) - Math.random() * 0.5 * Math.PI;
        }
    } else {
        if (Math.random() > 0.5) {
            x = Math.random() * width;
            y = -64;
            dir = Math.random() * (-Math.PI);
        } else {
            x = Math.random() * width;
            y = height + 64;
            dir = Math.random() * (Math.PI);

        }
    }
    if (snakes.length < 10) {

        snakes.push(new snake(x, y, dir));
    }
}
var locations = {
    SafeHaven: {
        name: "Safe Haven",
        mapColor: "rgba(55,255,55,0.4)",
        pos: {
            x: [-1000, 1000],
            y: [-1000, 1000],
        }
    },
    Snakepit: {
        name: "Snake Pit",
        mapColor: "rgba(255,55,55,0.4)",
        pos: {
            x: [1500, 4000],
            y: [1500, 4000],
        }
    },
    CrocWaters: {
        name: "Croc Waters",
        mapColor: "rgba(155,55,55,0.4)",
        pos: {
            x: [-4000, -1500],
            y: [1500, 4000],
        }
    },

}

function spawnCrocodile() {
    let x, y, dir;
    if (Math.random() > 0.5) {
        if (Math.random() > 0.5) {
            x = -64;
            y = Math.random() * height;
            if (Math.random() > 0.5) {
                dir = Math.PI * 0.5 + Math.random() * (0.5 * Math.PI);
            } else {
                dir = Math.PI * (-0.5) - Math.random() * 0.5 * Math.PI;
            }
        } else {
            x = width + 64
            y = Math.random() * height;
            dir = Math.random() * (0.5 * Math.PI) - Math.random() * 0.5 * Math.PI;
        }
    } else {
        if (Math.random() > 0.5) {
            x = Math.random() * width;
            y = -64;
            dir = Math.random() * (-Math.PI);
        } else {
            x = Math.random() * width;
            y = height + 64;
            dir = Math.random() * (Math.PI);

        }
    }

    crocodiles.push(new crocodile(x, y, dir));
}
var bread = function(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.growth = 0;
    this.animation = 0;
    this.rotSpeed = Math.random() * 0.02 - Math.random() * 0.02;
}
var duckling = function(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.growth = 0;
    this.animation = 0;
    this.target = null;
}
var crocodile = function(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.animation = 0;
    this.eaten = false;
    this.dead = false;
}
var snake = function(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.speed = 1 + Math.random();
    this.animation = 50;
    this.eaten = [0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ];
    this.animDir = -1;
    this.animDir2 = -1;
}

function drawEnemies() {

}

function collides(obj1, size1, obj2, size2) {
    if (Distance(obj1.x, obj1.y, obj2.x, obj2.y) < (size1 + size2) / 2) {
        return true;
    }
    return false;
}
var Player = function(x, y, dir, health) {
    this.attack = 0;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.health = health;
    this.path = [];
    this.accX = 0;
    this.accY = 0;
    this.rotAcc = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.animation = 0;
}

function step() {
    movePlayer();
    moveGoingAway();
    moveDucklings();
    moveCrocodiles();
    moveSnakes();
    moveEnemies(); //
    moveCrumbs();
    updateGame(); //check death, check pikcups,
}

function findSideToTurn(ang1, ang2) {


    let dif = ang1 - ang2;
    if (dif < 0) {
        dif += Math.PI * 2;
    }
    if (dif > Math.PI) {

        return -1;
    } else {

        return 1;
    }

}

function moveSnakes() {
    for (let key = snakes.length - 1; key >= 0; key--) {
        // turnTowards(snakes[key], player, 0.002);

        snakes[key].x -= snakes[key].speed * 1.3 * Math.cos(snakes[key].dir);
        snakes[key].y -= snakes[key].speed * 1.3 * Math.sin(snakes[key].dir);
        if (snakes[key].x > width + 256) {
            snakes.splice(key, 1);
        } else if (snakes[key].x < -256) {
            snakes.splice(key, 1);
        } else if (snakes[key].y > height + 256) {
            snakes.splice(key, 1);
        } else if (snakes[key].y < -256) {
            snakes.splice(key, 1);
        }
    }
}

function moveCrocodiles() {
    for (let key = crocodiles.length - 1; key >= 0; key--) {
        if (crocodiles[key].dead) {
            crocodiles[key].x -= 2.8 * Math.cos(crocodiles[key].dir);
            crocodiles[key].y -= 2.8 * Math.sin(crocodiles[key].dir);
        } else {
            turnTowards(crocodiles[key], player, 0.002);
            crocodiles[key].x -= Math.cos(crocodiles[key].dir);
            crocodiles[key].y -= Math.sin(crocodiles[key].dir);
        }
        if (crocodiles[key].x > width + 256) {
            crocodiles.splice(key, 1);
        } else if (crocodiles[key].x < -256) {
            crocodiles.splice(key, 1);
        } else if (crocodiles[key].y > height + 256) {
            crocodiles.splice(key, 1);
        } else if (crocodiles[key].y < -256) {
            crocodiles.splice(key, 1);
        }
    }
}
var raised = 0;
ducklingAnimationTicker = 0;
ducklingAnimationTick = 10;

function turnTowards(that, toThat, turnSpeed) {
    let angl = angle(that.x, that.y, toThat.x, toThat.y);
    angl -= Math.PI;
    if (angl < Math.PI * (-1)) {
        angl += Math.PI * 2;
    }
    if (that.dir > Math.PI) {
        that.dir -= Math.PI * 2;
    }
    if (that.dir < -1 * Math.PI) {
        that.dir += Math.PI * 2;
    }

    if (Math.abs(that.dir - angl) > turnSpeed) {
        if (findSideToTurn(angl, that.dir) > 0) {

            that.dir = ((that.dir + turnSpeed));
        } else {

            that.dir = ((that.dir - turnSpeed));
        }

    }
}

function turnTowards2(ang1, angl, turnSpeed) {

    angl -= Math.PI;
    if (angl < Math.PI * (-1)) {
        angl += Math.PI * 2;
    }
    if (ang1 > Math.PI) {
        ang1 -= Math.PI * 2;
    }
    if (ang1 < -1 * Math.PI) {
        ang1 += Math.PI * 2;
    }



    ang1 = ((ang1 + turnSpeed));



    return ang1;
}

function moveTowards(that, toThat, tail, margin, speed, turnSpeed) {
    let playerTailX = toThat.x + tail * Math.cos(toThat.dir);
    let playerTailY = toThat.y + tail * Math.sin(toThat.dir);
    if (Distance(that.x, that.y, toThat.x, toThat.y) > margin) {
        let angl = angle(that.x, that.y, playerTailX, playerTailY);
        angl -= Math.PI;
        if (angl < Math.PI * (-1)) {
            angl += Math.PI * 2;
        }
        if (that.dir > Math.PI) {
            that.dir -= Math.PI * 2;
        }
        if (that.dir < -1 * Math.PI) {
            that.dir += Math.PI * 2;
        }

        if (Math.abs(that.dir - angl) > turnSpeed) {
            if (findSideToTurn(angl, that.dir) > 0) {

                that.dir = ((that.dir + turnSpeed));
            } else {

                that.dir = ((that.dir - turnSpeed));
            }

        }

        that.x += speed * Math.cos(that.dir - Math.PI);
        that.y += speed * Math.sin(that.dir - Math.PI);

        // ducklings[0].growth += 0.02;
    }
}

function contains(that, arr) {
    for (let key in arr) {
        if (that == arr[key]) {
            return true;
        }
    }
    return false;
}

function findClosest(that, arr) {
    let lowest = 10000;
    let lowestInd = Math.floor(Math.random() * arr.length);
    for (let key in arr) {
        let dist = Distance(arr[key].x, arr[key].y, that.x, that.y);
        if (dist < lowest) {
            lowest = dist;
            lowestInd = key;
        }
    }
    /*let tmpCrumb = new crumb(arr[lowestInd].x,arr[lowestInd].y,arr[lowestInd].dir)*/
    return arr[lowestInd];
}

function particleSplatter(x, y, dir, dur, size, speed, amount, angle, r, g, b, a) {
    for (let i = 0; i < amount; i++) {
        particleSplatters.push([x, y,
            dir - angle / 2 + Math.random() * angle / amount * i,
            dur, //dur,
            size * (1 + 1.2 * Math.random()),
            speed * (0.4 + 1.2 * Math.random()),
            r,
            g,
            b,
            a
        ]);
    }
}
var particleSplatters = [];

function drawParticles()  {
    for (let key in particleSplatters) {
        particleSplatters[key][3]--;
        if (particleSplatters[key][3] <= 0) {
            particleSplatters.splice(key, 1);
        } else {
            particleSplatters[key]
            let siz = particleSplatters[key][4] * 1;
            particleSplatters[key][0] += particleSplatters[key][5] * Math.cos(particleSplatters[key][2]);
            particleSplatters[key][1] += particleSplatters[key][5] * Math.sin(particleSplatters[key][2]);

            ctxBG.fillStyle = "rgba(" + particleSplatters[key][6] + "," + particleSplatters[key][7] + "," + particleSplatters[key][8] + "," + (particleSplatters[key][9] * particleSplatters[key][3] / 5) + ")";
            /*}*/
            ctxBG.beginPath();
            ctxBG.arc(particleSplatters[key][0], particleSplatters[key][1], siz, 0, Math.PI * 2, 0);
            ctxBG.fill();



        }
    }
}
var bloods = [];

function bloodSplatter(x, y, dir, dur, size, speed, amount, angle) {
    for (let i = 0; i < amount * 2; i++) {
        bloods.push([x, y,
            dir - angle / 2 + Math.random() * angle / (amount * 2) * i,
            Math.ceil(Math.random() * 20), //dur,
            size * (1 + 0.8 * Math.random()),
            speed * (0.4 + 1.2 * Math.random())
        ]);
    }
}

function drawBlood()  {
    for (let key in bloods) {
        bloods[key][3]--;
        if (bloods[key][3] <= 0) {
            bloods.splice(key, 1);
        } else {
            bloods[key]
            let siz = bloods[key][4] * 128;
            bloods[key][0] += bloods[key][5] * Math.cos(bloods[key][2]);
            bloods[key][1] += bloods[key][5] * Math.sin(bloods[key][2]);
            //bloods[key][2]+=0.1;
            ctxBG.save();
            ctxBG.translate(bloods[key][0], bloods[key][1]);
            ctxBG.rotate(bloods[key][2]);
            /*if (bloods[key][3]<10) {*/
            ctxBG.globalAlpha = bloods[key][3] / 3;
            /*}*/
            ctxBG.drawImage(images.blood, 0, 0, 128, 128, 0 - siz / 4, 0 - siz / 4, siz / 2, siz / 2);
            ctxBG.restore();
            ctxBG.globalAlpha = 1;

        }
    }
}
var lastXDuckling = 0;
var lastYDuckling = 0;

function moveDucklings() {
    let incAnim = false;
    ducklingAnimationTicker++;
    if (ducklingAnimationTicker > ducklingAnimationTick) {
        ducklingAnimationTicker = 0;
        incAnim = true;

    }
    if (ducklingOnMap.length > 0) {
        firstLoop: for (let duck = ducklingOnMap.length - 1; duck >= 0; duck--) {
            ducklingOnMap[duck].x -= Math.cos(ducklingOnMap[duck].dir);
            ducklingOnMap[duck].y -= Math.sin(ducklingOnMap[duck].dir);
            ducklingAnimationTicker++;
            if (incAnim) {
                ducklingOnMap[duck].animation = (ducklingOnMap[duck].animation + 1) % 8;
            }
            crocLoop:
                for (let key in crocodiles) {

                    if (Distance(ducklingOnMap[duck].x + Math.cos(ducklingOnMap[duck].dir) * 0, ducklingOnMap[duck].y + Math.sin(ducklingOnMap[duck].dir) * 0, crocodiles[key].x - Math.cos(crocodiles[key].dir) * 14, crocodiles[key].y - Math.sin(crocodiles[key].dir) * 14) < 32) {
                        ducklingOnMap.splice(duck, 1);

                        bloodSplatter(crocodiles[key].x - Math.cos(crocodiles[key].dir) * 14, crocodiles[key].y - Math.sin(crocodiles[key].dir) * 14, crocodiles[key].dir + Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
                        bloodSplatter(crocodiles[key].x - Math.cos(crocodiles[key].dir) * 14, crocodiles[key].y - Math.sin(crocodiles[key].dir) * 14, crocodiles[key].dir - Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);

                        if (!audioMuted) {
                            snapAudio.pause();
                            snapAudio.currentTime = 0;
                            snapAudio.play();
                        }
                        crocodiles[key].eaten = true;
                        continue firstLoop;
                    }

                }
            for (let key in snakes) {

                if (snakes[key].eaten[0] < 1 && Distance(ducklingOnMap[duck].x + Math.cos(ducklingOnMap[duck].dir) * 0, ducklingOnMap[duck].y + Math.sin(ducklingOnMap[duck].dir) * 0, snakes[key].x - Math.cos(snakes[key].dir) * 0, snakes[key].y - Math.sin(snakes[key].dir) * 0) < 30) {
                    ducklingOnMap.splice(duck, 1);

                    bloodSplatter(snakes[key].x - Math.cos(snakes[key].dir) * 14, snakes[key].y - Math.sin(snakes[key].dir) * 14, snakes[key].dir + Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
                    bloodSplatter(snakes[key].x - Math.cos(snakes[key].dir) * 14, snakes[key].y - Math.sin(snakes[key].dir) * 14, snakes[key].dir - Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);

                    if (!audioMuted) {
                        swallowAudio.pause();
                        swallowAudio.currentTime = 0;
                        swallowAudio.play();
                    }
                    snakes[key].eaten[0] = Math.min(20, snakes[key].eaten[0] + 10);
                    continue firstLoop;
                }

            }

            if (ducklingOnMap[duck].x > width + 64) {
                ducklingOnMap[duck].x = width + 64;
                ducklingOnMap[duck].dir += 0.5 * Math.PI + Math.random() * 1 * Math.PI;
                //lastXDuckling = ducklingOnMap[duck].x;
                //lastYDuckling = ducklingOnMap[duck].y;
                //ducklingOnMap.splice(duck,1);
                //continue firstLoop;

            } else if (ducklingOnMap[duck].x < -64) {
                ducklingOnMap[duck].x = -64;
                ducklingOnMap[duck].dir += 0.5 * Math.PI + Math.random() * 1 * Math.PI;
                //lastXDuckling = ducklingOnMap[duck].x;
                //lastYDuckling = ducklingOnMap[duck].y;
                //ducklingOnMap.splice(duck,1);
                //continue firstLoop;
            } else if (ducklingOnMap[duck].y > height + 64) {
                ducklingOnMap[duck].y = height + 64;
                ducklingOnMap[duck].dir += 0.5 * Math.PI + Math.random() * 1 * Math.PI;
                //lastXDuckling = ducklingOnMap[duck].x;
                //lastYDuckling = ducklingOnMap[duck].y;
                //ducklingOnMap.splice(duck,1);
                //continue firstLoop;
            } else if (ducklingOnMap[duck].y < -64) {
                ducklingOnMap[duck].y = -64;
                ducklingOnMap[duck].dir += 0.5 * Math.PI + Math.random() * 1 * Math.PI;
                //lastXDuckling = ducklingOnMap[duck].x;
                //lastYDuckling = ducklingOnMap[duck].y;
                //ducklingOnMap.splice(duck,1);
                //continue firstLoop;
            }



        }

    }
    incAnim=false;
    if (ducklings.length > 0) {
        if (dead) {
            firstLoop: 
            for (let key = ducklings.length - 1; key >= 0; key--) {
                let growthMult = 8 + ((48 * ducklings[key].growth / 100) / 4);
                ducklings[key].dir += Math.random() * 0.1 - Math.random() * 0.1;
                ducklings[key].x += 1 * Math.cos(ducklings[key].dir - Math.PI);
                ducklings[key].y += 1 * Math.sin(ducklings[key].dir - Math.PI);
                crocLoop:
                    for (let croc in crocodiles) {

                        if (Distance(ducklings[key].x, ducklings[key].y, crocodiles[croc].x - Math.cos(crocodiles[croc].dir) * 14, crocodiles[croc].y - Math.sin(crocodiles[croc].dir) * 14) < 16 + growthMult) {
                            /*totalEaten++;
                            crocEaten++;*/
                            crocodiles[croc].eaten = true;
                            ducklings.splice(key, 1);
                            bloodSplatter(crocodiles[croc].x - Math.cos(crocodiles[croc].dir) * 0, crocodiles[croc].y - Math.sin(crocodiles[croc].dir) * 0, crocodiles[croc].dir + Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
                            bloodSplatter(crocodiles[croc].x - Math.cos(crocodiles[croc].dir) * 0, crocodiles[croc].y - Math.sin(crocodiles[croc].dir) * 0, crocodiles[croc].dir - Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
                            if (!dead) {

                                bgAudio.playbackRate = 0.7 + Math.ceil(10 * Math.log(Math.min(15, Math.max(1, ducklings.length))) / 4) / 10;
                            }
                            if (!audioMuted) {

                                try {
                                    snapAudio.pause();
                                    snapAudio.currentTime = 0;
                                    snapAudio.play();
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                            continue firstLoop;
                        }
                    }
                snakeLoop:
                    for (let croc in snakes) {

                        if (snakes[croc].eaten[0] < 1 && Distance(ducklings[key].x, ducklings[key].y, snakes[croc].x - Math.cos(snakes[croc].dir) * 0, snakes[croc].y - Math.sin(snakes[croc].dir) * 0) < 14 + growthMult) {
                            /*totalEaten++;
                            snakeEaten++;*/
                            snakes[croc].eaten[0] = Math.min(20, snakes[croc].eaten[0] + 10);
                            ducklings.splice(key, 1);
                            bloodSplatter(snakes[croc].x - Math.cos(snakes[croc].dir) * 0, snakes[croc].y - Math.sin(snakes[croc].dir) * 0, snakes[croc].dir + Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
                            bloodSplatter(snakes[croc].x - Math.cos(snakes[croc].dir) * 0, snakes[croc].y - Math.sin(snakes[croc].dir) * 0, snakes[croc].dir - Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
                            if (!dead) {

                                bgAudio.playbackRate = 0.7 + Math.ceil(10 * Math.log(Math.min(15, Math.max(1, ducklings.length))) / 4) / 10;
                            }
                            if (!audioMuted) {

                                try {
                                    swallowAudio.pause();
                                    swallowAudio.currentTime = 0;
                                    swallowAudio.play();
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                            continue firstLoop;
                        }
                    }
            }
            return;
        }
        if (crumbs.length > 0) {
            for (let key in ducklings) {

                if (ducklings[key].target != null && ducklings[key].target != undefined && contains(ducklings[key].target, crumbs)) {
                    moveTowards(ducklings[key], ducklings[key].target, 0, 4, 1.2, 0.05);
                } else {
                    ducklings[key].target = findClosest(ducklings[key], crumbs);
                }


            }
        } else {
            moveTowards(ducklings[0], player, 34, 56,
                2 * (Math.log(Math.max(4, ducklings.length)) / 1.5),
                0.05);

            for (let key = 1; key < ducklings.length; key++) {
                moveTowards(ducklings[key], ducklings[key - 1], 14, 34,
                    2 * (Math.log(Math.max(4, ducklings.length)) / 1.5),
                    0.05);
            }
        }


        firstLoop:
            for (let key = ducklings.length - 1; key >= 0; key--) {
                let growthMult = 8 + ((48 * ducklings[key].growth / 100) / 4);
                if (ducklings[key].growth >= 100) {
                    goingAway.push(ducklings[key]);
                    raised++;
                    if (!audioMuted) {
                        try {
                            quackAudio.pause();
                            quackAudio.currentTime = 0;
                            quackAudio.play();

                        } catch (e) {

                        }

                    }
                    increasePoints(25 * (1 + raised) * Math.max(1, ducklings.length), getMult());
                    ducklings.splice(key, 1);
                    continue;
                }
                crocLoop:
                    for (let croc in crocodiles) {

                        if (Distance(ducklings[key].x, ducklings[key].y, crocodiles[croc].x - Math.cos(crocodiles[croc].dir) * 14, crocodiles[croc].y - Math.sin(crocodiles[croc].dir) * 14) < 16 + growthMult) {
                            totalEaten++;
                            crocEaten++;
                            crocodiles[croc].eaten = true;
                            ducklings.splice(key, 1);
                            bloodSplatter(crocodiles[croc].x - Math.cos(crocodiles[croc].dir) * 14, crocodiles[croc].y - Math.sin(crocodiles[croc].dir) * 14, crocodiles[croc].dir + Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
                            bloodSplatter(crocodiles[croc].x - Math.cos(crocodiles[croc].dir) * 14, crocodiles[croc].y - Math.sin(crocodiles[croc].dir) * 14, crocodiles[croc].dir - Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
                            if (!dead) {

                                bgAudio.playbackRate = 0.7 + Math.ceil(10 * Math.log(Math.min(15, Math.max(1, ducklings.length))) / 4) / 10;
                            }
                            if (!audioMuted) {

                                try {
                                    snapAudio.pause();
                                    snapAudio.currentTime = 0;
                                    snapAudio.play();
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                            continue firstLoop;
                        }
                    }
                snakeLoop:
                    for (let croc in snakes) {

                        if (snakes[croc].eaten[0] < 1 && Distance(ducklings[key].x, ducklings[key].y, snakes[croc].x - Math.cos(snakes[croc].dir) * 0, snakes[croc].y - Math.sin(snakes[croc].dir) * 0) < 14 + growthMult) {
                            totalEaten++;
                            snakeEaten++;
                            snakes[croc].eaten[0] = Math.min(20, snakes[croc].eaten[0] + 10);
                            ducklings.splice(key, 1);
                            bloodSplatter(snakes[croc].x - Math.cos(snakes[croc].dir) * 0, snakes[croc].y - Math.sin(snakes[croc].dir) * 0, snakes[croc].dir + Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
                            bloodSplatter(snakes[croc].x - Math.cos(snakes[croc].dir) * 0, snakes[croc].y - Math.sin(snakes[croc].dir) * 0, snakes[croc].dir - Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
                            if (!dead) {

                                bgAudio.playbackRate = 0.7 + Math.ceil(10 * Math.log(Math.min(15, Math.max(1, ducklings.length))) / 4) / 10;
                            }
                            if (!audioMuted) {

                                try {
                                    swallowAudio.pause();
                                    swallowAudio.currentTime = 0;
                                    swallowAudio.play();
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                            continue firstLoop;
                        }
                    }
            }
    }
}
var quackTicker = 0;
var quackTick = Math.floor(Math.random() * 1000);

function movePlayer() {
    if (dead) {
        return;
    }
    if (player.attack > 0) {
        player.attack--;
    }
    quackTicker++;
    // if(quackTicker>= quackTick) {
    //     quackAudio.pause();
    //     quackAudio.currentTime = 0;
    //     quackAudio.play();
    //     quackTicker = 0;
    //     quackTick = Math.floor(Math.random() * 1000);
    // }
    player.rotAcc *= 0.9;
    if (Math.abs(player.rotAcc) < 0.001) {
        player.rotAcc = 0;
    }
    player.accX *= 0.95;
    if (Math.abs(player.accX) < 0.0001) {
        player.accX = 0;
    }
    player.accY *= 0.95;
    if (Math.abs(player.accY) < 0.0001) {
        player.accY = 0;
    }
    if (upClicked) {

        player.accX -= 0.1 * (Math.log(Math.max(4, ducklings.length)) / 1.5) * Math.cos(player.dir);
        player.accY -= 0.1 * (Math.log(Math.max(4, ducklings.length)) / 1.5) * Math.sin(player.dir);
    }
    if (downClicked) {

        player.accX += 0.01 * Math.log(Math.max(4, ducklings.length)) / 1.5 * Math.cos(player.dir);
        player.accY += 0.01 * Math.log(Math.max(4, ducklings.length)) / 1.5 * Math.sin(player.dir);
    }
    if (leftClicked) {

        player.rotAcc -= 0.004;
    }
    if (rightClicked) {

        player.rotAcc += 0.004;
    }
    let newDir = (player.dir + player.rotAcc);
    player.dir = turnTowards2(player.dir, newDir, player.rotAcc);
    // player.dir = (newDir+Math.PI)%Math.PI-Math.PI;
    player.x += player.accX;
    player.y += player.accY;

    if (player.x < 256) {
        let diff = 256 - player.x;
        camX -= diff;
        camMov.push(["x", diff]);
        for (let key in crocodiles)  {
            crocodiles[key].x += diff;
        }
        for (let key in snakes)  {
            snakes[key].x += diff;
        }
        for (let key in breads)  {
            breads[key].x += diff;
        }
        for (let key in crumbs)  {
            crumbs[key].x += diff;
        }
        for (let key in ducklingOnMap) {
            ducklingOnMap[key].x += diff;
        }
        for (let key in player.path) {
            player.path[key][0] += diff;
        }
        for (let key in ducklings) {
            ducklings[key].x += diff;
        }

        player.x = 256;
    }
    if (player.x > width - 256) {
        let diff = width - 256 - player.x;
        camX -= diff;
        camMov.push(["x", diff]);
        for (let key in crocodiles)  {
            crocodiles[key].x += diff;
        }
        for (let key in snakes)  {
            snakes[key].x += diff;
        }
        for (let key in breads)  {
            breads[key].x += diff;
        }
        for (let key in crumbs)  {
            crumbs[key].x += diff;
        }
        for (let key in ducklingOnMap) {
            ducklingOnMap[key].x += diff;
        }
        for (let key in player.path) {
            player.path[key][0] += diff;
        }
        for (let key in ducklings) {
            ducklings[key].x += diff;
        }
        player.x = width - 256;
    }
    if (player.y < 256) {
        let diff = 256 - player.y;
        camY -= diff;
        camMov.push(["y", diff]);
        for (let key in crocodiles)  {
            crocodiles[key].y += diff;
        }
        for (let key in snakes)  {
            snakes[key].y += diff;
        }
        for (let key in breads)  {
            breads[key].y += diff;
        }
        for (let key in crumbs)  {
            crumbs[key].y += diff;
        }
        for (let key in ducklingOnMap) {
            ducklingOnMap[key].y += diff;
        }
        for (let key in player.path) {
            player.path[key][1] += diff;
        }
        for (let key in ducklings) {
            ducklings[key].y += diff;
        }
        player.y = 256;
    }
    if (player.y > height - 256) {
        let diff = height - 256 - player.y;
        camY -= diff;
        camMov.push(["y", diff]);
        for (let key in crocodiles)  {
            crocodiles[key].y += diff;
        }
        for (let key in snakes)  {
            snakes[key].y += diff;
        }
        for (let key in breads)  {
            breads[key].y += diff;
        }
        for (let key in crumbs)  {
            crumbs[key].y += diff;
        }
        for (let key in ducklingOnMap) {
            ducklingOnMap[key].y += diff;
        }
        for (let key in player.path) {
            player.path[key][1] += diff;
        }
        for (let key in ducklings) {
            ducklings[key].y += diff;
        }
        player.y = height - 256;
    }

    if (player.path.length > 50) {
        player.path.splice(0, 1);
    } else {
        if (player.accX != 0 || player.accY != 0 || player.rotAcc != 0) {
            pathTicker++;
            if (pathTicker > 10) {
                pathTicker = 0;
                if (Math.abs(player.accY) + Math.abs(player.accX) > 1) {
                    player.path.push([player.x + 16 * Math.cos(player.dir), player.y + 16 * Math.sin(player.dir), 120, player.dir, 0]);

                }
            }
        }

    }
    for (let key = player.path.length - 1; key >= 0; key--) {
        player.path[key][2]--;
        if (player.path[key][2] <= 0) {
            player.path.splice(key, 1);
        }
    }


    for (let duck = ducklingOnMap.length - 1; duck >= 0; duck--) {
        if (collides(player, 64, ducklingOnMap[duck], 64)) {
            console.log("Colding");
            increasePoints(10, getMult());
            totalDucklings++;
            ducklings.push(ducklingOnMap[duck]);
            if (ducklings.length > longestChain) {
                longestChain = ducklings.length;
            }
            if (!dead) {

                bgAudio.playbackRate = 0.7 + Math.ceil(10 * Math.log(Math.min(15, Math.max(1, ducklings.length))) / 4) / 10;
            }
            spawnHeart((player.x + ducklingOnMap[duck].x) / 2, (player.y + ducklingOnMap[duck].y) / 2);
            ducklingOnMap.splice(duck, 1);
            if (!audioMuted) {

                quackQuackAudio.play();
            }


        }

    }
    for (let key = crocodiles.length - 1; key >= 0; key--) {
        if (!crocodiles[key].dead && Distance(player.x, player.y, crocodiles[key].x - Math.cos(crocodiles[key].dir) * 14, crocodiles[key].y - Math.sin(crocodiles[key].dir) * 14) < 32) {

            bloodSplatter(crocodiles[key].x - Math.cos(crocodiles[key].dir) * 14, crocodiles[key].y - Math.sin(crocodiles[key].dir) * 14, crocodiles[key].dir + Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
            //
            bloodSplatter(crocodiles[key].x - Math.cos(crocodiles[key].dir) * 14, crocodiles[key].y - Math.sin(crocodiles[key].dir) * 14, crocodiles[key].dir - Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
            /*for (let i = 0;i<5;i++) {
                window.setTimeout(function() {
                        bloodSplatter(crocodiles[key].x-Math.cos(crocodiles[key].dir)*14,crocodiles[key].y-Math.sin(crocodiles[key].dir)*14,crocodiles[key].dir+Math.PI*0.5,(0.6 + (0.8 * Math.random()))*5,1,(0.6 + (0.8 * Math.random())) * 10,Math.ceil(Math.random()*5),Math.PI*0.5);

                        bloodSplatter(crocodiles[key].x-Math.cos(crocodiles[key].dir)*14,crocodiles[key].y-Math.sin(crocodiles[key].dir)*14,crocodiles[key].dir-Math.PI*0.5,(0.6 + (0.8 * Math.random()))*5,1,(0.6 + (0.8 * Math.random())) * 10,Math.ceil(Math.random()*5),Math.PI*0.5);
                },i*50);

            }*/
            if (!audioMuted) {
                snapAudio.pause();
                snapAudio.currentTime = 0;
                snapAudio.play();
            }
            gameOver("Oh dear!</br> You were eaten by a Crocodile!");
            crocodiles[key].eaten = true;
            continue;
        } else if (Distance(player.x - Math.cos(player.dir) * 20, player.y - Math.sin(player.dir) * 20, crocodiles[key].x + 7 * Math.cos(crocodiles[key].dir), crocodiles[key].y + 7 * Math.sin(crocodiles[key].dir)) < 28 
           /* && Math.abs(player.dir - crocodiles[key].dir) < 1 * Math.PI */
            && !crocodiles[key].dead) {
            //crocodiles.splice(key,1);
            crocodiles[key].dead = true;
            crocKilled++;
            increasePoints(5 * Math.max(1, ducklings.length), getMult());
            player.attack = 20;
            if (!audioMuted) {
                try {
                    attackAudio.pause();
                    attackAudio.currentTime = 0;
                    attackAudio.play();

                } catch (e) {

                }
            }
            continue;
        }
    }

    for (let key = snakes.length - 1; key >= 0; key--) {

        if (snakes[key].eaten[0] < 1 && Distance(player.x, player.y, snakes[key].x - Math.cos(snakes[key].dir) * 0, snakes[key].y - Math.sin(snakes[key].dir) * 0) < 30) {

            bloodSplatter(snakes[key].x - Math.cos(snakes[key].dir) * 0, snakes[key].y - Math.sin(snakes[key].dir) * 0, snakes[key].dir + Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
            //
            bloodSplatter(snakes[key].x - Math.cos(snakes[key].dir) * 0, snakes[key].y - Math.sin(snakes[key].dir) * 0, snakes[key].dir - Math.PI * 0.5, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 10), Math.PI * 0.5);
            /*for (let i = 0;i<5;i++) {
                window.setTimeout(function() {
                        bloodSplatter(snakes[key].x-Math.cos(snakes[key].dir)*14,snakes[key].y-Math.sin(snakes[key].dir)*14,snakes[key].dir+Math.PI*0.5,(0.6 + (0.8 * Math.random()))*5,1,(0.6 + (0.8 * Math.random())) * 10,Math.ceil(Math.random()*5),Math.PI*0.5);

                        bloodSplatter(snakes[key].x-Math.cos(snakes[key].dir)*14,snakes[key].y-Math.sin(snakes[key].dir)*14,snakes[key].dir-Math.PI*0.5,(0.6 + (0.8 * Math.random()))*5,1,(0.6 + (0.8 * Math.random())) * 10,Math.ceil(Math.random()*5),Math.PI*0.5);
                },i*50);

            }*/
            if (!audioMuted) {
                swallowAudio.pause();
                swallowAudio.currentTime = 0;
                swallowAudio.play();
            }
            gameOver("Oh dear!</br> You were eaten by a Snake!");
            snakes[key].eaten[0] = Math.min(20, snakes[key].eaten[0] + 10);
        }
    }

    for (let key = breads.length - 1; key >= 0; key--) {
        if (breadEaten < stomachSize && Distance(breads[key].x, breads[key].y, player.x - Math.cos(player.dir) * 20, player.y - Math.sin(player.dir) * 20) < 20) {

            breads.splice(key, 1);
            if (!arcade) {
                //breadEaten++;

            } else {
                for (let duk in ducklings) {
                    ducklings[duk].growth += Math.ceil(50 / ducklings.length);
                }
            }
            //particleSplatter(player.x-Math.cos(player.dir)*24,player.y-Math.sin(player.dir)*24,player.dir - Math.PI,(0.6 + (0.8 * Math.random()))*5,1,(0.6 + (0.8 * Math.random())) * 10,Math.ceil(Math.random()*20),Math.PI,255,255,0,0.8);
            for (let i = 0; i < 4; i++) {
                window.setTimeout(function() {
                    particleSplatter(player.x - Math.cos(player.dir) * 24, player.y - Math.sin(player.dir) * 24, player.dir - Math.PI, (0.6 + (0.8 * Math.random())) * 5, 1, (0.6 + (0.8 * Math.random())) * 10, Math.ceil(Math.random() * 20), Math.PI, 255, 255, 0, 0.5);
                }, i * 100);
            }
            if (!audioMuted) {
                try {
                    eatAudio.pause();
                    eatAudio.currentTime = 0;
                    eatAudio.play();
                } catch (e) {
                    console.log(e);
                }
            }
        } else if (breads[key].x < -64 || breads[key].x > width + 64 || breads[key].y < -64 || breads[key].y > height + 64) {
            breads.splice(key, 1);
        }
    }

}
var lastPoints = 0;
var pointIncreases = [];

function increasePoints(am, mult) {
    Points += am + Math.ceil(am * mult);
    pointIncreases.push(["+" + (am + am * mult), player.x, player.y, 100, 15]);
    pointIncreases.push(["(" + am + " * " + (1 + mult) + " = " + (am + (am * mult)) + ")", player.x, player.y + 20, 100, 13]);

}

function drawPointIncreases() {
    for (let key = pointIncreases.length - 1; key >= 0; key--) {
        pointIncreases[key][3]--;
        if (pointIncreases[key][3] < 0) {
            pointIncreases.splice(key, 1);
        } else {
            pointIncreases[key][2]--;
            ctxBG.fillStyle = "rgba(255,255,255," + pointIncreases[key][3] / 100 + ")";
            ctxBG.font = pointIncreases[key][4] + "px 'Ranchers', cursive";
            ctxBG.fillText(pointIncreases[key][0], pointIncreases[key][1], pointIncreases[key][2]);
        }
    }
}

function muteMusic() {

    if (musicMuted) {
        musicMuted = false;
        bgAudio.play();
    } else {
        musicMuted = true;
        bgAudio.pause();
        bgAudio.currentTime = 0;
    }

}
var audioMuted = false;
var musicMuted = false;

function muteAudio() {
    if (audioMuted) {
        audioMuted = false;
    } else {
        audioMuted = true;
    }
}

function showHitboxes() {
    if (drawHitBoxes) {
        drawHitBoxes = false;
    } else {
        drawHitBoxes = true;
    }
}
var hearts = [];
var Points = 0;

function spawnHeart(x, y) {
    hearts.push([x, y, 100, 1]);
}

function drawHeart() {
    for (let key = hearts.length - 1; key >= 0; key--) {
        hearts[key][2]--;
        if (hearts[key][2] < 0) {
            hearts.splice(key, 1);
        } else {
            let siz;

            ctxBG.globalAlpha = hearts[key][2] / 100;

            siz = 128 - 64 * (hearts[key][2] / 100);
            ctxBG.drawImage(images.heart, 0, 0, 128, 128, hearts[key][0] - siz / 2, hearts[key][1] - siz / 2, siz, siz)
            ctxBG.globalAlpha = 1;
        }

    }
}
var pathTicker = 0;

function moveEnemies() {

}
var dead = false;
var totalEaten = 0;
var crocEaten = 0;
var snakeEaten = 0;
var crocKilled=0;

function gameOver(msg) {
    dead = true;

    player.path = [];

    bgAudio.playbackRate = 0.7;

    if (Points > highscore) {
        highscore = Points;
        try {
            window.localStorage.setItem("highScore", highscore);
        } catch (e) {
            console.error(e);
        }
        $("#highscore").html(highscore);
        $(".newHighscore").css("display", "inline-block");
    } else {
        $(".newHighscore").css("display", "none");
        $("#highscore").html(highscore);
    }
    $("#mainMenu").css("display", "none");
    $("#HUD").css("display", "none");
    $("#killMessage").html(msg);
    $("#scoreFinal").html(Points);
    $("#scoreCreated").html(totalDucklings);
    $("#scoreRaised").html(raised);
    $("#scoreEaten").html(totalEaten);
    $("#scoreSnakeEaten").html(snakeEaten);
    $("#scoreCrocEaten").html(crocEaten);
    $("#scoreLongestChain").html(longestChain);
    let survivalRate = Math.floor(100 * (((totalDucklings - totalEaten) / totalDucklings) * 100)) / 100;
    if (isNaN(survivalRate)) {
        survivalRate = 100;
    }
    $("#scoreSurvival").html(survivalRate + "%");
    $("#gameOver").css("display", "block");
    $("#pauseButton").css("display", "none");

    $("#killMessage").animate({
        "font-size": 20,
        height: "10%",
        opacity: 0,
    }, 2500);

}

function spawnBread() {
    let x = 100 + Math.random() * (width - 200);
    let y = 100 + Math.random() * (height - 200);
    let dir = Math.random() * Math.PI - Math.random() * Math.PI;

    breads.push(new bread(x, y, dir))
}
var spawnTicker = 0;
var spawnTick = 500;
var breadSpawn = 150;

function currentLocation() {
    let x = camX + player.x;
    let y = camY + player.y;
    for (let key in locations) {
        if (x < locations[key].pos.x[1] && x > locations[key].pos.x[0] &&
            y < locations[key].pos.y[1] && y > locations[key].pos.y[0]) {
            return locations[key].name;
        }
    }
    return "Wilderness";
}
var maxDucklingsOnMap = 2;
var arcade = true;

function updateGame() {
    if (!arcade) {
        if (maxDucklingsOnMap > ducklingOnMap.length) {
            //spawnDuckling();
            if (currentLocation() != "Safe Haven") {
                spawnDuckGirl();
            }
        }
        if (currentLocation() == "Wilderness") {
            spawnTicker++;
            if (spawnTicker > spawnTick) {
                spawnTick = Math.floor(Math.max(150, 400 - ducklings.length * ducklings.length * 10));
                spawnTicker = 0;
                if (Math.random() < 0.5) {
                    spawnCrocodile();
                } else {
                    spawnSnake();
                }


            }
        };
        if (currentLocation() == "Croc Waters") {
            spawnTicker++;
            if (spawnTicker > spawnTick) {
                spawnTick = Math.floor(Math.max(50, 100 - ducklings.length * ducklings.length * 10));
                spawnTicker = 100;
                if (crocodiles.length <= 10) {
                    spawnCrocodile();
                }


            }
        } else if (currentLocation() == "Snake Pit") {
            spawnTicker++;
            if (spawnTicker > spawnTick) {
                spawnTick = Math.floor(Math.max(50, 100 - ducklings.length * ducklings.length * 10));
                spawnTicker = 100;

                if (snakes.length <= 10) {

                    spawnSnake();
                }
            }
        }
    } else {
        if (Math.ceil(Math.max(1,Math.sqrt(ducklings.length))) > ducklingOnMap.length) {
            //spawnDuckling();
            
                spawnDuckGirl();
            
        }
        spawnTicker++;
        if (spawnTicker > spawnTick) {
            spawnTick = Math.floor(Math.max(150, 500 - ducklings.length * ducklings.length * 10));
            spawnTicker = 0;

            if (crocodiles.length< 11) {

            spawnCrocodile();
            }


            if (ducklings.length > 4 && snakes.length < 6) {
                spawnSnake();
            }

        }
    }

    /*spawnTicker++;
    if (spawnTicker > spawnTick) {
        spawnTick = Math.floor(Math.max(200, 500 - ducklings.length * ducklings.length * 10));
        spawnTicker = 2000;
        if (currentLocation() == "Croc Waters") {
            spawnCrocodile();
        }
        if (currentLocation() == "Snake Pit") {

            spawnSnake();
        }
    }*/
    for (let key in ducklings) {

    }
    if (breads.length < ducklings.length ) {
        breadSpawn++;
        if (breadSpawn > 100) {
            breadSpawn = 0;
            spawnBread();
        }

    }


    if (bgAudio.ended && !musicMuted) {
        bgAudio.pause();
        bgAudio.currentTime = 0;
        bgAudio.play();
    }
}


var moveSpeed = 0.5;
var tileSize;
var margin;



function roundRect(ctx, x, y, width, height, radius, fill, stroke, fs, ss, lw) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.fillStyle = fs;
    ctx.strokeStyle = ss;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
    ctx.closePath();

}

function spawnRandom(board, lv) {
    let rndPos = board.returnEmpty();
    if (rndPos) {
        addTile(board.Board, lv, rndPos[1], rndPos[0]);
    }
}

function addTile(board, lv, x, y) {
    board[y][x] = new piece(lv, x, y);
}

function clickBoard() {

}
var disToDraw = [];
var moved = false;
var anyMerge = false;

var leftClicked = false;
var rightClicked = false;
var upClicked = false;
var downClicked = false;

function keyUpMine(e) {
    if (e.key == "ArrowDown") {
        // console.log("down");
        downClicked = false;

    } else if (e.key == "ArrowUp") {
        //console.log("up");
        upClicked = false;

    } else if (e.key == "ArrowLeft") {
        //console.log("left");
        leftClicked = false;

    } else if (e.key == "ArrowRight") {
        //console.log("right");
        rightClicked = false;

    }
}

function keyDownMine(e) {
    if (e.key == "ArrowDown" && !moved) {

        downClicked = true;
        moved = true;
    } else if (e.key == "ArrowUp" && !moved) {

        upClicked = true;
        moved = true;
    } else if (e.key == "ArrowLeft" && !moved) {

        leftClicked = true;
        moved = true;
    } else if (e.key == "ArrowRight" && !moved) {

        rightClicked = true;
        moved = true;
    } else if (e.key == " ") {
        if (!arcade) {
            if (breadEaten > 0) {
                makeCrumbs();
                breadEaten--;
                
            } else {
                emptyStomach = 50;
            }
            if (!audioMuted) {
                try {
                    burpAudio.pause();
                    burpAudio.currentTime = 0;
                    burpAudio.play();

                } catch (e) {

                }
            }
        }
    }
}
crumbs = [];
var crumb = function(x, y, dir, dur, moveDur) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.dur = dur;
    this.moveDur = moveDur;
}

function makeCrumbs() {
    for (var i = 0; i < 5; i++) {
        let dir = player.dir - Math.PI * 0.35 + i * Math.PI * 0.175 * Math.random() - Math.PI;
        //console.log(dir);
        crumbs.push(new crumb(player.x - Math.cos(player.dir) * 24, player.y - Math.sin(player.dir) * 24, dir, (1 + (Math.random() / 3)) * 200, (1 + (Math.random() / 3)) * 100))
    };
}

function moveCrumbs() {
    for (let key = crumbs.length - 1; key >= 0; key--) {
        if (crumbs[key].moveDur > 0) {
            crumbs[key].moveDur--;
            crumbs[key].x += crumbs[key].moveDur / 70 * Math.cos(crumbs[key].dir);
            crumbs[key].y += crumbs[key].moveDur / 70 * Math.sin(crumbs[key].dir);

        } else {
            crumbs[key].dur--;
            if (crumbs[key].dur > 0) {
                ducklingLoop: for (let duck in ducklings) {
                    let growthMult = 8 + ((48 * ducklings[duck].growth / 100) / 4);
                    if (Distance(ducklings[duck].x, ducklings[duck].y, crumbs[key].x, crumbs[key].y) < 5 + growthMult) {
                        crumbs.splice(key, 1);
                        ducklings[duck].growth += 10;
                        if (!audioMuted) {
                            chickEatAudio.pause();
                            chickEatAudio.currentTime = 0;
                            chickEatAudio.play();
                        }
                        ducklings[duck].target = null;
                        break ducklingLoop;

                    }
                }
            }
            else {
                crumbs.splice(key, 1);
            }

        }
    }
}

function createDiv(id, className, w, h, t, l, mL, mT, abs) {
    let tmpDiv = document.createElement("div");
    tmpDiv.style.width = w;
    tmpDiv.style.height = h;
    tmpDiv.style.marginTop = mT;
    tmpDiv.style.marginLeft = mL;
    tmpDiv.id = id;
    tmpDiv.className = className;
    if (abs) {
        tmpDiv.style.position = "absolute";
    }
    return tmpDiv;
}

function createCanvas(w, h, mL, mT, id, className, L, T, abs) {

    let tmpCnv = document.createElement("canvas");
    tmpCnv.id = id;
    tmpCnv.className = className;
    tmpCnv.width = w;
    tmpCnv.height = h;
    tmpCnv.style.marginTop = mT + "px";
    tmpCnv.style.marginLeft = mL + "px";
    if (abs) {
        tmpCnv.style.position = "absolute";
    }
    return tmpCnv;
}
var dummyContext = document.createElement("canvas");

function hslToRgbString(h, s, l, a) {
    // a = a || 1;
    a = Math.floor(a * 100) / 100;
    dummyContext.fillStyle = 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ' )';
    //str = (String) dummyContext.fillStyle;
    return dummyContext.fillStyle;
}
var shapeMons = 5;

function getColor(n, a) {


    let h = n * 5 + Math.floor((n * 5) / shapeMons) * 55 + Math.floor(n * 5 / 100) * 30;
    let s = 3 * 50 + n * 5 - Math.floor(n * 5 / 5); //Math.floor(n/10);
    let l = 65 - n * 5 * 5 + Math.floor(n * 5 / 5) * 25; //Math.floor(n/10);
    return hslToRgbString(h, s, l, a);

}

function Distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function angle(p1x, p1y, p2x, p2y) {

    return Math.atan2(p2y - p1y, p2x - p1x);

}


function createQuestWindow(quest) {
    let wrapper = document.createElement("Div");
    wrapper.className = "questWrapper";

    let title = document.createElement("span");
    title.className = "questTitle";
    title.innerHTML = "Title";

    wrapper.appendChild(title);

    let descr = document.createElement("span");
    descr.className = "questDescription";
    descr.innerHTML = "Do that and that!";

    wrapper.appendChild(descr);

    let innerWrapper = document.createElement("Div");

    let skip = document.createElement("span");
    skip.className = "questSkip";
    skip.innerHTML = "Skip";

    let bar = document.createElement("div");
    bar.className = "questBar";

    let barProg = document.createElement("div");
    barProg.className = "questBarProgress";
    barProg.innerHTML = "4 / 5";

    bar.appendChild(barProg);

    let reward = document.createElement("div");
    reward.className = "questReward";
    reward.innerHTML = "100GP";

    innerWrapper.appendChild(skip);
    innerWrapper.appendChild(bar);
    innerWrapper.appendChild(reward);

    wrapper.appendChild(innerWrapper);

    document.getElementById("Quests").appendChild(wrapper);

    document.getElementById("Quests").style.height = "auto";

}