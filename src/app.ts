import { Manager } from "./Manager";
import { Scene } from "./Scene";
import { UI } from "./UI";

const startApp = async () => {
  const scene = new Scene();
  await scene.init();
  const ui = new UI(scene);
  ui.init();
  const manager = new Manager(ui);
  manager.init();
};
startApp();
