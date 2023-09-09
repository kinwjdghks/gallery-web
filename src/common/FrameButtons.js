import { React, useState, useCallback, useEffect } from "react";
//imports
import Button from "./Button";
//css
import styles from "./FrameButtons.module.css";
//images
import SmileImage from "../assets/Images/smile.svg";
import ThumbImage from "../assets/Images/thumb.png";
import loading from "../assets/Images/loading.svg";
import camera_btn from "../assets/Images/camera_btn_black.svg";
import design1_square from "../assets/skins/design1_square.svg";
import design1_horizontal from "../assets/skins/design1_horizontal.svg";
import design1_vertical from "../assets/skins/design1_vertical.svg";
import design2_square from "../assets/skins/design2_square.svg";
import design2_horizontal from "../assets/skins/design2_horizontal.svg";
import design2_vertical from "../assets/skins/design2_vertical.svg";
import design3_square from "../assets/skins/design3_square.svg";
import design3_horizontal from "../assets/skins/design3_horizontal.svg";
import design3_vertical from "../assets/skins/design3_vertical.svg";
import design4_square from "../assets/skins/design4_square.svg";
import design4_horizontal from "../assets/skins/design4_horizontal.svg";
import design4_vertical from "../assets/skins/design4_vertical.svg";
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
  const [skinHovered,setSkinHovered] = useState(1);
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
      {phase === 2 && <>
        
        {version ==='mobile' &&
        <>
        {/* mobile */}
          <div
            className={styles.takePhoto_mobile}
            onClick={() => {
              onStartTimer();
              onStartAnimation(5);
              setPhase((prev)=>prev+1);
              onTakePhoto();
            }}>
            <img src={camera_btn} alt="camera" style={{ height: '75%' }} />
          </div>
          <Button
            children="뒤로가기"
            width="60%"
            height="60px"
            onClick={() => {
              onCloseModal();
            }}
            classes="cancel"
          />
          </>
         }
         {version !== "mobile" && !animationStarted && (
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
              children="사진 찍기!"
              width="80%"
              height="100px"
              onClick={() => {
                onStartTimer(); //5초 
                onStartAnimation(5);
                onTakePhoto();
                setPhase((prev)=>prev+1);
              }}
              classes="popup movebtn takePhoto"
            />
          </>)}
        </>}
 

      {/* PHASE 3: after photo */}

      {phase === 3 && version==='mobile' && !animationStarted && !imgfile &&  <>
      <img
              src={SmileImage}
              alt="SmileImage"
              style={{
                gridArea: "img",
                justifySelf: "center",
                alignSelf: "center",
                width: "30%",
              }}
            />
            <div className={styles.smileText}>Smile!</div>
      </>}
      {phase === 3 && version !== 'mobile' && !imgfile && photoAnimation}
      {phase === 3 && imgfile && (
        <>
          <img
            src={ThumbImage}
            alt="ThumbImage"
            style={{
              width: version==='mobile' ? '30%' : '50%',
              gridArea: "img",
              justifySelf: "center",
              alignSelf: "center",
            }}
          />
          <Button
            children="다시 찍기"
            width={version === "mobile" ? "60%" : "95%"}
            height={version === "mobile" ? "60px" : "100px"}
            onClick={() => {
              againHandler();
              setPhase(2);
            }}
            classes={version === "mobile" ? "again" : "popup again"}
          />
          <Button
            children="다음"
            width={version === "mobile" ? "60%" : "95%"}
            height={version === "mobile" ? "60px" : "100px"}
            onClick={() => setPhase((prev) => prev + 1)}
            classes="popup next"
            // classes="movebtn nextbtn"
          />
        </>
      )}


      {/* {phase === 4 && imgfile && ( */}
      {/* {version !== "mobile" && phase === 3 && (
        <>
          <Button
            children="RE?"
            width="80%"
            height="150px"
            onClick={() => {
              againHandler();
              setPhase(1);
              onFrameSelect(0);
            }}
            classes="popup lastbtn again"
          />
          <Button
            children="저장"
            width="80%"
            height="150px"
            onClick={onSavePhoto}
            classes="popup lastbtn save"
          >
            {isLoading ? (
              <img width="50" src={loading} className={styles.loading} />
            ) : (
              "SAVE"
            )}
          </Button>
        </>
      )} */}

      {phase === 4 && (
        <>
          <button
            className={`${styles.skinbtn} ${styles.skin1}`}
            onClick={() => onSkinSelect(1)}
          >
            {/* <img
              className={`${styles.btndesign} ${styles.skin1}`}
              width="287" //PC
              src={building}
              alt="btndesign"
            /> */}
          </button>

          <button
            className={`${styles.skinbtn} ${styles.skin2}`}
            onClick={() => onSkinSelect(2)}
          >
            {/* <img
              className={`${styles.btndesign} ${styles.skin2}`}
              width="300"
              src={temple}
              alt="btndesign"
            /> */}
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

          </button>
          <Button
            children="뒤로가기"
            width={version === "mobile" ? "60%" : "95%"}
            height={version === "mobile" ? "60px" : "100px"}
            onClick={()=>{
              onDeletePhoto();
              setPhase((prev)=>prev-2);

            }}
            classes="popup cancel"
          />
          <Button
            children="저장하기"
            width={version === "mobile" ? "60%" : "95%"}
            height={version === "mobile" ? "60px" : "100px"}
            onClick={onSavePhoto}
            classes="popup save"
          >
            {isLoading ? (
              <img width="50" src={loading} className={styles.loading} />
            ) : (
              "저장하기"
            )}
          </Button>
          
        </>
      )}


  {/* PC exit button */}
      {version!=='mobile' && !whileTimer && (
        <button className={styles.close} onClick={onCloseModal}>
          X
        </button>
      )}
    </div>
  );
};

export default FrameButtons;
