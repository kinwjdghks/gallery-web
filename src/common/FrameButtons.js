import { React, useState, useCallback } from "react";
//imports
import Button from "./Button";
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
import camera from "../assets/Images/camera_btn_black.svg";

const FrameButtons = ({
  isLoading,
  imgfile,
  whileTimer,
  onStartTimer,
  onTakePhoto,
  onSavePhoto,
  onDeletePhoto,
  onCloseModal,
  onFrameSelect,
  onSkinSelect,
  version,
}) => {
  const [phase, setPhase] = useState(1);
  //phase 1: frame select / 2: take photo / 3: skin select / 4: after photo
  //phase 1: frame select / 2: skin select/ 3: before photo/ 4: after photo
  const [animationStarted, setAnimationStarted] = useState(false);
  const [photoAnimation, setPhotoAnimation] = useState();
  const againHandler = () => {
    onDeletePhoto();
  };
  const classNameByConfig =
    phase === 1
      ? styles.skin
      : phase === 2
      ? styles.beforePhoto
      : phase === 3
      ? styles.frame
      : styles.afterPhoto;

  const animation = useCallback((time) => {
    setAnimationStarted(true);
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
    const setTimer = setTimeout(() => {
      setPhase((prev) => prev + 1);
    }, 6000);
    return () => clearTimeout(setTimer);
  });
  return (
    <div className={`${styles.container} ${classNameByConfig}`}>
      {version !== "mobile" && (
        <div className={styles.text}>
          <p className={styles.comit}>COMIT</p>
          <p className={styles.photobooth}>Photo Booth</p>
        </div>
      )}
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
              alt="btndesign"
            />
          </button>

          {/* <Button
            children=""
            width="287px"
            height="240px"
            onClick={() => onSkinSelect(1)}
            classes="skinbtn skin1"
          >
            <img
              className={`${styles.btndesign} ${styles.skin1}`}
              width="287"
              src={building}
              alt="btndesign"
            />
          </Button> */}
          <button
            className={`${styles.skinbtn} ${styles.skin2}`}
            onClick={() => onSkinSelect(2)}
          >
            <img
              className={`${styles.btndesign} ${styles.skin2}`}
              width="300"
              src={temple}
              alt="btndesign"
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
              alt="btndesign"
            />
            <img
              className={`${styles.btndesign} ${styles.skin3} ${styles.sungkyuni}`}
              width="250"
              src={sungkyuni}
              alt="btndesign"
            />
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin4}`}
            onClick={() => onSkinSelect(4)}
          >
            <div className={`${styles.btndesign} ${styles.skin4}`}>
              <p className={styles.comitfilm1}>COMIT FILM</p>
              <p className={styles.comitfilm2}>COMIT FILM</p>
              <p className={styles.comitfilm3}>COMIT FILM</p>
            </div>
          </button>
        </>
      )}

      {/*Smile Image*/}
      {phase === 2 && !animationStarted && (
        <>
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
          <div className={styles.smile}>Smile!</div>
        </>
      )}
      {/*Take Photo*/}
      {phase === 2 && !animationStarted && (
        <button
          className={`${styles.movebtn} ${styles.takePhoto}`}
          onClick={() => {
            onStartTimer();
            animation(5);
            onTakePhoto();
          }}
        >
          사진 찍기!
        </button>
      )}
      {phase === 2 && !imgfile && photoAnimation}
      {phase === 3 && imgfile && (
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

      {phase === 3 && <>
      {version !== 'mobile' && <>
          <img
            src={SmileImage}
            alt="SmileImage"
            style={{
              gridArea: "img",
              justifySelf: "center",
              alignSelf: "center",
              width: 500,
            }}/>
          <div className={styles.smile}>Smile!</div>
        </>}
        <button
          className={`${styles.movebtn} ${styles.takePhoto}`}
          onClick={() => {
            setPhase(4);
            animation(5);
            onTakePhoto();
            onStartTimer();
          }}
        >
          {version==='mobile' ? <img src={camera} className={styles.camera}/> : "준비 완료!"}
        </button></>}

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
      {(phase === 1 || (phase === 3 && imgfile)) && (
        <button
          className={`${styles.movebtn} ${styles.nextbtn}`}
          onClick={() => setPhase((prev) => prev + 1)}
        >
          NEXT
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
          >
            RE?
          </button>
          <button
            className={`${styles.lastbtn} ${styles.save}`}
            onClick={onSavePhoto}
          >
            {isLoading ? (
              <img width="50" src={loading} className={styles.loading} />
            ) : (
              "SAVE"
            )}
          </button>
        </>
      )}
      {!whileTimer && (
        <button className={styles.close} onClick={onCloseModal}>
          X
        </button>
      )}
    </div>
  );
};

export default FrameButtons;
