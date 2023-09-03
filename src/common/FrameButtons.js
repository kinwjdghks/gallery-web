import { React, useEffect, useState, useCallback } from "react";
//imports

//css
import styles from "./FrameButtons.module.css";
//images
import SmileImage from "../assets/Images/smile.svg";
import ThumbImage from "../assets/Images/thumb.png";
import building from "../assets/skins/design1_square.svg";
import temple from "../assets/Images/명륜당.svg";
import sungkyuni from "../assets/Images/성균이.svg";
import leaves from "../assets/Images/낙엽.svg";
import loading from "../assets/Images/loading.svg";

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
  const [photoAnimation, setPhotoAnimation] = useState();
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

  const animation = useCallback((time) => {
    let cnt = time;
    const timer = setInterval(() => {
      console.log(cnt);
      if (cnt > 0) {
        setPhotoAnimation(
          <div className={`${styles.animation} ${styles.counting}`}>{cnt}</div>
        );
        cnt--;
      } else {
        setPhotoAnimation(
          <div className={`${styles.animation} ${styles.shooting}`}></div>
        );
        clearInterval(timer);
      }
    }, 1000);
  });
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
            <img
              className={`${styles.btndesign} ${styles.skin1}`}
              width="287"
              src={building}
              alt='btndesign'
            />
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin2}`}
            onClick={() => onSkinSelect(2)}
          >
            <img
              className={`${styles.btndesign} ${styles.skin2}`}
              width="300"
              src={temple}
              alt='btndesign'
            />
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin3}`}
            onClick={() => onSkinSelect(3)}
          >
            <img
              className={`${styles.btndesign} ${styles.skin3} ${styles.leaves}`}
              width="60"
              src={leaves}
              alt='btndesign'
            />
            <img
              className={`${styles.btndesign} ${styles.skin3} ${styles.sungkyuni}`}
              width="250"
              src={sungkyuni}
              alt='btndesign'
            />
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin4}`}
            onClick={() => onSkinSelect(4)}>
            <div className={`${styles.btndesign} ${styles.skin4}`}>
              <p className={styles.comitfilm1}>COMIT FILM</p>
              <p className={styles.comitfilm2}>COMIT FILM</p>
              <p className={styles.comitfilm3}>COMIT FILM</p>
            </div>
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

      {phase === 3 && (
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

      {phase === 4 && !imgfile && photoAnimation}
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
            setPhase(4);
            animation(5);
            onTakePhoto();
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
