var monkey, monkey_running;
var banana, bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var ground, groundImage;
var score = 0;
var jungle, jungleImage;
var PLAY = 1,
    END = 0;
var gameState = PLAY;
var hit = false;


function preload() {
  //loading the images and animation for the game
  monkey_running = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");

  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("stone.png");

  jungleImage = loadImage("jungle.jpg");
}


function setup() {
  createCanvas(500, 400);

  jungle = createSprite(250, 200, 1200, 400);
  jungle.addImage(jungleImage);

  //creating the sprite for monkey and adding animation
  monkey = createSprite(80, 315, 20, 30);
  monkey.addAnimation("running", monkey_running);
  monkey.scale = 0.16;
  //monkey.debug=true;
  monkey.setCollider("rectangle", 0, 0, 100, monkey.height);

  //creating ground
  ground = createSprite(200, 370, 800, 10);
  ground.x = ground.width / 2;
  ground.visible = false;

  FoodGroup = createGroup();
  obstacleGroup = createGroup();
}
//

function draw() {
  background("white");

  if (gameState === 1) {
    //resetting the background when it crosses halfway
    jungle.velocityX = -5.5;
    if (jungle.x < 0) {
      jungle.x = 250;
    }

    //resetting the ground when it crosses halfway 
    ground.velocityX = -5.5;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    monkey.collide(ground);
    //adding gravity
    monkey.velocityY = monkey.velocityY + 0.8;

    //Making the monkey jump when space key is pressed
    if (keyDown("space") && monkey.y >= 225) {
      monkey.velocityY = -15;
    }

    if (FoodGroup.isTouching(monkey)) {
      score = score + 2;
      FoodGroup.destroyEach();
    }

    //reducing size of monkey when hitting obstacle 1st time
    if (obstacleGroup.isTouching(monkey) && hit === false) {
      monkey.scale = 0.16;
      obstacleGroup.destroyEach();
      jungle.velocityX = 0;
      score = 0;
      hit = true;
    }

    //increasing size of monkey based on score;    
    switch (score) {
      case 10:
        monkey.scale = 0.19;
        break;
      case 20:
        monkey.scale = 0.22;
        break;
      case 30:
        monkey.scale = 0.25;
        break;
      case 40:
        monkey.scale = 0.28;
        break;
      default:
        break;
    }

    //calling the functions to create food and rocks
    spawnFood();
    spawnObstacles();

    if (obstacleGroup.isTouching(monkey) && hit === true) {
      gameState = 0;
    }
  }

  drawSprites();

  //displaying score
  stroke("white");
  textSize(20);
  fill("white");
  text("Score : " + score, 370, 50);

  if (gameState === END) {
    //displaying game over text and setting velocities to 0
    text("GAME OVER!", 190, 200);
    jungle.velocityX = 0;
    ground.velocityX = 0;

    //destroying monkey
    monkey.destroy();

    obstacleGroup.setVelocityXEach(0);
    FoodGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    FoodGroup.setLifetimeEach(0);
  }
}


function spawnFood() {
  //spawning bananas every 80 frames
  if (frameCount % 80 == 0) {
    //creating sprite, adding velocity and image
    banana = createSprite(500, 200, 10, 30);
    banana.y = Math.round(random(120, 200));
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -5.5;

    //setting lifetime
    banana.lifetime = 150;

    //adding bananas to a group
    FoodGroup.add(banana);
  }
}


function spawnObstacles() {
  //spawning rocks every 300 frames
  if (frameCount % 300 == 0) {
    //creating sprite, adding velocity and image
    obstacles = createSprite(500, 330, 30, 30);
    obstacles.velocityX = -5.5;
    obstacles.addImage(obstacleImage);
    obstacles.scale = 0.25;

    //setting lifetime
    obstacles.lifetime = 150;

    //adding rocks to a group
    obstacleGroup.add(obstacles);
  }
}