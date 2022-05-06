const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
var engine, world, ground;
var angle;
var balls = [];
var boats = [];
var ifGameOver = false;
var isLaughing = false;
var score = 0;
//variables for boat animation
var boatAnimation = [];
var boatSheet;
var boatData;
//variables for broken boat animation
var breakAnimation = [];
var breakSheet;
var breakData;
//variables for splash animation
var splashAnimation = [];
var splashSheet;
var splashData;
//loading sound affects on variables
var backgroundMusic;
var cannonSound;
var cannonSplash;
var loseSound;

function preload() {
  backgroundImg = loadImage("assets/background.gif");
  towerImg = loadImage("assets/tower.png");

  boatSheet = loadImage("assets/boat/boat.png");
  boatData = loadJSON("assets/boat/boat.json");

  breakSheet = loadImage("assets/boat/brokenBoat.png");
  breakData = loadJSON("assets/boat/brokenBoat.json");

  splashSheet = loadImage("assets/waterSplash/waterSplash.png");
  splashData = loadJSON("assets/waterSplash/waterSplash.json");

  cannonSplash = loadSound("assets/cannon_water.mp3");
  loseSound = loadSound("assets/pirate_laugh.mp3");
  cannonSound = loadSound("assets/cannon_explosion.mp3");
  backgroundMusic = loadSound("assets/background_music.mp3");
}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  
  options = {
  isStatic:true
  }
 
  ground = Bodies.rectangle(0,height-1, width*2, 1, options);
  World.add(world, ground);
  tower = Bodies.rectangle(140, 350, 150, 300, options);
  World.add(world, tower);
  angleMode(DEGREES);
  angle = 15;

  cannon = new Cannon(170, 120, 100, 100, angle);
  //cannon = new Cannon(50, 30, 200, 200, angle);

  //exstracting the images from the boat/break/splash sheet one by onr using a for loop and pushing them into a empty array
  var boatFrames = boatData.frames;
  for(var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var breakFrames = breakData.frames;
  for(var i = 0; i< breakFrames.length; i++) {
    var pos = breakFrames[i].position;
    var img = breakSheet.get(pos.x, pos.y, pos.w, pos.h);
    breakAnimation.push(img);
  }

  var splashFrames = splashData.frames;
  for(var i = 0; i< splashFrames.length; i++) {
    var pos = splashFrames[i].position;
    var img = splashSheet.get(pos.x, pos.y, pos.w, pos.h);
    splashAnimation.push(img);
  }
  //console.log(splashFrames);
}

function draw() {
  background(189);
  Engine.update(engine);

  image(backgroundImg, 0, 0, 1200, 600);
  text("Score: " + score, 10, 30);
  fill("black");
  textSize(20);
  if(!backgroundMusic.isPlaying()) {
    backgroundMusic.play();
    backgroundMusic.setVolume(0.3);
  }
  push();
  imageMode(CENTER);
  image(towerImg, tower.position.x, tower.position.y, 150, 300);
  pop();

  push();
  fill("blue");
  noStroke();
  rect(ground.position.x, ground.position.y,width*2,1);
  pop();

  //exstracting the cannon balls one by one from the ball array using a for loop and then displaying them on the screen
  for(i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionWithBoat(i);
  }

  cannon.display();
  showBoats();
}

function collisionWithBoat(index) {
  for(var i = 0; i < boats.length; i++) {
    if(balls[index] !== undefined && boats[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);
      if(collision.collided) {
        if(!boats[i].isBroken && !balls[index].isSink) {
          score = score + 10;
        }
        World.remove(world, balls[index].body);
        delete balls[index];
        boats[i].remove(i);
      }
    }
  }
}

function showCannonBalls(ball, i) {
  if(ball) {
    ball.display();
    if(ball.body.position.x >= width + 20 || ball.body.position.y >= height - 50) {
      if(!ball.isSink) {
        cannonSplash.play();
        cannonSplash.setVolume(0.7);
        ball.remove(i);
      }
    }
  }
}

function showBoats() {
  if(boats.length > 0) {
    if(boats[boats.length - 1] == undefined || 
      boats[boats.length - 1].body.position.x < width - 300) {
        var positions = [-20, -40, -60, -70]
        var position = random(positions);
        boat = new Boat(width - 100, height - 50, 150, 150, position, boatAnimation);
        boats.push(boat);
    }
    //exstracting the boats one by one from the boats array using a for loop and displaying them
    for(i = 0; i < boats.length; i++) {
      if(boats[i]) {
        Body.setVelocity(boats[i].body, {x: -1, y: 0});
        boats[i].animate();
        boats[i].display();
        //detecting collision between unbroken boats and tower
        var collision = Matter.SAT.collides(tower, boats[i].body);
        if(collision.collided && !boats[i].isBroken) {
          if(!isLaughing && !loseSound.isPlaying()) {
            loseSound.play();
            loseSound.setVolume(0.5);
            isLaughing = true;
          }
          ifGameOver = true;
          gameOver();
        }
      }
    }
  }
  else {
    boat = new Boat(width - 100, height - 50, 150, 150, -80, boatAnimation);
    boats.push(boat);
  }
}

function gameOver() {
  swal({
    title: "Game Over!!",
    text: "the boat reached your tower",
    imageUrl: "https://i.pinimg.com/474x/66/70/f8/6670f813e6666377d99b8e1b6143d059.jpg",
    imageSize: "200x200",
    confirmButtonText: "Play Again"
  },
  function(isConfirm) {
    if(isConfirm) {
      location.reload();
    }
  }
  )
}

function keyPressed() {
  if(keyCode == DOWN_ARROW) {
    cannonBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonBall);
  }
}
function keyReleased() {
  if(keyCode == DOWN_ARROW) {
    balls[balls.length - 1].shoot();
    cannonSound.play();
  }
}
