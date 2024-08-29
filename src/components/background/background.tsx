import { variables } from "../../constants";
import styles from "./background.module.css";

type BackgroundProps = {
  position: number;
};

export function Background(props: BackgroundProps) {
  const { position } = props;

  return (
    <div
      className={styles.background}
      style={{
        backgroundPosition: `
      left ${-(position * (variables.groundWidth / 80))}px bottom 0px,
      left ${-(position * (variables.bushesWidth / 700))}px bottom ${
          variables.groundHeight
        }px,
      left ${-(position * (variables.backWidth / 1000))}px bottom 0px
    `,
      }}
    />
  );
}
