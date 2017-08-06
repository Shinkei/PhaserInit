import Phaser from 'phaser';

export class Play extends Phaser.State{

  create(){
    // enable arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    //  Audio setup
    fxAudio = game.add.audio('sfx');
    fxAudio.allowMultiple = true;

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
  }

  update(){

  }
}
