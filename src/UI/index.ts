import { getRandomBoolean } from "../utils/randomBoolean";
import { Graphics } from 'pixi.js';
import { Ship, ShipCargoType } from "./Ship";
import { Pier } from "./Pier";
import { pierSize, wallSize, gatesSize, colors } from "../consts";
import { Scene } from './../Scene/index';

export class UI {
  constructor(private scene: Scene) {
    //create start elements
  }

  public async init() {
    const pier1 = new Pier("free");
    pier1.x = 0;
    pier1.y = (window.innerHeight - (pier1.height * 4 + pierSize.gap * 3)) / 2;
    this.scene.app.stage.addChild(pier1);

    const pier2 = new Pier("free");
    pier2.x = 0;
    pier2.y = pier1.y + pier1.height + pierSize.gap;
    this.scene.app.stage.addChild(pier2);

    const pier3 = new Pier("free");
    pier3.x = 0;
    pier3.y = pier2.y + pier2.height + pierSize.gap;
    this.scene.app.stage.addChild(pier3);

    const pier4 = new Pier("free");
    pier4.x = 0;
    pier4.y = pier3.y + pier3.height + pierSize.gap;
    this.scene.app.stage.addChild(pier4);

    const wall = new Graphics();
    wall.rect(300, 0, wallSize.width, wallSize.height);
    wall.fill(colors.green);
    this.scene.app.stage.addChild(wall);

    const gates = new Graphics();

    gates.rect(
      300 + wallSize.width / 2 - gatesSize.width / 2,
      wallSize.height / 2 - gatesSize.height / 2,
      gatesSize.width,
      gatesSize.height
    );
    gates.fill(colors.background);
    this.scene.app.stage.addChild(gates);

    // const ship = new Ship("forCargo");
    // this.app.stage.addChild(ship);
    // console.log(ship);

    // setTimeout(() => {
    //   ship.changeLoadState(true);
    // }, 2000);

    // setTimeout(() => {
    //   pier1.changeLoadState(false);
    // }, 2000);
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
