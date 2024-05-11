import { Graphics } from 'pixi.js';
import { colors, pierSize } from '../consts';

export type PierOccupationType = "occupied" | "free";

export class Pier extends Graphics {
loaded: boolean = false;
occupationType: PierOccupationType = "free";

constructor(private _index:number) {
    super();
    this.drawShip();
  }

  private drawShip() {
    const {width, height, borderSize} = pierSize
    this.rect(
      borderSize / 2,
      borderSize / 2,
      width - borderSize,
      height- borderSize,
    );
    this.loaded && this.fill(colors.green);
    this.stroke({ width: borderSize, color: colors.green});
    
  }

  public get index(){
    return this._index
  }
  

  public changeLoadState(loaded: boolean) {
    this.clear();
    this.loaded = loaded;
    this.drawShip();
  }

}