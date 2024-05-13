import { Application, Container, Graphics } from "pixi.js";
import { colors } from "../consts";
import * as TWEEN from "@tweenjs/tween.js";

export class Scene {
  public app: Application;
  constructor() {
    this.app = new Application();
  }

  public async init() {
    await this.app.init({ background: colors.background, width: 1920, height:1080 });
    document.body.appendChild(this.app.canvas);

    this.runUpdates()
  }

  private runUpdates() {
    this.app.ticker.add(() => {
      TWEEN.update();
    })
  }
}
