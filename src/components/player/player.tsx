import mario from "../../assets/players/mario.gif";
import marioMoving from "../../assets/players/mario-moving.gif";
import marioJumping from "../../assets/players/mario-jumping.gif";
import styles from "./player.module.css";
import { variables } from "../../constants";

function getImage(isMoving: boolean, isJumping: boolean) {
  if (isJumping) {
    return marioJumping;
  }
  if (isMoving) {
    return marioMoving;
  }
  return mario;
}

type PlayerProps = {
  positionX: number;
  positionY: number;
  direction: "ltr" | "rtl";
  isMoving: boolean;
  isJumping: boolean;
};

export function Player(props: PlayerProps) {
  const { isJumping, isMoving, positionX, positionY, direction } = props;

  return (
    <div
      className={styles.player}
      style={{
        backgroundImage: `url(${getImage(isMoving, isJumping)})`,
        transform: direction === "ltr" ? "none" : "scaleX(-1)",
        left: `${positionX}px`,
        bottom: `${positionY + variables.groundHeight}px`,
      }}
    />
  );
}
