import Button from "./Button";
import JoyStick from "./JoyStick";

export function Controller() {
  return (
    <div>
      <JoyStick
        className="bottom-8 left-8"
        onMove={(pos) => console.log("move", pos)}
      />
      <Button
        className="bottom-8 right-8"
        onPress={() => console.log("press")}
      />
    </div>
  );
}
