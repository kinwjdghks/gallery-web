import { React, useEffect, useState } from "react";
//imports

//css
import styles from "./FrameButtons.module.css";
//images
import SmileImage from "../assets/Images/smile.svg";
import ThumbImage from "../assets/Images/thumb.png";

const FrameButtons = ({
  isLoading,
  imgfile,
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
      ? styles.skin
      : phase === 2
      ? styles.frame
      : phase === 3
      ? styles.beforePhoto
      : styles.afterPhoto;

  return (
    <div className={`${styles.container} ${classNameByConfig}`}>
      <div className={styles.text}>
        <p className={styles.comit}>COMIT</p>
        <p className={styles.photobooth}>Photo Booth</p>
      </div>
      {/* skin */}
      {phase === 1 && (
        <>
          <button
            className={`${styles.skinbtn} ${styles.skin1}`}
            onClick={() => onSkinSelect(1)}
          >
            A
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin2}`}
            onClick={() => onSkinSelect(2)}
          >
            B
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin3}`}
            onClick={() => onSkinSelect(3)}
          >
            C
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin4}`}
            onClick={() => onSkinSelect(4)}
          >
            D
          </button>
        </>
      )}
      {phase === 2 && (
        <>
          <button
            className={`${styles.framebtn} ${styles.square}`}
            onClick={() => onFrameSelect(0)}
          >
            정방형
          </button>
          <button
            className={`${styles.framebtn} ${styles.vertical}`}
            onClick={() => onFrameSelect(1)}
          >
            세로
          </button>
          <button
            className={`${styles.framebtn} ${styles.horizontal}`}
            onClick={() => onFrameSelect(2)}
          >
            가로
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
        >
          NEXT
        </button>
      )}
      {/*Take Photo*/}
      {phase === 3 && (
        <button
          className={`${styles.movebtn} ${styles.takePhoto}`}
          onClick={() => {
            onTakePhoto();
            setPhase(4);
          }}
        >
          TAKE A PICTURE
        </button>
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
