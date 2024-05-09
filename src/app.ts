import { Scene } from "./Scene";

const startApp = async () => {
  const scene = new Scene();

  await scene.init();
};
startApp();