import { Tween } from "@tweenjs/tween.js";
import { UI } from "../UI";
import { Ship, ShipCargoType } from "../UI/Ship";

type ActionsType = "start" | "toGates" | "load" | "return";

const SPAWN_INTERVAL_TIME = 8000;

export class Manager {
  generalQueue: Ship[] = [];
  speed = 0.5;
  gateIsFree: boolean = true;
  forReservation: number[] = [];
  constructor(private ui: UI) {}

  public init() {
    setInterval(() => {
      this.spawnShip();
    }, SPAWN_INTERVAL_TIME);
  }

  private spawnShip() {
    const ship = this.ui.createShip();
    this.sendShip(ship);
  }

  private async sendShip(ship: Ship, actionType: ActionsType = "start") {
    switch (actionType) {
      case "start":
        await this.startAnimation(ship);
        await this.sendShip(ship, "toGates");
        break;

      case "toGates":
        const availabilityPier = this.getAvailabilityPier(ship.cargoType);
        let isCanMove =
          this.gateIsFree && (ship.location === "port" || availabilityPier);

        if (!isCanMove) {
          this.addToGeneralQueue(ship);
          return;
        }
        this.setGatesIsFree(false);
        if (ship.location === "sea") {
          if (!availabilityPier) {
            return;
          }
          availabilityPier.reserved = true;

          ship.currentPierIndex = availabilityPier.index;
          await this.gatesAnimation(ship);
          ship.location = "port";
          await this.sendShip(ship, "load");
        } else {
          if (ship.currentPierIndex !== null) {
            this.ui.piers[ship.currentPierIndex].reserved = false;
            ship.currentPierIndex = null;
          }
          await this.gatesAnimation(ship);
          ship.location = "sea";
          await this.sendShip(ship, "return");
        }
        break;

      case "load":
        await this.loadAnimation(ship);
        await this.sendShip(ship, "toGates");
        break;

      case "return":
        await this.returnAnimation(ship);
        break;
    }
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
      let xToGates,
        yToGates,
        timeToGates,
        rotationToGates,
        xToPortOrSea,
        yToPortOrSea,
        timeToPortOrSea;

      if (ship.location === "sea") {
        xToGates = this.ui.gates.x + this.ui.gates.width + ship.width / 2;
        yToGates = this.ui.gates.y + this.ui.gates.height / 2;
        timeToGates = Math.abs(ship.y - yToGates) / this.speed;
        rotationToGates =
          ship.cargoType === "withCargo" ? Math.PI / 2 : -Math.PI / 2;

        xToPortOrSea = this.ui.gates.x - ship.width / 2;
        yToPortOrSea = this.ui.gates.y + this.ui.gates.height / 2;
        timeToPortOrSea = Math.abs(ship.x - xToPortOrSea) / this.speed;
      } else {
        xToGates = this.ui.gates.x - ship.width / 2;
        yToGates = this.ui.gates.y + this.ui.gates.height / 2;
        timeToGates =
          Math.sqrt(
            Math.abs(xToGates - ship.x) * Math.abs(xToGates - ship.x) +
              Math.abs(yToGates - ship.y) * Math.abs(yToGates - ship.y)
          ) / this.speed;
        rotationToGates = 0;

        xToPortOrSea = this.ui.gates.x + this.ui.gates.width + ship.width / 2;
        yToPortOrSea = this.ui.gates.y + this.ui.gates.height / 2;
        timeToPortOrSea = Math.abs(xToPortOrSea - xToGates) / this.speed;
      }

      const sendShipToGates = new Tween(ship).to(
        {
          x: xToGates,
          y: yToGates,
          rotation: rotationToGates,
        },
        timeToGates
      );

      const sendShipToPortOrSea = new Tween(ship)
        .to({ x: xToPortOrSea, y: yToPortOrSea, rotation: 0 }, timeToPortOrSea)
        .onComplete(async () => {
          this.setGatesIsFree(true);
          resolve();
        });

      sendShipToGates.chain(sendShipToPortOrSea);
      sendShipToGates.start();
    });
  }

  private loadAnimation(ship: Ship) {
    return new Promise<void>((resolve, reject) => {
      let index = ship.currentPierIndex;
      if (index === null) {
        resolve();
        return;
      }
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
          ship.changeLoadState(!ship.loaded);
          this.ui.piers[index].changeLoadState(!this.ui.piers[index].loaded);
          return resolve();
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

  private getAvailabilityPier(shipCargoType: ShipCargoType) {
    const piersNumber = this.ui.piers.length;
    for (let i = 0; i < piersNumber; i++) {
      if (
        (shipCargoType === "forCargo" &&
          this.ui.piers[i].loaded &&
          !this.ui.piers[i].reserved) ||
        (shipCargoType === "withCargo" &&
          !this.ui.piers[i].loaded &&
          !this.ui.piers[i].reserved)
      ) {
        return this.ui.piers[i];
      }
    }
    return null;
  }

  private addToGeneralQueue(ship: Ship) {
    if (ship.location === "sea") {
      this.generalQueue.push(ship);
    } else {
      this.generalQueue.unshift(ship);
    }
  }

  private setGatesIsFree(value: boolean) {
    this.gateIsFree = value;
    if (value) {
      this.updateQueue();
    }
  } 
  private updateQueue() {
    let firstShipOfQueue = this.generalQueue[0];
    if (firstShipOfQueue) {
      let isCanMove =
        this.gateIsFree &&
        (firstShipOfQueue.location === "port" ||
          this.getAvailabilityPier(firstShipOfQueue.cargoType));
      if (isCanMove) {
        this.generalQueue.splice(0, 1);
        this.sendShip(firstShipOfQueue, "toGates");
      }
    }
  }
}
