import { Graphics } from "pixi.js";
import { colors, shipSize } from "../consts";

export type ShipCargoType = "forCargo" | "withCargo";
export type ShipLocationType = "sea" | "port";

const colorsShip: Record<ShipCargoType, number> = {
  forCargo: colors.green,
  withCargo: colors.red,
};
export class Ship extends Graphics {
  cargoType: ShipCargoType;
  loaded: boolean;
  currentPierIndex: number | null = null;
  public location: ShipLocationType = "sea";
  constructor(cargoType: ShipCargoType) {
    super();
    this.cargoType = cargoType;
    this.loaded = cargoType === "withCargo";

    this.drawShip();
    this.pivot.set(this.width / 2, this.height / 2);
  }

  private drawShip() {
    const { width, height, borderSize } = shipSize;
    this.rect(
      borderSize / 2,
      borderSize / 2,
      width - borderSize,
      height - borderSize
    );
    this.loaded && this.fill(colorsShip[this.cargoType]);
    this.stroke({ width: borderSize, color: colorsShip[this.cargoType] });
  }

  public changeLoadState(loaded: boolean) {
    this.clear();
    this.loaded = loaded;
    this.drawShip();
  }
}
