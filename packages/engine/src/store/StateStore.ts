import { singleton } from "tsyringe";
import { Entity } from "../core/Entity";

const mooseImg = new Image();
mooseImg.src =
  "https://images.vexels.com/media/users/3/227446/isolated/lists/7867873566b6dda4db49b5d752009b07-cute-moose-flat.png";

  const moose: Entity = {
    texture: mooseImg,
    height: 20,
    width: 40,
    x: 0,
    y: 0
  }

@singleton()
export class StateStore {
  public getStateForRendering(): Entity[] {

    moose.x = moose.x + (Math.random() - 0.5) * 10
    moose.y = moose.y + (Math.random() - 0.5) * 10

    return [moose];
  }
}
