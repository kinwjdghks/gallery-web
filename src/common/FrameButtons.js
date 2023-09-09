import { React, useState, useCallback, useEffect } from "react";
//imports
import Button from "./Button";
//css
import styles from "./FrameButtons.module.css";
//images
import SmileImage from "../assets/Images/smile.svg";
import ThumbImage from "../assets/Images/thumb.png";
import building from "../assets/skins/design1_square.svg";
import loading from "../assets/Images/loading.svg";
import camera_btn from "../assets/Images/camera_btn_black.svg";
import temple from "../assets/Images/camera_btn_black.svg";
const FrameButtons = ({
  isLoading,
  imgfile,
  whileTimer,
  photoAnimation,
  onStartAnimation,
  onStartTimer,
  onTakePhoto,
  onSavePhoto,
  onDeletePhoto,
  onCloseModal,
  onFrameSelect,
  onSkinSelect,
  version,
}) => {
  const [phase, setPhase] = useState(2);
  useEffect(() => {
    console.log(phase);
  }, [phase]);
  //phase 1: frame select / 2: take photo / 3: after photo / 4: skin select
  const [animationStarted, setAnimationStarted] = useState(false);

  const againHandler = () => {
    onDeletePhoto();
  };
  const classNameByConfig =
    phase === 1
      ? styles.frame
      : phase === 2
      ? styles.beforePhoto
      : phase === 3
      ? styles.afterPhoto
      : styles.skin;

  return (
    <div className={`${styles.container} ${classNameByConfig}`}>
      {version !== "mobile" && (
        <div className={styles.text}>
          <p className={styles.comit}>COMIT</p>
          <p className={styles.photobooth}>Photo Booth</p>
        </div>
      )}
      {/* PHASE 1:  frame selection */}

      {/* PHASE 2: before photo */}
      {/* PC */}
      {version !== "mobile" && phase === 2 && !animationStarted && (
        <>
          <img
            src={SmileImage}
            alt="SmileImage"
            style={{
              gridArea: "img",
              justifySelf: "center",
              alignSelf: "center",
              width: "65%",
            }}
          />
          <div className={styles.smileText}>Smile!</div>

          <Button
            children="사진 찍기!"
            width="100%"
            height="150px"
            onClick={() => {
              onStartTimer();
              onStartAnimation(5);
              onTakePhoto();
            }}
            classes="movebtn takePhoto"
          />
        </>
      )}
      {/* Mobile */}
      {version === "mobile" && phase === 2 && (
        <>
          <div
            className={styles.takePhoto_mobile}
            onClick={() => {
              onStartTimer();
              onStartAnimation(5);
              setPhase(3);
              onTakePhoto();
            }}
          >
            <img src={camera_btn} alt="camera" style={{ height: 120 }} />
          </div>
          <Button children="취소" onClick={() => {}} classes="mobile quit" />
        </>
      )}

      {phase === 4 && (
        <>
          <button
            className={`${styles.skinbtn} ${styles.skin1}`}
            onClick={() => onSkinSelect(1)}
          >
            <img
              className={`${styles.btndesign} ${styles.skin1}`}
              width="287" //PC
              src={building}
              alt="btndesign"
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
              alt="btndesign"
            />
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin3}`}
            onClick={() => onSkinSelect(3)}
          >
            {/* <img
              className={`${styles.btndesign} ${styles.skin3} ${styles.leaves}`}
              width="60"
              src={leaves}
              alt="btndesign"/>
            <img
              className={`${styles.btndesign} ${styles.skin3} ${styles.sungkyuni}`}
              width="250"
              src={sungkyuni}
              alt="btndesign"/> */}
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin4}`}
            onClick={() => onSkinSelect(4)}
          >
            {/* <div className={`${styles.btndesign} ${styles.skin4}`}>
              <p className={styles.comitfilm1}>COMIT FILM</p>
              <p className={styles.comitfilm2}>COMIT FILM</p>
              <p className={styles.comitfilm3}>COMIT FILM</p>
            </div> */}
          </button>
        </>
      )}

      {/* PHASE 2: take photo */}
      {/*Smile Image*/}

      {/* {phase === 2 && !imgfile && photoAnimation} */}
      {phase === 3 && imgfile && (
        <>
          <Button
            children="정방형"
            width="345px"
            height="210px"
            onClick={() => onFrameSelect(0)}
            classes="framebtn square"
          />

          <Button
            children="세로"
            width="345px"
            height="210px"
            onClick={() => onFrameSelect(1)}
            classes="framebtn vertical"
          />

          <Button
            children="가로"
            width="345px"
            height="210px"
            onClick={() => onFrameSelect(2)}
            classes="framebtn horizontal"
          />
        </>
      )}

      {/* {phase === 2 && (
        <>
          {version !== "mobile" && (
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
          <button
            className={`${styles.movebtn} ${styles.takePhoto}`}
            onClick={() => {
              setPhase(4);
              animation(5);
              onTakePhoto();
              onStartTimer();
            }}
          >
            {version === "mobile" ? (
              <img src={camera} className={styles.camera} />
            ) : (
              "준비 완료!"
            )}
          </button>
        </>
      )} */}

      {/* {phase === 3 && !imgfile && photoAnimation} */}
      {phase === 3 && imgfile && (
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
        <Button
          children="저장하기"
          width={version === "mobile" ? "40vw" : "720px"}
          height={version === "mobile" ? "80px" : "150px"}
          onClick={() => setPhase((prev) => prev + 1)}
          classes="movebtn nextbtn"
        />
      )}
      {phase === 3 && imgfile && (
        <>
          <Button
            children="RE?"
            width="380px"
            height="180px"
            onClick={() => {
              againHandler();
              setPhase(1);
              onFrameSelect(0);
            }}
            classes="lastbtn again"
          />
          <Button
            children=""
            width="380px"
            height="180px"
            onClick={onSavePhoto}
            classes="lastbtn save"
          >
            {isLoading ? (
              <img width="50" src={loading} className={styles.loading} />
            ) : (
              "SAVE"
            )}
          </Button>
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
