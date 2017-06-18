var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var platform, player, cursor, stars, score;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {
    // enable arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // background
    game.add.sprite(0, 0, 'sky');

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
    ledge = platform.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    game.add.sprite(0, 0, 'star');

    // player
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    // enable pysics on the player
    game.physics.arcade.enable(player);

    //Player physics properties, body represents the body in physics
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    // animate the dude to walk left and right
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    cursor = game.input.keyboard.createCursorKeys();

    // Stars
    stars = game.add.group();
    stars.enableBody = true;

    // create the stars
    for (var i = 0; i < 12; i++) {
        var star = stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 300;
        star.body.bounce.y = 0.4 + Math.random() * 0.2;
    }

    // score
    score = 0;
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
}

function update() {
    // Allows the player collide with the ground
    var hitPlatform = game.physics.arcade.collide(player, platform);

    // reset the player velocity
    player.body.velocity.x = 0;

    // Move
    if(cursor.left.isDown){
        player.body.velocity.x = -150;
        player.animations.play('left');
    }else if(cursor.right.isDown){
        player.body.velocity.x = 150;
        player.animations.play('right')
    }else{
        player.animations.stop();
        player.frame = 4;
    }

    // Jump
    if(cursor.up.isDown && player.body.touching.down && hitPlatform){
        player.body.velocity.y = -350;
    }

    // starts collition
    game.physics.arcade.collide(stars, platform);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

}

function collectStar(player, star){
    star.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
}