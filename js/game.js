import Phaser from 'phaser';
import { Load } from './state/load';
import { Play } from './state/play';
import { Update } from './state/update';

class Game extends Phaser.Game {

  constructor(){
    super(800, 600, Phaser.AUTO, 'phaser-init', {
      create: () => {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.state.add('load', Load);
        this.state.add('play', Play);

        this.state.start('load');
      }
    });
  }
}
