var mainCanvas=null;
var ctx =null;
var bgCanvas=null;
var ctxBG =null;
var gameBoard=null;
var hlfSize = 0;
var qrtSize = 0;
var paused=false;
var lastTick = 0;
var ticker = 0;
var doneTicks=0;
var tickSpeed=10;
var Player = null;
var muted=false;
var highscore=0;
var newHighscore=false;
var gameBoard =[
    [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
    [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
    [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
    [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
    [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
    [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
    [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
    [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
    [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0],
    [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0]
];

var bgAudio = new Audio("sounds/bgAudio2.mp3");
var quackAudio = new Audio("sounds/quack.mp3");
var quackQuackAudio = new Audio("sounds/quackQuack.mp3");
quackAudio.volume = 0.4;
quackQuackAudio.volume = 0.4;
bgAudio.playbackRate = 0.7;
var snapAudio = new Audio("sounds/snap.mp3");
snapAudio.volume=0.5;


var doneTicks = 0;
$(".menuButton").on("mouseenter",function() {
    if (!muted) {

        //quackQuackAudio.play();
    }
})
$(".muteButton").on("click",function() {
    if ($(this).hasClass("disabled")) {
        $(this).removeClass("disabled");
    } else {
        $(this).addClass("disabled");
    }
})
function showInstructions() {
    $('#instructions').css('display','block');
}
function hideInstructions() {
    $('#instructions').css('display','none');
}
function hideFirstTime() {
    $('#firstTime').css('display','none');
}
function showCredits() {
    $('#credits').css('display','block');
}
function hideCredits() {
    $('#credits').css('display','none');
}
function mainMenu() {
    $("#mainMenu").css("display","block");
    $("#pauseButton").css("display","none");
    $("#gameOver").css("display","none");
}
function restart() {
    paused=false;
    crocodiles=[];
    ducklings=[];
    ducklingOnMap=false;
    totalEaten=0;
    raised = 0;
    totalDucklings=0;
    longestChain=0;
    player.x = width/2 - 34;
    player.y = height/2 - 34;
    player.dir = Math.PI;
    player.path=[];
    dead=false;
    Points=0;
    $("#gameOver").css("display","none");
    $("#pauseButton").css("display","block");
    $("#mainMenu").css("display","none");


}
function start() {
    console.log(234);
    dead=true;
    if (window.localStorage.getItem(("highScore"))) {
        highscore = window.localStorage.getItem("highScore");
    }
    if (!window.localStorage.getItem("playedBefore")) {
        $("#firstTime").css("display","block");
        try{

        window.localStorage.setItem("playedBefore",true);
        }catch(e) {
            console.error(e);
        }
    }
    width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth / 1;
    height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
    width = Math.floor(width);
    height = Math.floor(height);
    $("body").css("width",width);
    $("body").css("height",height);
    hlfSize = Math.floor(Math.min(width,height)/2);
    qrtSize = Math.floor(hlfSize/2);

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

    document.addEventListener("keydown",keyDownMine);
    document.addEventListener("keyup",keyUpMine);
    mainCanvas=document.getElementById("undefined");
    bgCanvas=document.getElementById("bg");

    ctxBG = bgCanvas.getContext("2d");

    player = new Player(width/2,height/2,Math.PI/2,100);

    if (!audioMuted) {
        bgAudio.play();
    }

    tick();

}

var symbolSpriteSheet;
function oneSpriteItem(name,x,y,w,h)  {
    this.name=name;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
}
function makeJSONLine(oneSprite) {
    let str = '"';
    str+=oneSprite.name;
    str+='":';
    str+="			";
    str+="{";
    str+='"'+"x"+'":'+oneSprite.x+',';
    str+='"'+"y"+'":'+oneSprite.y+',';
    str+='"'+"w"+'":'+oneSprite.w+',';
    str+='"'+"h"+'":'+oneSprite.h+'}';
    return str;
}
function makeJSONFile(arr) {
    let str = "{";
    for (let key=0;key<arr.length;key++) {
        if(key!=0){
            str+=",";
        }
        str += 	makeJSONLine(new oneSpriteItem(
            arr[key].getAttribute("name"),
            arr[key].getAttribute("x"),
            arr[key].getAttribute("y"),
            arr[key].getAttribute("width"),
            arr[key].getAttribute("height")
        ));
    }
    str+="}";
    return str;
}
var images={
    duck:null,
};

function loadImges() {
    images.duck = new Image();
    images.duck.src = "img/Duck2.png";
    images.duck.onload = function() {
        checkReadImages();
    }
    images.bow= new Image();
    images.bow.src = "img/Bow.png";
    images.bow.onload = function() {
        checkReadImages();
    }

    for (let i = 0; i <= 7; i++) {
        images["DuckSwim"+i] = new Image();
        images["DuckSwim"+i].src = "img/DuckSwim"+i+".png";
        images["DuckSwim"+i].onload = function() {
            checkReadImages();
        }
    }
    for (let i = 0; i<= 3; i++) {
        images["DuckIdle"+i] = new Image();
        images["DuckIdle"+i].src = "img/DuckIdle"+i+".png";
        images["DuckIdle"+i].onload = function() {
            checkReadImages();
        }
    }
    for (let i = 0; i<=7;i++) {
        images["Crocodile"+i] = new Image();
        images["Crocodile"+i].src = "img/Crocodile"+i+".png";
        images["Crocodile"+i].onload = function() {
            checkReadImages();
        }
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
    images.heart= new Image();
    images.heart.src = "img/heart3.png";
    images.heart.onload = function() {
        checkReadImages();
    }

}
loadImges();
function assignSymbolSpriteSheetImages(e) {
    for (let key in e) {
        images[key]=e[key];
    }
    checkReadImages();
}
var imagesToLoad=25;
function checkReadImages() {
    imagesToLoad--;
    if (!imagesToLoad) {

        start();

    }
}
function tick(restart) {
    var now = window.performance.now(); // current time in ms

    if (restart) {
        $("#mainMenu").css("display","none");
        $("#gameOver").css("display","none");
        lastTick=now;
    }
    var deltaTime = now - lastTick; // amount of time elapsed since last tick

    lastTick = now;


    ticker += deltaTime;



    doneTicks = 0;

    drawGame();
    while (ticker > tickSpeed && doneTicks < 100000) {
        ticker -= tickSpeed;
        ///doneTicks++;
        if (moved) {

                readyToSpawn=true;

                moved=false;

        }

        step();

    }
    if (!paused) {
        theLoop = window.requestAnimationFrame(function() {
            tick(false);
        });
    } else {
        theLoop=null;
    }

}
var crocodiles=[];
function drawGame() {
    ctxBG.clearRect(0,0,width,height);
    drawBg();
    drawPlayerTrail();
    drawCrocodiles();
    drawDucklings();
    drawGoingAway();
    drawPlayer();
    drawEnemies();
    drawHeart();
    drawPointIncreases();
    drawMenu();

}
function getMult() {
    return Math.ceil(ducklings.length*ducklings.length*0.2);
}
var totalDucklings=0;
var longestChain=0;
var lastChicks=0;
var curFontSize= 25;
var curBlue = 255;
var curGreen = 255;
var curRed = 255;
function drawMenu() {
    if(dead) {
        return;
    }
    ctxBG.font = "25px 'Ranchers', cursive";
    ctxBG.fillStyle = "rgba("+curRed+","+curGreen+","+curBlue+",0.8)";
    if (lastChicks < ducklings.length) {
        curRed = 0;
        curBlue = 0;
        curGreen = 255;
        lastChicks = ducklings.length;
        ctxBG.font = "50px 'Ranchers', cursive";
        curFontSize = 50;
    } else if (lastChicks > ducklings.length){
        curGreen = 0;
        curBlue = 0;
        curRed = 255;
        lastChicks = ducklings.length;
        ctxBG.font = "5px 'Ranchers', cursive";
        curFontSize = 5;
    } else {
        if (curBlue < 255) {
            curBlue+=5;
        }
        if (curRed < 255) {
            curRed+=5;
        }
        if (curGreen < 255) {
            curGreen+=5;
        }

        ctxBG.font = Math.max(25,curFontSize-1)+"px 'Ranchers', cursive";
        if (curFontSize>25) {
            curFontSize--;
        } else if (curFontSize< 25) {
            curFontSize+=0.2;
        }
    }

    if (ducklings.length==1) {
        ctxBG.fillText(ducklings.length + " Duckling!",100,100);
    } else {
        ctxBG.fillText(ducklings.length + " Ducklings!",100,100);
        if (getMult()>1) {
            ctxBG.font="15px 'Ranchers', cursive";
            ctxBG.fillText("(" + "x"+ (getMult()+1) +" Bonus)",100,100+curFontSize);
        }
    }
    if (raised > 0) {
        ctxBG.fillStyle="rgba(255,255,255,1)";
        ctxBG.font = "25px 'Ranchers', cursive";
        ctxBG.fillText(raised + " Ducklings Raised!",width/2-50,100);
    }
    if (lastPoints>Points) {
        if (lastPoints-Points > 10000000) {
            lastPoints-=10000000;
        } else if (lastPoints-Points > 100000) {
            lastPoints-=100000;
        } else if (lastPoints-Points > 1000) {
            lastPoints-=1000;
        } else if (lastPoints-Points > 10) {
            lastPoints-=10;
        } else {
            lastPoints--;
        }
        curFontSize = 10;
    } else if (lastPoints<Points) {
        if (Points - lastPoints > 10000000) {
            lastPoints+=10000000;
        } else if (lastPoints-Points > 100000) {
            lastPoints+=100000;
        } else if (lastPoints-Points > 1000) {
            lastPoints+=1000;
        } else if (lastPoints-Points > 10) {
            lastPoints+=10;
        } else {
            lastPoints++;
        }
        curFontSize = 50;
    } else {
        if (curFontSize < 25) {
            curFontSize+=0.2;
        } else if (curFontSize > 25) {
            curFontSize-=0.2;
        }
        if (Math.abs(curFontSize-25)<0.3) {
            curFontSize = 25;
        }

    }
    ctxBG.font = 25+"px 'Ranchers', cursive";
    ctxBG.fillStyle = "rgba(255,255,255,0.8)";

    ctxBG.fillText("Points: " +lastPoints,width-150,100);

}
var paused=false;
function pause() {
    if (paused) {
        paused=false;
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
    ctxBG.strokeStyle = "rgba(255,255,255,0.2)";
    ctxBG.lineWidth = "17";
    ctxBG.fillStyle = "rgba(255,255,255,0.4)";
    let curX = player.x;
    let curY = player.y;
    for (let key = player.path.length-1;key >= 0 ;key--) {

        ctxBG.strokeStyle = "rgba(255,255,255,"+ player.path[key][2]/400 +")";
        ctxBG.beginPath();
        ctxBG.lineCap = 'butt';
        ctxBG.moveTo(curX,curY);
        ctxBG.lineTo(player.path[key][0],player.path[key][1]);

        ctxBG.stroke();
        curX = player.path[key][0];
        curY = player.path[key][1];
    }
}
function drawPlayer() {
    if (dead) {
        return;
    }

//    ctxBG.lineCap = 'round';

    let im;
    playerAnimationTick++;
    if (playerAnimationTick>5 - Math.max(0,Math.log(ducklings.length))){
        playerAnimationTick=0;
        player.animation++;
    }
    if (player.accX != 0 || player.accY != 0 || upClicked || downClicked ) {
        im = images["DuckSwim"+(1+player.animation%7)];
    } else {
        im = images["DuckIdle"+(1+player.animation%3)]
    }
    ctxBG.save();
    ctxBG.translate(player.x,player.y);
    ctxBG.rotate(player.dir-Math.PI*0.5);
    ctxBG.drawImage(im,0,0,128,128,0-32,0-32,64,64);
    ctxBG.restore();
}
var ducklings = [];
function drawCrocodiles() {
    for (let key in crocodiles) {
        if (crocodiles[key].eaten ) {
            crocodiles[key].eaten=false;
            crocodiles[key].animation=1;
        }
        if (crocodiles[key].animation>=1) {
            crocodiles[key].animation++
        }
        if (crocodiles[key].animation>7) {
            crocodiles[key].animation=0;
        }
        ctxBG.save();
        ctxBG.translate(crocodiles[key].x,crocodiles[key].y);
        ctxBG.rotate(crocodiles[key].dir-Math.PI*0.5);
        ctxBG.drawImage(images["Crocodile"+crocodiles[key].animation],0,0,128,512,-32,-32,64,256);
        ctxBG.restore();
    }
}
var goingAway=[];
function moveGoingAway() {
    for (let key=goingAway.length-1;key>=0;key--) {
        goingAway[key].x -= 5 * Math.cos(goingAway[key].dir);
        goingAway[key].y -= 5 * Math.sin(goingAway[key].dir);
        if (goingAway[key].x > width + 64 || goingAway[key].x < -64 || goingAway[key].y > height+ 64 || goingAway[key].y < -64 ) {
            goingAway.splice(key,1);
        }
    }
}
function drawGoingAway() {
    for (let key in goingAway) {
        ctxBG.save();
        ctxBG.translate(goingAway[key].x,goingAway[key].y);
        ctxBG.rotate(goingAway[key].dir-Math.PI*0.5);
        ctxBG.drawImage(images.DuckSwim0,0,0,128,128,-32,-32,64,64);
        ctxBG.restore();
    }
}
function drawDucklings() {
    if (ducklingOnMap) {
        ctxBG.save();
        ctxBG.translate(ducklingOnMap.x,ducklingOnMap.y);
        ctxBG.rotate(ducklingOnMap.dir-Math.PI*0.5);
        ctxBG.drawImage(images["DuckSwim"+ducklingOnMap.animation],0,0,128,128,-32,-32,64,64);
        //ctxBG.drawImage(images["bow"],0,0,128,128,-32,-32,64,64);
        ctxBG.restore();

    }
    for (let key in ducklings) {
        ctxBG.save();
        ctxBG.translate(ducklings[key].x,ducklings[key].y);
        ctxBG.rotate(ducklings[key].dir-Math.PI*0.5);
        let growthMult = 32*ducklings[key].growth/100;
        ctxBG.drawImage(images.duckling,0,0,128,128,-32-growthMult/2,-32-growthMult/2,64+growthMult,64+growthMult);
        ctxBG.restore();
    }
}
var ducklingOnMap=false;
function spawnDuckling() {
    ducklingOnMap = (new duckling(Math.random()*width,Math.random()*height,Math.random()*Math.PI));
}
function spawnDuckGirl() {
    let x,y,dir;
    if (Math.random()>0.5) {
        if (Math.random()>0.5) {
            x = -64;
            y = Math.random() * height;
            if (Math.random() > 0.5) {
                dir = Math.PI *   0.5 + Math.random() * (0.5 * Math.PI);
            } else {
                dir = Math.PI *(-0.5) - Math.random() * 0.5 * Math.PI;
            }
        } else {
            x = width + 64
            y = Math.random() * height;
            dir = Math.random() * (0.5 * Math.PI) - Math.random() * 0.5 * Math.PI;
        }
    } else {
        if (Math.random()>0.5) {
            x = Math.random() * width;
            y = -64;
            dir = Math.random() * (-Math.PI);
        } else {
            x = Math.random() * width;
            y = height+ 64;
            dir = Math.random() * (Math.PI);

        }
    }
    ducklingOnMap = (new duckling(x,y,dir));

}
function spawnCrocodile() {
    let x,y,dir;
    if (Math.random()>0.5) {
        if (Math.random()>0.5) {
            x = -64;
            y = Math.random() * height;
            if (Math.random() > 0.5) {
                dir = Math.PI *   0.5 + Math.random() * (0.5 * Math.PI);
            } else {
                dir = Math.PI *(-0.5) - Math.random() * 0.5 * Math.PI;
            }
        } else {
            x = width + 64
            y = Math.random() * height;
            dir = Math.random() * (0.5 * Math.PI) - Math.random() * 0.5 * Math.PI;
        }
    } else {
        if (Math.random()>0.5) {
            x = Math.random() * width;
            y = -64;
            dir = Math.random() * (-Math.PI);
        } else {
            x = Math.random() * width;
            y = height+ 64;
            dir = Math.random() * (Math.PI);

        }
    }

    crocodiles.push(new crocodile(x,y,dir));
}
var duckling = function(x,y,dir) {
    this.x=x;
    this.y=y;
    this.dir=dir;
    this.growth=0;
    this.animation=0;
}
var crocodile = function(x,y,dir) {
    this.x=x;
    this.y=y;
    this.dir=dir;
    this.animation=0;
    this.eaten=false;
}
function drawEnemies() {

}
function collides(obj1,size1,obj2,size2) {
    if (Distance(obj1.x,obj1.y,obj2.x,obj2.y)<(size1+size2)/2) {
        return true;
    }
    return false;
}
var Player = function(x,y,dir,health) {
    this.x=x;
    this.y = y;
    this.dir = dir;
    this.health = health;
    this.path=[];
    this.accX=0;
    this.accY=0;
    this.rotAcc=0;
    this.speedX=0;
    this.speedY=0;
    this.animation=0;
}
function step() {
    movePlayer();
    moveGoingAway();
    moveDucklings();
    moveCrocodiles();
    moveEnemies(); //
    updateGame(); //check death, check pikcups,
}
function findSideToTurn(ang1,ang2) {


    let dif = ang1 - ang2;
    if (dif < 0) {
        dif+=Math.PI*2;
    }
    if (dif>Math.PI) {

        return -1;
    }  else {

        return 1;
    }

}

function moveCrocodiles() {
    for (let key = crocodiles.length-1; key >= 0; key--) {
        crocodiles[key].x -= Math.cos(crocodiles[key].dir);
        crocodiles[key].y -= Math.sin(crocodiles[key].dir);
        if (crocodiles[key].x > width+256) {
            crocodiles.splice(key,1);
        } else if (crocodiles[key].x < -256) {
            crocodiles.splice(key,1);
        } else if (crocodiles[key].y > height+256) {
            crocodiles.splice(key,1);
        } else if (crocodiles[key].y < -256) {
            crocodiles.splice(key,1);
        }
    }
}
var raised=0;
ducklingAnimationTicker=0;
ducklingAnimationTick=5;
function moveDucklings() {
    if (ducklingOnMap) {
        ducklingOnMap.x -= Math.cos(ducklingOnMap.dir);
        ducklingOnMap.y -= Math.sin(ducklingOnMap.dir);
        ducklingAnimationTicker++;
        if(ducklingAnimationTicker>ducklingAnimationTick) {
            ducklingAnimationTicker=0;
            ducklingOnMap.animation = (ducklingOnMap.animation+1)%7 ;
        }
        if (ducklingOnMap.x > width+64) {
            ducklingOnMap=null;
        } else if (ducklingOnMap.x < -64) {
            ducklingOnMap=null;
        } else if (ducklingOnMap.y > height+64) {
            ducklingOnMap=null;
        } else if (ducklingOnMap.y < -64) {
            ducklingOnMap=null;
        }
        // let angl = angle(ducklingOnMap.x,ducklingOnMap.y,player.x,player.y);
        // angl -= Math.PI;
        // if (angl < Math.PI*(-1)) {
        //     angl+=Math.PI*2;
        // }
        // if (ducklingOnMap.dir > Math.PI) {
        //     ducklingOnMap.dir -= Math.PI*2;
        // }
        // if (ducklingOnMap.dir < -1 * Math.PI) {
        //     ducklingOnMap.dir += Math.PI*2;
        // }
        //
        // if (Math.abs(ducklingOnMap.dir - angl) > 0.05) {
        //     if (findSideToTurn(angl,ducklingOnMap.dir)>0) {
        //         ducklingOnMap.dir= ((ducklingOnMap.dir + 0.01));
        //     } else {
        //         ducklingOnMap.dir= ((ducklingOnMap.dir - 0.01));
        //     }
        //
        // }

    }
    if (ducklings.length>0) {
        let playerTailX = player.x + 34 * Math.cos(player.dir);
        let playerTailY = player.y + 34 * Math.sin(player.dir);
        if (Distance(ducklings[0].x,ducklings[0].y,player.x,player.y) > 56) {
            let angl = angle(ducklings[0].x,ducklings[0].y,playerTailX,playerTailY);
            angl -= Math.PI;
            if (angl < Math.PI*(-1)) {
                angl+=Math.PI*2;
            }
            if (ducklings[0].dir > Math.PI) {
                ducklings[0].dir -= Math.PI*2;
            }
            if (ducklings[0].dir < -1 * Math.PI) {
                ducklings[0].dir += Math.PI*2;
            }

            if (Math.abs(ducklings[0].dir - angl) > 0.05) {
                if (findSideToTurn(angl,ducklings[0].dir)>0) {

                    ducklings[0].dir= ((ducklings[0].dir + 0.05));
                } else {

                    ducklings[0].dir= ((ducklings[0].dir - 0.05));
                }

            }

            ducklings[0].x += 2 * Math.cos(ducklings[0].dir-Math.PI);
            ducklings[0].y += 2 * Math.sin(ducklings[0].dir-Math.PI);

            ducklings[0].growth+=0.04;
        }

        for (let key = 1; key < ducklings.length; key++) {
            let playerTailX = ducklings[key-1].x + 34 * Math.cos(ducklings[key-1].dir);
            let playerTailY = ducklings[key-1].y + 34 * Math.sin(ducklings[key-1].dir);
            if (Distance(ducklings[key].x,ducklings[key].y,ducklings[key-1].x,ducklings[key-1].y) > 34) {
                let angl = angle(ducklings[key].x,ducklings[key].y,playerTailX,playerTailY);
                angl -= Math.PI;
                if (angl < Math.PI*(-1)) {
                    angl+=Math.PI*2;
                }
                if (ducklings[key].dir > Math.PI) {
                    ducklings[key].dir -= Math.PI*2;
                }
                if (ducklings[key].dir < -1 * Math.PI) {
                    ducklings[key].dir += Math.PI*2;
                }


                    if (findSideToTurn(angl,ducklings[key].dir)>0) {

                        ducklings[key].dir= ((ducklings[key].dir + 0.1));
                    } else {

                        ducklings[key].dir= ((ducklings[key].dir - 0.1));
                    }



                ducklings[key].x += 2 * Math.cos(ducklings[key].dir-Math.PI);
                ducklings[key].y += 2 * Math.sin(ducklings[key].dir-Math.PI);
                ducklings[key].growth+=0.04;

            }
        }
        for (let key = ducklings.length-1;key>=0;key--) {
            if (ducklings[key].growth >= 100) {
                goingAway.push(ducklings[key]);
                raised++;
                if (!audioMuted) {
                    try {
                        quackAudio.pause();
                        quackAudio.currentTime=0;
                        quackAudio.play();

                    }  catch(e) {

                    }

                }
                increasePoints(25*(1+raised)*Math.max(1,ducklings.length),getMult());
                ducklings.splice(key,1);
                continue;
            }
            crocLoop:
            for (let croc in crocodiles) {
                if (Distance(ducklings[key].x,ducklings[key].y,crocodiles[croc].x,crocodiles[croc].y) < 32) {
                    totalEaten++;
                    crocodiles[croc].eaten=true;
                    ducklings.splice(key,1);
                    if (!dead) {

                    bgAudio.playbackRate = 0.7 + Math.ceil(10  * Math.log(Math.min(15,Math.max(1,ducklings.length)))/4)/10;
                    }
                    if (!audioMuted) {

                        try{
                            snapAudio.pause();
                            snapAudio.currentTime=0;
                            snapAudio.play();
                        } catch(e) {
                            console.error(e);
                        }
                    }
                    break crocLoop;
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
    quackTicker++;
    // if(quackTicker>= quackTick) {
    //     quackAudio.pause();
    //     quackAudio.currentTime = 0;
    //     quackAudio.play();
    //     quackTicker = 0;
    //     quackTick = Math.floor(Math.random() * 1000);
    // }
    player.rotAcc*=0.9;
    if (Math.abs(player.rotAcc) < 0.001) {
        player.rotAcc = 0;
    }
    player.accX*=0.95;
    if (Math.abs(player.accX) < 0.0001) {
        player.accX = 0;
    }
    player.accY*=0.95;
    if (Math.abs(player.accY) < 0.0001) {
        player.accY = 0;
    }
    if (upClicked) {

        player.accX -= 0.1 * (Math.log(Math.max(4,ducklings.length))/1.5) * Math.cos(player.dir);
        player.accY -= 0.1 * (Math.log(Math.max(4,ducklings.length))/1.5) * Math.sin(player.dir);
    }
    if (downClicked) {

        player.accX += 0.01 * Math.log(ducklings.length)/1.5 * Math.cos(player.dir);
        player.accY += 0.01 * Math.log(ducklings.length)/1.5 * Math.sin(player.dir);
    }
    if (leftClicked) {

        player.rotAcc-=0.004;
    }
    if (rightClicked) {

        player.rotAcc+=0.004;
    }

    player.dir += player.rotAcc;
    player.x += player.accX;
    player.y += player.accY;

    if (player.x < 34 ) {
        player.x = 34;
    }
    if (player.x > width-34) {
        player.x = width-34;
    }
    if (player.y < 34) {
        player.y = 34;
    }
    if (player.y > height - 34) {
        player.y = height-34;
    }

    if (player.path.length > 50) {
        player.path.splice(0,1);
    } else {
        if (player.accX != 0 || player.accY != 0 || player.rotAcc != 0) {
            pathTicker++;
            if(pathTicker > 10) {
                pathTicker=0;
                player.path.push([player.x+20 * Math.cos(player.dir),player.y+20 * Math.sin(player.dir),200]);
            }
        }

    }
    for (let key = player.path.length-1;key>=0;key--) {
        player.path[key][2]--;
        if(player.path[key][2]<=0) {
            player.path.splice(key,1);
        }
    }



        if (collides(player,64,ducklingOnMap,64)) {
            console.log("Colding");
            increasePoints(10,getMult());
            totalDucklings++;
            ducklings.push(ducklingOnMap);
            if (ducklings.length > longestChain) {
                longestChain = ducklings.length;
            }
            if(!dead) {

                bgAudio.playbackRate = 0.7 + Math.ceil(10  * Math.log(Math.min(15,Math.max(1,ducklings.length)))/4)/10;
            }
            spawnHeart((player.x+ducklingOnMap.x)/2,(player.y+ducklingOnMap.y)/2);
            ducklingOnMap=false;
            if (!audioMuted) {

                quackQuackAudio.play();
            }


        }
        for (let key in crocodiles) {

            if (collides(player,64,crocodiles[key],32)) {
                gameOver("Oh dear!</br> You were eaten by a Crocodile!");
                crocodiles[key].eaten=true;
            }
        }

}
var lastPoints=0;
var pointIncreases=[];
function increasePoints(am,mult) {
    Points+=am+Math.ceil(am*mult);
    pointIncreases.push(["+" + (am+am*mult),player.x,player.y,100, 15]);
    pointIncreases.push(["("+am+" * "+ (1+mult) + " = "+ (am+(am*mult)) + ")",player.x,player.y+20,100,13]);

}
function drawPointIncreases() {
    for (let key = pointIncreases.length-1;key>=0;key--) {
        pointIncreases[key][3]--;
        if (pointIncreases[key][3]<0) {
            pointIncreases.splice(key,1);
        } else {
            pointIncreases[key][2]--;
            ctxBG.fillStyle="rgba(255,255,255,"+pointIncreases[key][3]/100+")";
            ctxBG.font = pointIncreases[key][4]+"px 'Ranchers', cursive";
            ctxBG.fillText(pointIncreases[key][0],pointIncreases[key][1],pointIncreases[key][2]);
        }
    }
}
function muteMusic() {

        if (musicMuted) {
            musicMuted=false;
            bgAudio.play();
        } else {
            musicMuted = true;
            bgAudio.pause();
            bgAudio.currentTime = 0;
        }

}
var audioMuted=false;
var musicMuted = false;
function muteAudio() {
    if (audioMuted) {
        audioMuted=false;
    } else {
        audioMuted = true;
    }
}
var hearts=[];
var Points=0;
function spawnHeart(x,y) {
    hearts.push([x,y,100,1]);
}
function drawHeart() {
    for (let key = hearts.length-1;key>=0;key--) {
        hearts[key][2]--;
        if (hearts[key][2]<0) {
            hearts.splice(key,1);
        } else {
            let siz;

                ctxBG.globalAlpha = hearts[key][2]/100;

            siz = 128-64*(hearts[key][2]/100);
            ctxBG.drawImage(images.heart,0,0,128,128,hearts[key][0]-siz/2,hearts[key][1]-siz/2,siz,siz)
            ctxBG.globalAlpha=1;
        }

    }
}
var pathTicker = 0;
function moveEnemies() {

}
var dead = false;
var totalEaten=0;

function gameOver(msg) {
    dead = true;
    if (!audioMuted) {
        snapAudio.pause();
        snapAudio.currentTime = 0;
        snapAudio.play();
    }
    if (Points > highscore) {
        highscore = Points;
        try {
            window.localStorage.setItem("highScore",highscore);
        } catch(e) {
            console.error(e);
        }
        $("#highscore").html(highscore);
        $(".newHighscore").css("display","inline-block");
    } else {
        $(".newHighscore").css("display","none");
        $("#highscore").html(highscore);
    }
    $("#killMessage").html(msg);
    $("#scoreFinal").html(Points);
    $("#scoreCreated").html(totalDucklings);
    $("#scoreRaised").html(raised);
    $("#scoreEaten").html(totalEaten);
    $("#scoreLongestChain").html(longestChain);
    let survivalRate = Math.floor(1000*(((totalDucklings - totalEaten) / totalDucklings) * 100 ))/1000;
        if (isNaN(survivalRate)) {
        survivalRate=100;
        }
    $("#scoreSurvival").html(survivalRate+ "%");
    $("#gameOver").css("display","block");
    $("#pauseButton").css("display","none");
    $("#killMessage").animate({
        "font-size": 20,
        height: "10%"
    },2500);

}
var spawnTicker = 0;
var spawnTick = 500;
function updateGame() {
    if (!ducklingOnMap) {
        //spawnDuckling();
        spawnDuckGirl();
    }
    spawnTicker++;
    if (spawnTicker > spawnTick) {
        spawnTick = Math.floor(Math.max(200,500 - ducklings.length * ducklings.length * 10));
        spawnTicker=0;
        spawnCrocodile();
    }
    for (let key in ducklings) {

    }

    if(bgAudio.ended && !musicMuted) {
        bgAudio.pause();
        bgAudio.currentTime = 0;
        bgAudio.play();
    }
}


var moveSpeed=0.5;
var tileSize;
var margin;



function roundRect(ctx, x, y, width, height, radius, fill, stroke, fs,ss,lw) {
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
    ctx.strokeStyle=ss;
    ctx.lineWidth=lw;
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
function spawnRandom(board,lv) {
    let rndPos = board.returnEmpty();
    if (rndPos) {
        addTile(board.Board,lv,rndPos[1],rndPos[0]);
    }
}
function addTile(board,lv,x,y) {
    board[y][x] = new piece(lv,x,y);
}
function clickBoard() {

}
var disToDraw= [];
var moved = false;
var anyMerge=false;

var leftClicked=false;
var rightClicked=false;
var upClicked=false;
var downClicked=false;
function keyUpMine(e) {
    if (e.key=="ArrowDown" ) {
        console.log("down");
        downClicked=false;

    } else if (e.key == "ArrowUp") {
        console.log("up");
        upClicked=false;

    } else if (e.key == "ArrowLeft") {
        console.log("left");
        leftClicked=false;

    } else if (e.key == "ArrowRight") {
        console.log("right");
        rightClicked=false;

    }
}
function keyDownMine(e) {

    if (e.key=="ArrowDown" && !moved) {

        downClicked=true;
        moved=true;
    } else if (e.key == "ArrowUp" && !moved) {

        upClicked=true;
        moved=true;
    } else if (e.key == "ArrowLeft" && !moved) {

        leftClicked=true;
        moved=true;
    } else if (e.key == "ArrowRight" && !moved) {

        rightClicked=true;
        moved=true;
    }
}
function createDiv(id,className,w,h,t,l,mL,mT,abs) {
    let tmpDiv = document.createElement("div");
    tmpDiv.style.width = w;
    tmpDiv.style.height = h;
    tmpDiv.style.marginTop = mT;
    tmpDiv.style.marginLeft = mL;
    tmpDiv.id=id;
    tmpDiv.className=className;
    if(abs) {
        tmpDiv.style.position = "absolute";
    }
    return tmpDiv;
}
function createCanvas(w,h,mL,mT,id,className,L,T,abs) {

    let tmpCnv = document.createElement("canvas");
    tmpCnv.id=id;
    tmpCnv.className=className;
    tmpCnv.width = w;
    tmpCnv.height = h;
    tmpCnv.style.marginTop = mT+"px";
    tmpCnv.style.marginLeft = mL+"px";
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


    let h = n*5 + Math.floor((n*5) / shapeMons) * 55 + Math.floor(n*5 / 100) * 30;
    let s = 3*50 + n*5 - Math.floor(n*5 / 5); //Math.floor(n/10);
    let l = 65 - n*5 * 5 + Math.floor(n*5 / 5) * 25; //Math.floor(n/10);
    return hslToRgbString(h, s, l, a);

}
function Distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}
function angle(p1x, p1y, p2x, p2y) {

    return Math.atan2(p2y - p1y, p2x - p1x);

}
