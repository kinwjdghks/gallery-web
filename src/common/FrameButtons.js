import { React, useEffect, useState } from "react";
//imports

//css
import styles from "./FrameButtons.module.css";
//images
import SmileImage from "../assets/Images/smile.svg";
import ThumbImage from "../assets/Images/thumb.png";
import FrameAniImage1 from "../assets/buttons/frameImage.svg";
import FrameAniImage2 from "../assets/buttons/frameImage2.svg";
const FrameButtons = ({
  isLoading,
  imgfile,
  photoTaken,
  onTakePhoto,
  onSavePhoto,
  onDeletePhoto,
  onToggleModalHandler,
  onFrameSelect,
  onSkinSelect,
}) => {
  const [phase, setPhase] = useState(1);
  //phase 1: frame select phase 2: skin select phase 3: before photo 4: after photo
  const againHandler = () => {
    onDeletePhoto();
  };
  const classNameByConfig =
    phase === 1
      ? styles.frame
      : phase === 2
      ? styles.skin
      : phase === 3
      ? styles.beforePhoto
      : styles.afterPhoto;

  return (
    <div className={`${styles.container} ${classNameByConfig}`}>
      <div className={styles.text}>
        <p className={styles.comit}>COMIT</p>
        <p className={styles.photobooth}>Photo Booth</p>
      </div>
      {phase === 1 && (
        <>
          <button
            className={`${styles.framebtn} ${styles.square}`}
            onClick={() => onFrameSelect(0)}
          ></button>
          <button
            className={`${styles.framebtn} ${styles.vertical}`}
            onClick={() => onFrameSelect(1)}
          >
            <img
              src={FrameAniImage1}
              alt="AniImage"
              style={{
                position: "absolute",
                left: 40,
                top: 20,
              }}
            />
            <img
              src={FrameAniImage2}
              alt="AniImage2"
              style={{
                position: "relative",
                top: 120,
              }}
            />
          </button>
          <button
            className={`${styles.framebtn} ${styles.horizontal}`}
            onClick={() => onFrameSelect(2)}
          />
        </>
      )}
      {/* skin */}
      {phase === 2 && (
        <>
          <button
            className={`${styles.skinbtn} ${styles.skin1}`}
            onClick={() => onSkinSelect(0)}
          >
            A
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin2}`}
            onClick={() => onSkinSelect(1)}
          >
            B
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin3}`}
            onClick={() => onSkinSelect(2)}
          >
            C
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin4}`}
            onClick={() => onSkinSelect(3)}
          >
            D
          </button>
        </>
      )}
      {(phase === 3 || (phase === 4 && !imgfile)) && (
        <img
          src={SmileImage}
          alt="SmileImage"
          style={{
            gridArea: "img",
            justifySelf: "center",
            alignSelf: "center",
            width: 500,
          }}
        />
      )}
      {phase === 4 && imgfile && (
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
      {(phase === 1 || phase === 2) && (
        <button
          className={`${styles.movebtn} ${styles.nextbtn}`}
          onClick={() => setPhase((prev) => prev + 1)}
        />
      )}
      {/*Take Photo*/}
      {phase === 3 && (
        <button
          className={`${styles.movebtn} ${styles.takePhoto}`}
          onClick={() => {
            onTakePhoto();
            setPhase(4);
          }}
        />
      )}
      {phase === 4 && imgfile && (
        <>
          <button
            className={`${styles.lastbtn} ${styles.again}`}
            onClick={() => {
              againHandler();
              setPhase(1);
            }}
          />
          <button
            className={`${styles.lastbtn} ${styles.save}`}
            onClick={onSavePhoto}
          />
        </>
      )}
      <button className={styles.close} onClick={onToggleModalHandler}>
        X
      </button>
    </div>
  );
};

export default FrameButtons;
