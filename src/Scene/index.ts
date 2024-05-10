import { Application, Container, Graphics } from "pixi.js";
import { colors } from "../consts";
import { UI } from './../UI/index';

export class Scene {
  public app: Application;
  public ui: UI;
  constructor() {
    this.app = new Application();
    this.ui = new UI(this);
  }

  public async init() {
    await this.app.init({ background: colors.background, resizeTo: window });
    document.body.appendChild(this.app.canvas);
    this.ui.init();
  }
}
