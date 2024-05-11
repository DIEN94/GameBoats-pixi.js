import { Tween } from "@tweenjs/tween.js";
import { UI } from "../UI";
import { Ship } from "../UI/Ship";
import { Pier } from "../UI/Pier";

type ActionsType = "start" | "toGates" | "load" | "return";

const SPAWN_INTERVAL_TIME = 2000;

export class Manager {
  generalQueue: Ship[] = [];
  loadedPiers:Pier[] = []
  speed = 0.5;
  constructor(private ui: UI,) {}

  public init() {
    setInterval(() => {
      this.spawnShip();
    }, SPAWN_INTERVAL_TIME);
  }

  private spawnShip() {
    const ship = this.ui.createShip();
    this.sendShip(ship)
  }

  private async sendShip(ship: Ship, actionType: ActionsType = "start") {
    switch(actionType){
    case "start":
        await this.startAnimation(ship);
        this.generalQueue.push(ship);
        await this.sendShip(ship, "toGates")
    break;

    case "toGates":
        // перевірка на необхідність парковки в чергу
        await this.gatesAnimation(ship);
        this.generalQueue.shift();


        if (ship.location === "sea") {
        ship.location = "port"
        await this.sendShip(ship, "load")  

        } else {
        ship.location = "sea"
        await this.sendShip(ship, "return")
        }
    break;

    case "load":
        await this.loadAnimation(ship);
        this.generalQueue.unshift(ship);
        await this.sendShip(ship, "toGates")
    break;

    case "return":
        await this.returnAnimation(ship);
    break;
    }

    // await this.startAnimation(ship);
    // await this.gatesAnimation(ship);
    // await this.loadAnimation(ship);
    // await this.gatesAnimation(ship);
    // await this.returnAnimation(ship);
  }

  private startAnimation(ship: Ship) {
    return new Promise<void>((resolve, reject) => {
      const { x, y } = this.ui.getQueuePointByCargoType(ship.cargoType);
      const time = Math.abs(ship.x - x) / this.speed;
      const sendShipNearGates = new Tween(ship)
        .to({ x, y }, time)
        .onComplete(() => resolve())
        .start();
    });
  }

  private gatesAnimation(ship: Ship) {
    return new Promise<void>((resolve, reject) => {
      if (this.ui.gates.x < ship.x) {
        let x = this.ui.gates.x + this.ui.gates.width + ship.width / 2;
        let y = this.ui.gates.y + this.ui.gates.height / 2;
        let time = Math.abs(ship.y - y) / this.speed;
        const sendShipToGates = new Tween(ship).to(
          {
            x,
            y,
            rotation:
              ship.cargoType === "withCargo" ? Math.PI / 2 : -Math.PI / 2,
          },
          time
        );

        x = this.ui.gates.x - ship.width / 2;
        time = Math.abs(ship.x - x) / this.speed;
        const sendShipToPort = new Tween(ship)
          .to({ x, y, rotation: 0 }, time)
          .onComplete(() => resolve());

        sendShipToGates.chain(sendShipToPort);
        sendShipToGates.start();
      } else {
        let x = this.ui.gates.x - ship.width / 2;
        let y = this.ui.gates.y + this.ui.gates.height / 2;
        let time =
          Math.sqrt(
            Math.abs(x - ship.x) * Math.abs(x - ship.x) +
              Math.abs(y - ship.y) * Math.abs(y - ship.y)
          ) / this.speed;
        const sendShipToGates = new Tween(ship)
          .to({ x, y }, time)
          .onComplete(() => resolve())
          .start();
      }
    });
  }

  private loadAnimation(ship: Ship, index: number = 0) {
    return new Promise<void>((resolve, reject) => {
      let x = this.ui.piers[index].width + ship.width / 2;
      let y = this.ui.piers[index].y + this.ui.piers[index].height / 2;
      let time =
        Math.sqrt(
          Math.abs(ship.x - x) * Math.abs(ship.x - x) +
            Math.abs(ship.y - y) * Math.abs(ship.y - y)
        ) / this.speed;
      const sendShipToPier = new Tween(ship)
        .to({ x, y }, time)
        .onComplete(() => {
        ship.changeLoadState(!ship.loaded) 
        this.ui.piers[index].changeLoadState(!this.ui.piers[index].loaded)   
        return resolve()
        })
        .start();
    });
  }

  private returnAnimation(ship: Ship) {
    return new Promise<void>((resolve, reject) => {
      let x = this.ui.getCanvasSize().width + ship.width / 2;
      let y = this.ui.getCanvasSize().height / 2;
      let time =
        (this.ui.getCanvasSize().width - ship.x + ship.width / 2) / this.speed;
      const sendShipToPier = new Tween(ship)
        .to({ x, y }, time)
        .onComplete(() => resolve())
        .start();
    });
  }

  private checkLoadedPiers() {
    // сделать универсальной
    const piersNumber = 4;
    for (let i = 0; i < piersNumber; i++) {
        if (this.ui.piers[i].loaded) {
            return i
        }
    }
  }

//   private addToGeneralQueue(ship: Ship) {
//     this.generalQueue.push(ship);
//   }

//   private deleteFromGeneralQueue() {
//     this.generalQueue.shift();
//   }
}

