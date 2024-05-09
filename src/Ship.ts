import { Graphics } from "pixi.js";
import { getRandomBoolean } from "../utils";

export type ShipLoadType = "loaded" | "unloaded";
export type ShipCargoType = "forCargo" | "withCargo";
export type ShipLocationType = "sea" | "port";

const colors: Record<ShipCargoType, number> = {
  forCargo: 0xffbd01,
  withCargo: 0xffbd01,
};
export class Ship extends Graphics {
  settings = {
    width: 60,
    height: 25,
  };

  cargoType: ShipCargoType;
  loadType: ShipLoadType;
  private _location: ShipLocationType = "sea";
  constructor(cargoType: ShipCargoType) {
    super();
    this.cargoType = cargoType;
    this.loadType = cargoType === "withCargo" ? "loaded" : "loaded";

    this.drawShip();
  }

  private drawShip() {
    this.rect(0, 0, this.width, this.height);
    this.fill(colors[this.cargoType]);
    this.stroke({ width: 10, color: colors[this.cargoType] });
  }

  public rotateShip(angle: number) {
    //rotateAnimation
  }
  public loadShip = (v: boolean) => {};
  public set location(location: ShipLocationType) {
    this._location = location;
  }
}
