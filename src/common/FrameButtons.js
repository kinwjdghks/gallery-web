import { React, useState } from "react";
//imports

//css
import styles from "./FrameButtons.module.css";

const FrameButtons = ({
  clicked,
  isLoading,
  imgfile,
  onTakePhoto,
  onSavePhoto,
  onClick,
}) => {
  const [frameSelected, SetFrameSelected] = useState(false);
  const [skinSelected, SetSkinSelected] = useState(false);

  const clickHandler = () => {
    if (!frameSelected) {
      SetFrameSelected(true);
    } else {
      SetSkinSelected(true);
    }
  };

  const classNameByConfig = !frameSelected
    ? styles.frame
    : !skinSelected
    ? styles.skin
    : styles.done;

  return (
    <div className={`${styles.container} ${classNameByConfig}`}>
      <div className={styles.text}>
        <p className={styles.comit}>COMIT</p>
        <p className={styles.photobooth}>Photo Booth</p>
      </div>

      {!frameSelected && (
        <button
          className={`${styles.framebtn} ${styles.square}`}
          onClick={() => clicked(0)}
        >
          1:1
        </button>
      )}

      {!frameSelected && (
        <button
          className={`${styles.framebtn} ${styles.vertical}`}
          onClick={() => clicked(1)}
        >
          3:4
        </button>
      )}
      {!frameSelected && (
        <button
          className={`${styles.framebtn} ${styles.horizontal}`}
          onClick={() => clicked(2)}
        >
          4:3
        </button>
      )}

      {frameSelected && !skinSelected && (
        <button className={`${styles.skinbtn} ${styles.skin1}`}>A</button>
      )}
      {frameSelected && !skinSelected && (
        <button className={`${styles.skinbtn} ${styles.skin2}`}>B</button>
      )}
      {frameSelected && !skinSelected && (
        <button className={`${styles.skinbtn} ${styles.skin3}`}>C</button>
      )}
      {frameSelected && !skinSelected && (
        <button className={`${styles.skinbtn} ${styles.skin4}`}>D</button>
      )}

      {!frameSelected || !skinSelected ? (
        <button
          className={`${styles.framebtn} ${styles.next}`}
          onClick={clickHandler}
        >
          Next
        </button>
      ) : (
        !isLoading &&
        !imgfile && (
          <button
            className={`${styles.framebtn} ${styles.next}`}
            onClick={onTakePhoto}
          >
            Take Picture
          </button>
        )
      )}

      {/* {!isLoading && !imgfile && (
        <button
          className={`${styles.btn} ${styles.photo}`}
          onClick={onTakePhoto}
        >
          {" "}
          Take Picture
        </button>
      )} */}
      {imgfile && (
        <button
          className={`${styles.framebtn} ${styles.next}`}
          // onClick={onSavePhoto}
          onClick={onClick}
        >
          {" "}
          처음으로
        </button>
      )}
      <button
        className={`${styles.framebtn} ${styles.close}`}
        onClick={onClick}
      >
        X
      </button>
    </div>
  );
};

export default FrameButtons;
