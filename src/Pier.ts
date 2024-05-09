import { Graphics } from 'pixi.js';

export type PierLoadType = "loaded" | "unloaded";
export type PierOccupationType = "occupied" | "free";

const colors: Record<PierOccupationType, number> = {
    occupied: 0xffbd01,
    free: 0x4d35ff, 
  };

export class Pier extends Graphics {
settings = {
    width: 35,
    height: 80,
};

loadType: PierLoadType = "loaded";
occupationType: PierOccupationType = "free";

constructor(loadType: PierLoadType, occupationType: PierOccupationType) {
    super();
    this.loadType = loadType;
    this.occupationType = occupationType;
    this.drawShip();
  }

  private drawShip() {
    this.rect(0, 0, this.width, this.height);
    this.fill(colors[this.occupationType]);
    this.stroke({ width: 10, color: colors[this.occupationType] });
  }

}