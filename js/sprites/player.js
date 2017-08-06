import Phaser from 'phaser';

export Player extends Phaser.Sprite{
  constructor(game, x, y){
    super(game, x, y, 'dude');
    this.body.width = 32;
    this.body.height = this.game.world.height - 150;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    //Player physics properties, body represents the body in physics
    this.body.bounce.y = 0.2;
    this.body.gravity.y = 300;
    this.body.collideWorldBounds = true;

    // animate the dude to walk left and right
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
  }

  move(cursor){

  }
}
