import 'pixi.js';
import 'p2';
import {Phaser} from 'phaser';
import SKY from './../assets/sky.png';
import GROUND from './../assets/platform.png';
import STAR from './../assets/star.png';
import DIAMOND from './../assets/diamond.png';
import DUDE from './../assets/dude.png';
import BADDIE from './../assets/baddie.png';
import PING_SOUND from './../assets/audio/p-ping.mp3';
import DEATH_SOUND from './../assets/audio/death.wav';
import DIAMOND_SOUND from './../assets/audio/diamond.wav';


var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var platform, player, cursor, stars, score, baddie, baddie_go_right, sfxStar, scoreText, sfxDeath, diamonds, sfxDiamond;

function preload() {
  game.load.image('sky', SKY);
  game.load.image('ground', GROUND);
  game.load.image('star', STAR);
  game.load.image('diamond', DIAMOND);
  game.load.spritesheet('dude', DUDE, 32, 48);
  game.load.spritesheet('baddie', BADDIE, 32, 32);
  game.load.audio('sfx:ping', PING_SOUND);
  game.load.audio('sfx:death', DEATH_SOUND);
  game.load.audio('sfx:diamond', DIAMOND_SOUND);
}

function create() {
  // enable arcade Physics
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // background
  game.add.sprite(0, 0, 'sky');

  //  Audio setup
  sfxStar = game.add.audio('sfx:ping');
  sfxStar.allowMultiple = true;
  sfxDeath = game.add.audio('sfx:death');
  sfxDeath.allowMultiple = true;
  sfxDiamond = game.add.audio('sfx:diamond');
  sfxDiamond.allowMultiple = true;

  // group the ground and plataforms to walk and jump
  platform = game.add.group();
  platform.enableBody = true;

  // ground
  var ground = platform.create(0, game.world.height - 64, 'ground');

  //scale to fit the canvas
  ground.scale.setTo(2, 2);
  // dont let the ground to fall
  ground.body.immovable = true;

  // platform
  var ledge = platform.create(400, 400, 'ground');
  ledge.body.immovable = true;
  // another platform
  ledge = platform.create(-150, 260, 'ground');
  ledge.body.immovable = true;

  // player
  player = game.add.sprite(32, game.world.height - 150, 'dude');

  // enable pysics on the player
  game.physics.arcade.enable(player);

  //Player physics properties, body represents the body in physics
  player.body.bounce.y = 0.1;
  player.body.gravity.y = 420;
  player.body.collideWorldBounds = true;

  // animate the dude to walk left and right
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  // death animation
  player.animations.add('swim');
  player.animations.play('swim', 30, true);

  cursor = game.input.keyboard.createCursorKeys();

  // Stars
  stars = game.add.group();
  stars.enableBody = true;

  // create the stars
  for (var i = 0; i < 10; i++) {
    var star = stars.create(i * 80, 0, 'star');
    star.body.gravity.y = 400;
    star.body.bounce.y = 0.4 + Math.random() * 0.2;
    // add sound to each star object
    sfxStar.addMarker('star',0,1.5);
  }

  // create the diamonds
  diamonds = game.add.group();
  diamonds.enableBody = true;

  // create the diamonds
  for (var i = 0; i < 5; i++) {
    var diamond = diamonds.create(i * 170, 20, 'diamond');
    diamond.body.gravity.y = 500;
    diamond.body.bounce.y = 0.2 + Math.random() * 0.4;
    // add sound to each diamond object
    sfxDiamond.addMarker('diamond',0,1.5);
  }

  // baddie
  baddie = game.add.sprite(0, 0, 'baddie');
  game.physics.arcade.enable(baddie);
  baddie.body.bounce.y = 1;
  baddie.body.gravity.y = 300;
  baddie.body.collideWorldBounds = true;

  // animate the buddie
  baddie.animations.add('left', [0, 1], 10, true);
  baddie.animations.add('right', [2, 3], 10, true);

  // variable that says if baddie go riht or left
  baddie_go_right = true;

  // score
  score = 0;
  scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

}

function update() {
  // Allows the player collide with the ground
  var hitPlatform = game.physics.arcade.collide(player, platform);
  var hitPlatformBaddie = game.physics.arcade.collide(baddie, platform);
  game.physics.arcade.collide(baddie, platform);

  // reset the player velocity
  player.body.velocity.x = 0;

  // Move
  if(cursor.left.isDown){
    player.body.velocity.x = -150;
    player.animations.play('left');
  }else if(cursor.right.isDown){
    player.body.velocity.x = 150;
    player.animations.play('right');
  }else{
    player.animations.stop();
    player.frame = 4;
  }
  if(player.body.y+16 > baddie.body.y){
    if(baddie.x === game.world.width - 32){ // 32 is the width of the buddie
      baddie.body.velocity.x = -80;
      baddie.animations.play('left');
    }else if(baddie.x === 0){
      baddie.body.velocity.x = 80;
      baddie.animations.play('right');
    }
  }else if(player.body.y+16 < Math.floor(baddie.body.y) && baddie.body.touching.down && hitPlatformBaddie){
    console.log("player "+player.body.y);
    console.log("baddie "+baddie.body.y);
    baddie.body.velocity.y = -350;
  }else if (player.body.x > baddie.body.x) {
    baddie.body.velocity.x = 80;
    baddie.animations.play('right');

  }else if(player.body.x < baddie.body.x){
    baddie.body.velocity.x = -80;
    baddie.animations.play('left');
  }

  // Jump
  if(cursor.up.isDown && player.body.touching.down && hitPlatform){
    player.body.velocity.y = -350;
  }

  // starts collition
  game.physics.arcade.collide(stars, platform);
  game.physics.arcade.overlap(player, stars, collectStar, null, this);

  // starts diamond
  game.physics.arcade.collide(diamonds, platform);
  game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);

  // baddie kills
  game.physics.arcade.overlap(player, baddie, killPlayer, null, this);
}

function collectStar(player, star){
  // add sound to start before kill it
  sfxStar.play('star');
  star.kill();
  score += 10;
  scoreText.text = 'Score: ' + score;

  if(score == 200){
    win();
  }
}

function collectDiamond(player, diamond){
  // add sound to diamond before kill it
  sfxDiamond.play('diamond');
  diamond.kill();
  score += 20;
  scoreText.text = 'Score: ' + score;
  if(score == 200){
    win();
  }
}

function killPlayer(player){
  //death sound
  sfxDeath.play();

  //loop animation to show the player going to heaven
  game.add.tween(player).to({ y: 70 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
  game.time.events.loop(4000, resetGame, this);

  var gameOverText = "\n...::GAME OVER::...";
  var style = { font: "65px Arial", fill: "#FFFFFF", align: "center"};
  game.add.text(game.world.centerX-300, 0, gameOverText, style);

}

function win() {
  let gameOverWIn = '\n ...:: YOU WIN ::...';
  var style = { font: "65px Arial", fill: "#FFFFFF", align: "center" };
  game.add.text(game.world.centerX - 300, 0, gameOverWIn, style);
  baddie.kill();
}

function resetGame(){
  player.kill();
}
