import { Graphics } from 'pixi.js';
import { colors, pierSize } from '../consts';

export type PierOccupationType = "occupied" | "free";

export class Pier extends Graphics {
loaded: boolean;
occupationType: PierOccupationType = "free";

constructor(occupationType: PierOccupationType) {
    super();
    this.loaded = true;
    this.occupationType = occupationType;
    this.drawShip();
  }

  private drawShip() {
    this.rect(
      pierSize.borderSize / 2,
      pierSize.borderSize / 2,
      pierSize.width,
      pierSize.height
    );
    this.loaded && this.fill(colors.green);
    this.stroke({ width: pierSize.borderSize, color: colors.green});
  }

  public changeLoadState(loaded: boolean) {
    this.clear();
    this.loaded = loaded;
    this.drawShip();
  }

}