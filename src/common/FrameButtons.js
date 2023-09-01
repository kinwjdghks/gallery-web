import { React } from "react";
//imports

//css
import styles from "./FrameButtons.module.css";

const FrameButtons = ({ clicked }) => {
  return (
    <>
      <button className={`${styles.btn} ${styles.square}`} onClick={clicked(0)}>
        {" "}
        1:1{" "}
      </button>
      <button
        className={`${styles.btn} ${styles.vertical}`}
        onClick={clicked(1)}
      >
        3:4{" "}
      </button>
      <button
        className={`${styles.btn} ${styles.horizontal}`}
        onClick={clicked(2)}
      >
        4:3
      </button>
    </>
  );
};

export default FrameButtons;
