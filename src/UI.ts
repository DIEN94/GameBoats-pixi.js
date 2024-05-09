import { getRandomBoolean } from "./../utils/randomBoolean";
import { Container } from "pixi.js";
import { Scene } from "./Scene";
import { Ship, ShipCargoType } from "./Ship";

export class UI {
  constructor(private scene: Scene) {
    //create start elements
  }

  public createShip() {
    const shipType: ShipCargoType = getRandomBoolean()
      ? "forCargo"
      : "withCargo";
    const ship = new Ship(shipType);

    ship.position.set(0, 0);
    this.scene.app.stage.addChild(ship);

    return ship;
  }

  directShip(ship: Ship) {
    //tween
  }
}
