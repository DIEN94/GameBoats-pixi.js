import { Application } from "pixi.js";

export class Scene {
  public app: Application;
  constructor() {
    this.app = new Application();
  }

  public async init() {
    await this.app.init({ background: "#4d35ff", resizeTo: window });
    document.body.appendChild(this.app.canvas);
  }
}
