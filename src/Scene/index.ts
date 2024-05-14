import { Application, Container, Graphics } from "pixi.js";
import { colors } from "../consts";
import * as TWEEN from "@tweenjs/tween.js";

export class Scene {
  public app: Application;
  constructor() {
    this.app = new Application();
  }

  public async init() {
    await this.app.init({
      background: colors.background,
      width: 1920,
      height: 1080,
    });
    document.body.appendChild(this.app.canvas);
    window.addEventListener("resize", this.resize);

    // call it manually once so we are sure we are the correct size after starting
    this.resize();
    this.runUpdates();
  }

  private runUpdates() {
    this.app.ticker.add(() => {
      TWEEN.update();
    });
  }

  public resize() {
    // current screen size
    const screenWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const screenHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    // uniform scale for our game
    const scale = Math.min(screenWidth / 1920, screenHeight / 1080);

    // the "uniformly englarged" size for our game
    const enlargedWidth = Math.floor(scale * 1920);
    const enlargedHeight = Math.floor(scale * 1080);

    // margins for centering our game
    const horizontalMargin = (screenWidth - enlargedWidth) / 2;
    const verticalMargin = (screenHeight - enlargedHeight) / 2;

    // now we use css trickery to set the sizes and margins
    this.app.canvas.style.width = enlargedWidth + "px";
    this.app.canvas.style.height = enlargedHeight + "px";
    this.app.canvas.style.marginLeft = this.app.canvas.style.marginRight =
      horizontalMargin + "px";
    this.app.canvas.style.marginTop = this.app.canvas.style.marginBottom =
      verticalMargin + "px";
  }
}
