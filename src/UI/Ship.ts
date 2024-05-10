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
  private _location: ShipLocationType = "sea";
  constructor(cargoType: ShipCargoType) {
    super();
    this.cargoType = cargoType;
    this.loaded = cargoType === "withCargo";

    this.drawShip();
  }

  private drawShip() {
    this.rect(
      shipSize.borderSize / 2,
      shipSize.borderSize / 2,
      shipSize.width,
      shipSize.height
    );
    this.loaded && this.fill(colorsShip[this.cargoType]);
    this.stroke({ width: 10, color: colorsShip[this.cargoType] });
  }

  public rotateShip(angle: number) {
    //rotateAnimation
  }

  public changeLoadState(loaded: boolean) {
    this.clear();
    this.loaded = loaded;
    this.drawShip();
  }

  public loadShip = (v: boolean) => {};
  public set location(location: ShipLocationType) {
    this._location = location;
  }
}
