import { getRandomBoolean } from "../utils/randomBoolean";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Ship, ShipCargoType } from "./Ship";
import { Pier } from "./Pier";
import { pierSize, gatesSize, colors, shipSize } from "../consts";
import { Scene } from "./../Scene/index";

export type PointType = {
  x: number;
  y: number;
};

export class UI extends Container {
  public gates!: Sprite;
  public piers: Pier[] = [];
  private queuePoint: Record<ShipCargoType, PointType> = {
    forCargo: {
      x: 0,
      y: 0,
    },
    withCargo: {
      x: 0,
      y: 0,
    },
  };
  constructor(private scene: Scene) {
    super();
  }

  public init() {
    this.createPiers();
    this.createGates();
    this.createWalls();

    this.calcShipQueuePoints();
    this.scene.app.stage.addChild(this);
  }

  public createPiers() {
    const piersNumber = 4;
    const gap =
      (this.scene.app.canvas.height - pierSize.height * piersNumber) /
      (piersNumber + 1);
    for (let i = 0; i < piersNumber; i++) {
      this.piers[i] = new Pier(i);
      this.piers[i].x = 0;
      this.piers[i].y = (pierSize.height + gap) * i + gap;
      this.addChild(this.piers[i]);
    }
  }

  public createWalls() {
    const wallWidth = 20;
    const wallHeight = (this.scene.app.canvas.height - this.gates.height) / 2;

    const upperWall = new Graphics();
    upperWall.rect(
      this.gates.x + this.gates.width / 2 - wallWidth / 2,
      0,
      wallWidth,
      wallHeight
    );
    upperWall.fill(colors.green);
    this.addChild(upperWall);

    const lowerWall = new Graphics();
    lowerWall.rect(
      this.gates.x + this.gates.width / 2 - wallWidth / 2,
      this.gates.y + this.gates.height,
      wallWidth,
      wallHeight
    );
    lowerWall.fill(colors.green);
    this.addChild(lowerWall);
  }

  public createGates() {
    this.gates = new Sprite(Texture.EMPTY);
    this.gates.width = gatesSize.width;
    this.gates.height = gatesSize.height;
    this.gates.position.set(
      400 - gatesSize.width / 2,
      this.scene.app.canvas.height / 2 - gatesSize.height / 2
    );
    this.addChild(this.gates);
  }

  public createShip() {
    const shipType: ShipCargoType = getRandomBoolean()
      ? "forCargo"
      : "withCargo";
    const ship = new Ship(shipType);
    const { y } = this.getQueuePointByCargoType(shipType);
    ship.position.set(this.getCanvasSize().width, y);
    this.addChild(ship);
    return ship;
  }

  public getQueuePointByCargoType(type: ShipCargoType) {
    return this.queuePoint[type];
  }

  public getCanvasSize() {
    const { width, height } = this.scene.app.canvas;
    return { width, height };
  }

  private calcShipQueuePoints() {
    const { x, y, width, height } = this.gates;
    this.queuePoint.forCargo.x = x + width + shipSize.width/2;
    this.queuePoint.forCargo.y = y - shipSize.height/2;
    this.queuePoint.withCargo.x = x + width + shipSize.width/2;
    this.queuePoint.withCargo.y = y + height + shipSize.height/2;
  }
}
