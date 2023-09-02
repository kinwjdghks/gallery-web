import { React, useState } from "react";
//imports

//css
import styles from "./FrameButtons.module.css";
import ThumbImage from "../assets/Images/thumb.png";

const FrameButtons = ({
  clicked,
  isLoading,
  imgfile,
  photoTaken,
  onTakePhoto,
  onSavePhoto,
  onDeletePhoto,
  onClick,
}) => {
  const [frameSelected, setFrameSelected] = useState(false);
  const [skinSelected, setSkinSelected] = useState(false);

  const clickHandler = () => {
    if (!frameSelected) {
      setFrameSelected(true);
    } else {
      setSkinSelected(true);
    }
  };
  const againHandler = () => {
    setFrameSelected(false);
    setSkinSelected(false);
    onDeletePhoto();
  };
  const classNameByConfig = !frameSelected
    ? styles.frame
    : !skinSelected
    ? styles.skin
    : !photoTaken
    ? styles.beforePhoto
    : styles.afterPhoto;

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
        />
      )}

      {!frameSelected && (
        <button
          className={`${styles.framebtn} ${styles.vertical}`}
          onClick={() => clicked(1)}
        />
      )}
      {!frameSelected && (
        <button
          className={`${styles.framebtn} ${styles.horizontal}`}
          onClick={() => clicked(2)}
        />
      )}
      {/* skin */}
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
      {frameSelected && skinSelected && (
        <img
          src={ThumbImage}
          alt="ThumbImage"
          style={{
            gridArea: "img",
            justifySelf: "center",
            alignSelf: "center",
          }}
        />
      )}
      {/* Next */}
      {!frameSelected || !skinSelected ? (
        <button
          className={`${styles.movebtn} ${styles.nextbtn}`}
          onClick={clickHandler}
        />
      ) : (
        /*Take Photo*/
        !(photoTaken || imgfile) && (
          <button
            className={`${styles.movebtn} ${styles.takePhoto}`}
            onClick={onTakePhoto}
          />
        )
      )}
      {skinSelected && imgfile && (
        <button
          className={`${styles.lastbtn} ${styles.again}`}
          onClick={againHandler}
        />
      )}
      {skinSelected && imgfile && (
        <button
          className={`${styles.lastbtn} ${styles.save}`}
          onClick={onSavePhoto}
        />
      )}

      {/* !isLoading &&
        !imgfile && (
          <button
            className={`${styles.movebtn} ${styles.takePhoto}`}
            onClick={onTakePhoto}
          />
        ) */}

      {/* {!isLoading && !imgfile && (
        <button
          className={`${styles.btn} ${styles.photo}`}
          onClick={onTakePhoto}
        >
          {" "}
          Take Picture
        </button>
      )} */}

      <button className={styles.close} onClick={onClick}>
        X
      </button>
    </div>
  );
};

export default FrameButtons;
