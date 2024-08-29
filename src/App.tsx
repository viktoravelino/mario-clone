import { useCallback, useEffect, useState } from "react";
import { Background } from "./components/background";
import { Player } from "./components/player";
import { variables } from "./constants";

type Movement = {
  Left: boolean;
  Right: boolean;
  Up: boolean;
};

const allowedKeys = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "KeyA",
  "KeyD",
  "KeyW",
  "Space",
];

const STEP = 10;
const JUMP_LIMIT = 120;

function App() {
  const [playerPositionX, setPlayerPositionX] = useState(0); // Player starting position
  const [playerPositionY, setPlayerPositionY] = useState(0); // Player starting position
  const [isMoving, setIsMoving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [movement, setMovement] = useState<Movement>({
    Left: false,
    Right: false,
    Up: false,
  });
  const [isFalling, setIsFalling] = useState(false);
  const [scenarioPosition, setScenarioPosition] = useState(0);
  const [width, setWidth] = useState(0);
  // const [activeKeys, setActiveKeys] = useState<AllowedKeys>(keys);

  const keyDown = useCallback((e: KeyboardEvent) => {
    if (!allowedKeys.includes(e.code)) return;

    const isRight = e.code === "ArrowRight" || e.code === "KeyD";
    const isLeft = e.code === "ArrowLeft" || e.code === "KeyA";
    const isUp =
      e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space";

    if (isRight) {
      setMovement((prev) => ({ ...prev, Right: true }));
    }

    if (isLeft) {
      setMovement((prev) => ({ ...prev, Left: true }));
    }

    if (isUp) {
      setMovement((prev) => ({ ...prev, Up: true }));
    }
  }, []);

  function keyUp(e: KeyboardEvent) {
    if (e.code === "Space" || e.code === "KeyW" || e.code === "ArrowUp") {
      setIsJumping(false);
      setMovement((prev) => ({ ...prev, Up: false }));
      return;
    }

    setMovement((prev) => ({ ...prev, Left: false, Right: false }));
  }

  const gameLoop = useCallback(() => {
    if (movement.Right ? !movement.Left : movement.Left) {
      setIsMoving(true);

      if (movement.Right && direction === "rtl") {
        setDirection("ltr");
      }

      if (movement.Left && direction === "ltr") {
        setDirection("rtl");
      }

      if (movement.Right && width && playerPositionX > (width * 40) / 100) {
        setScenarioPosition((prev) => prev + STEP);
      } else if (
        movement.Right &&
        width &&
        playerPositionX < width - variables.marioWidth - STEP
      ) {
        setPlayerPositionX((prev) => prev + STEP);
      } else if (movement.Left && playerPositionX > 20) {
        setPlayerPositionX((prev) => prev - STEP);
      }
    }

    if (movement.Up && !isFalling) {
      setIsJumping(true);

      if (playerPositionY < JUMP_LIMIT) {
        setPlayerPositionY((prev) => prev + 30);
      } else {
        setIsFalling(true);
      }
    } else {
      if (playerPositionY > 0) {
        setPlayerPositionY((prev) => (prev >= 0 ? prev - 30 : 0));
      } else {
        setIsFalling(false);
      }
    }

    if (!movement.Right && !movement.Left && !movement.Up) {
      setIsMoving(false);
      setIsJumping(false);
    }
  }, [
    direction,
    isFalling,
    movement.Left,
    movement.Right,
    movement.Up,
    playerPositionX,
    playerPositionY,
    width,
  ]);

  useEffect(() => {
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    const interval = setInterval(gameLoop, 80);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [gameLoop, keyDown]);

  return (
    <div
      ref={(elementRef) => {
        setWidth(elementRef?.clientWidth || 0);
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          left: "50%",
          transform: "translateX(-50%)",
          top: "20%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span>Use "A", "D" or "Arrows" to move</span>
        <span>Use "W", "Space" or "ArrowUp" to jump</span>
      </div>
      <Background position={scenarioPosition} />

      <Player
        isMoving={isMoving}
        isJumping={isJumping}
        direction={direction}
        positionX={playerPositionX}
        positionY={playerPositionY}
      />
    </div>
  );
}

export default App;
