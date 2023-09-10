import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import styles from "./PhotoModal.module.css";
import Webcam from "react-webcam";
import {
  getStorage,
  ref as sRef,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { db } from "../Utility/firebase";
import {
  collection,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore/lite";
import FrameButtons from "../common/FrameButtons";
//sounds
import EffectSound from "../common/EffectSound";
import effect from "../assets/sounds/camera-shutter.wav";
//images
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
const BackDrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Modal = ({ onCloseModal, version }) => {
  //등장 animation
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef && version === "mobile") {
      const popup = setTimeout(() => {
        containerRef.current.style.top = "0";
      }, 100);
      return () => clearTimeout(popup);
    } else if (containerRef) {
      const popup = setTimeout(() => {
        containerRef.current.style.top = "5vh";
      }, 100);
      return () => clearTimeout(popup);
    }
  }, []);
  const closeModalHandler = () => {
    containerRef.current.style.top = "100vh";
    const close = setTimeout(() => {
      onCloseModal();
    }, 600);
    return () => clearTimeout(close);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [imgfile, setImgfile] = useState(null);
  const [imgpreview, setImgpreview] = useState(null);
  const [whileTimer, setWhileTimer] = useState(false);
  const startTimer = () => setWhileTimer(true);

  //sound
  const es = EffectSound(effect, 1);
  const playES = () => {
    es.play();
  };

  const createBlankAlbum = useCallback(async () => {
    const id = new Date().getTime() % 100000000;
    const timestamp = serverTimestamp();
    const newPhoto = {
      id: +id,
      type: "blank",
      timestamp: timestamp,
      vidConfig: vidConfigIdx,
    };
    try {
      const photos = collection(db, "Photos");
      await setDoc(doc(photos, `${id}`), newPhoto);
    } catch (error) {
      console.log(error);
      return;
    }
  }, []);

  // useEffect(() => {
  //   const random = Math.floor(Math.random() * 3);
  //   if (!random) {
  //     createBlankAlbum();
  //   }
  // }, [modalOpened]);

  useEffect(() => {
    if (imgfile) {
      setImgpreview(
        <img
          className={styles.imgpreview}
          style={{
            height: "100%",
            // height: vidConfigList[vidConfigIdx].height,
            apsectRatio: 3 / 4,
          }}
          src={imgfile}
          alt="preview"
        />
      );
      console.log("photo taken");
    } else {
      setImgpreview(null);
    }
  }, [imgfile]);

  const webcamRef = useRef(null);

  const [vidConfigIdx, setVidConfigIdx] = useState(0);
  const [skinIdx, setSkinIdx] = useState(1);

  const selectVidConfigHandler = (idx) => setVidConfigIdx(idx);
  const selectSkinHandler = (idx) => setSkinIdx(idx);

  const storage = getStorage();

  const saveToFirebaseStorage = async (file, saveToFireStore) => {
    const id = new Date().getTime();
    const storageRef = sRef(storage, "Images/" + id);
    console.log("saved to fireStorage");
    try {
      setIsLoading(true);
      await uploadString(storageRef, file, "data_url");
      const geturl = await getDownloadURL(sRef(storage, storageRef));
      await saveToFireStore(geturl);
      console.log("Image url: " + geturl);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const saveToFireStore = async (imgurl) => {
    let id = new Date().getTime() % 100000000;
    const timestamp = serverTimestamp();

    const newPhoto = {
      id: +id,
      type: "photo",
      url: imgurl,
      vidConfig: vidConfigIdx,
      skin: skinIdx,
      timestamp: timestamp,
    };
    try {
      const photos = collection(db, "Photos");
      await setDoc(doc(photos, `${id}`), newPhoto);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const takePhoto = useCallback(() => {
    const timer = setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgfile(imageSrc);

      playES();
      setWhileTimer(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [webcamRef]);

  const savePhoto = async () => {
    await saveToFirebaseStorage(imgfile, saveToFireStore);
    if (version === "mobile") closeModalHandler();
    else onCloseModal();
    window.location.reload();
  };

  const deletePhoto = () => {
    setImgfile(null);
  };

  const skinList = [
    [design1_square, design1_vertical, design1_horizontal],
    [design2_square, design2_vertical, design2_horizontal],
    [design3_square, design3_vertical, design3_horizontal],
    [design4_square, design4_vertical, design4_horizontal],
  ];

  const classNameByConfig =
    vidConfigIdx === 0
      ? styles.square
      : vidConfigIdx === 1
      ? styles.vertical
      : styles.horizontal;

  const classNameBySkin =
    skinIdx === 0
      ? styles.default
      : skinIdx === 1
      ? styles.opt1
      : skinIdx === 2
      ? styles.opt2
      : skinIdx === 3
      ? styles.opt3
      : styles.opt4;

  const image = skinList[skinIdx - 1][vidConfigIdx];
  const skinElement = <img className={styles.skinElement} src={image} />;

  const [photoAnimation, setPhotoAnimation] = useState();
  const animation = useCallback((time) => {
    // setAnimationStarted(true);
    let cnt = time;
    const timer = setInterval(() => {
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
    // const setTimer = setTimeout(() => {
    //   setPhase((prev) => prev + 1);
    //   setAnimationStarted(false);
    // }, 6000);

    // return () => clearTimeout(setTimer);
  });
  return (
    <div className={styles.container} ref={containerRef}>
      <div className={`${styles.cam_container} ${classNameBySkin}`}>
        {version === "mobile" && photoAnimation}
        {skinElement}
        <div className={`${styles.cam_mask} ${classNameByConfig}`}>
          {imgpreview}
          {imgfile && <div className={styles.shutter}></div>}
          {version === "mobile" ? (
            <Webcam
              className={styles.webcam}
              audio={false}
              width={"100%"}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored={true}
              imageSmoothing={true}
            />
          ) : (
            <Webcam
              className={styles.webcam}
              audio={false}
              height={"100%"}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored={true}
              imageSmoothing={true}
            />
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <FrameButtons
          isLoading={isLoading}
          imgfile={imgfile}
          whileTimer={whileTimer}
          photoAnimation={photoAnimation}
          onStartAnimation={animation}
          onStartTimer={startTimer}
          onTakePhoto={takePhoto}
          onSavePhoto={savePhoto}
          onDeletePhoto={deletePhoto}
          onCloseModal={closeModalHandler}
          onFrameSelect={selectVidConfigHandler}
          onSkinSelect={selectSkinHandler}
          version={version}
        />
      </div>
    </div>
  );
};

const PhotoModal = ({ onCloseModal, version }) => {
  return (
    <>
      {ReactDOM.createPortal(
        <BackDrop />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <Modal onCloseModal={onCloseModal} version={version} />,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default PhotoModal;
