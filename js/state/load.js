import Phaser from 'phaser';

export class Load extends Phaser.State{
  preload(){
    this.game.load.image('sky', '../assets/sky.png');
    this.game.load.image('ground', '../assets/platform.png');
    this.game.load.image('star', '../assets/star.png');
    this.game.load.spritesheet('dude', '../assets/dude.png', 32, 48);
    this.game.load.spritesheet('baddie', '../assets/baddie.png', 32, 32);
    this.game.load.audio('sfx', '../assets/audio/p-ping.mp3');
  }

  create(){
    this.game.state.start('play');
  }
}
