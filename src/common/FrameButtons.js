import { React, useState, useMemo, useEffect } from "react";
//imports
import Button from "./Button";
//css
import styles from "./FrameButtons.module.css";
//images
import SmileImage from "../assets/Images/smile.svg";
import ThumbImage from "../assets/Images/thumb.png";
import loading from "../assets/Images/loading.svg";
import camera_btn from "../assets/Images/camera_btn.svg";
import design1_vertical from "../assets/skins/design1_vertical.svg";
import design2_vertical from "../assets/skins/design2_vertical.svg";
import design3_vertical from "../assets/skins/design3_vertical.svg";
import design4_vertical from "../assets/skins/design4_vertical.svg";
import smile명륜 from "../assets/Images/smile명륜.svg";

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
  skinIdx,
  version,
}) => {
  const mobile = version === "mobile";
  const [phase, setPhase] = useState(1);
  useEffect(() => {
    console.log(phase);
  }, [phase]);
  //phase 1: frame select / 2: take photo / 3: after photo / 4: skin select
  const [animationStarted, setAnimationStarted] = useState(false);
  const random = useMemo(() => Math.floor(Math.random() * 2), []);
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
      {phase === 1 && (
        <>
          <Button
            width={mobile ? "30vw" : "100%"}
            height={mobile ? "10vh" : "50%"}
            onClick={() => onFrameSelect(0)}
            classes={mobile ? "framebtn square" : "popup square"}
          >
            정방형
          </Button>
          <Button
            // children="세로"
            width={mobile ? "30vw" : "100%"}
            height={mobile ? "10vh" : "50%"}
            onClick={() => onFrameSelect(1)}
            classes={mobile ? "framebtn vertical" : "popup vertical"}
          >
            세로
          </Button>
          <Button
            width={mobile ? "30vw" : "100%"}
            height={mobile ? "10vh" : "50%"}
            onClick={() => onFrameSelect(2)}
            classes={mobile ? "framebtn horizontal" : "popup horizontal"}
          >
            가로
          </Button>
          <Button
            width={mobile ? "80%" : "100%"}
            height={mobile ? "60px" : "100px"}
            onClick={() => {
              setPhase(0);
              onCloseModal();
            }}
            classes={mobile ? "mobile cancel" : "popup cancel"}
          >
            취소
          </Button>
          <Button
            width={mobile ? "80%" : "100%"}
            height={mobile ? "60px" : "100px"}
            onClick={() => setPhase((prev) => prev + 1)}
            classes={mobile ? "mobile save" : "popup save"}
          >
            다음
          </Button>
        </>
      )}
      {/* PHASE 2: before photo */}
      {phase === 2 && (
        <>
          {mobile && (
            <>
              {/* mobile */}
              <div
                className={styles.takePhoto_mobile}
                onClick={() => {
                  onStartTimer();
                  onStartAnimation(5);
                  setPhase((prev) => prev + 1);
                  onTakePhoto();
                }}
              >
                <img src={camera_btn} alt="camera" style={{ height: "65%" }} />
              </div>
              <Button
                width="80%"
                onClick={() => {
                  setPhase((prev) => prev - 1);
                }}
                classes="mobile cancel"
              >
                뒤로가기
              </Button>
            </>
          )}
          {!mobile && !animationStarted && (
            <>
              {/* PC */}
              <img
                src={SmileImage}
                alt="SmileImage"
                style={{
                  gridArea: "img",
                  justifySelf: "center",
                  alignSelf: "center",
                  width: "55%",
                }}
              />
              <div className={styles.smileText}>Smile!</div>
              <Button
                width="80%"
                height="100px"
                onClick={() => {
                  onStartTimer(); //5초
                  onStartAnimation(5);
                  onTakePhoto();
                  setPhase((prev) => prev + 1);
                }}
                classes="popup takePhoto"
              >
                사진 찍기!
              </Button>
            </>
          )}
        </>
      )}

      {/* PHASE 3: after photo */}

      {phase === 3 && mobile && !animationStarted && !imgfile && (
        <>
          <img
            src={smile명륜}
            alt="SmileImage"
            style={{
              gridArea: "1/1/3/3",
              justifySelf: "flex-end",
              alignSelf: "flex-end",
              width: "70%",
            }}
          />
          <div
            style={{
              gridArea: "1/1/2/2",
              justifySelf: "flex-start",
              alignSelf: "flex-start",
              fontSize: "8vw",
              fontFamily: random ? "gangwonedu" : "cocogoose ",
              color: "#603EBB",
              padding: "2vw",
              lineHeight: "100%",
              wordBreak: "keep-all",
            }}
          >
            {random ? "코밋에서 놀자!" : "LET'S COMIT!"}
          </div>
        </>
      )}
      {phase === 3 && version !== "mobile" && !imgfile && photoAnimation}
      {phase === 3 && imgfile && (
        <>
          <img
            src={ThumbImage}
            alt="ThumbImage"
            className={styles.ThumbImage}
            style={{
              width: mobile ? "30%" : "50%",
              gridArea: "img",
              justifySelf: "center",
              alignSelf: "center",
            }}
          />
          <Button
            width={mobile ? "80%" : "95%"}
            height={mobile ? "60px" : "100px"}
            onClick={() => {
              againHandler();
              setPhase(2);
            }}
            classes={mobile ? "mobile again" : "popup again"}
          >
            이게뭐야 다시찍어
          </Button>
          <Button
            width={mobile ? "80%" : "95%"}
            height={mobile ? "60px" : "100px"}
            onClick={() => setPhase((prev) => prev + 1)}
            classes={mobile ? "mobile next" : "popup next"}
          >
            다음
          </Button>
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
              style={{ position: "absolute", bottom: 0, right: 0 }}
              height={mobile ? "200%" : "130%"}
              src={design1_vertical}
              alt="btndesign"
            />
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin2}`}
            onClick={() => onSkinSelect(2)}
          >
            <img
              className={`${styles.btndesign} ${styles.skin1}`}
              style={{ position: "absolute", bottom: 0, right: 0 }}
              height={mobile ? "180%" : "250%"}
              src={design2_vertical}
              alt="btndesign"
            />
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin3}`}
            onClick={() => onSkinSelect(3)}
          >
            <img
              className={`${styles.btndesign} ${styles.skin1}`}
              style={{ position: "absolute", bottom: 0, right: 0 }}
              height="200%"
              src={design3_vertical}
              alt="btndesign"
            />
          </button>
          <button
            className={`${styles.skinbtn} ${styles.skin4}`}
            onClick={() => onSkinSelect(4)}
          >
            <img
              className={`${styles.btndesign} ${styles.skin1}`}
              style={{ position: "absolute", top: 0, right: 0 }}
              height={mobile ? "210%" : "200%"}
              src={design4_vertical}
              alt="btndesign"
            />
          </button>
          <Button
            width={mobile ? "80%" : "95%"}
            height={mobile ? "60px" : "100px"}
            onClick={() => {
              setPhase(2);
              onDeletePhoto();
              onSkinSelect(0);
            }}
            classes={mobile ? "mobile cancel" : "popup cancel"}
          >
            취소하기
          </Button>
          {skinIdx ? (
            <Button
              width={mobile ? "80%" : "95%"}
              height={mobile ? "60px" : "100px"}
              onClick={onSavePhoto}
              classes={mobile ? "mobile save" : "popup save"}
            >
              {isLoading ? (
                <img width="50" src={loading} className={styles.loading} />
              ) : (
                "저장하기"
              )}
            </Button>
          ) : null}
        </>
      )}

      {/* PC exit button */}
      {version !== "mobile" && !whileTimer && (
        <button className={styles.close} onClick={onCloseModal}></button>
      )}
    </div>
  );
};

export default FrameButtons;
