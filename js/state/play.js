import Phaser from 'phaser';

export class Play extends Phaser.State{

  create(){
    // enable arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  update(){

  }
}
