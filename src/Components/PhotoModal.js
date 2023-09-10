import React, { useState, useRef, useEffect, useCallback } from "react";
import { useContext } from "react";
import DisplayContext from "../Context/context/Display";
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
import { ReactComponent as Design1_square } from "../assets/skins/design1_square.svg";
import { ReactComponent as Design1_horizontal } from "../assets/skins/design1_horizontal.svg";
import { ReactComponent as Design1_vertical } from "../assets/skins/design1_vertical.svg";
import { ReactComponent as Design2_square } from "../assets/skins/design2_square.svg";
import { ReactComponent as Design2_horizontal } from "../assets/skins/design2_horizontal.svg";
import { ReactComponent as Design2_vertical } from "../assets/skins/design2_vertical.svg";
import { ReactComponent as Design3_square } from "../assets/skins/design3_square.svg";
import { ReactComponent as Design3_horizontal } from "../assets/skins/design3_horizontal.svg";
import { ReactComponent as Design3_vertical } from "../assets/skins/design3_vertical.svg";
import { ReactComponent as Design4_square } from "../assets/skins/design4_square.svg";
import { ReactComponent as Design4_horizontal } from "../assets/skins/design4_horizontal.svg";
import { ReactComponent as Design4_vertical } from "../assets/skins/design4_vertical.svg";
import ConvertCamera from "../assets/Images/convertCamera.png";
const BackDrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Modal = ({ onCloseModal, version }) => {
  const darkmode = useContext(DisplayContext).darkmode;
  const mobile = version === "mobile";
  //등장 animation
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef && mobile) {
      const popup = setTimeout(() => {
        containerRef.current.style.bottom = "0";
      }, 100);
      return () => clearTimeout(popup);
    } else if (containerRef) {
      const popup = setTimeout(() => {
        containerRef.current.style.top = "2.5vh";
      }, 100);
      return () => clearTimeout(popup);
    }
  }, []);

  const closeModalHandler = () => {
    if (mobile) {
      containerRef.current.style.bottom = "-100%";
      const close = setTimeout(() => {
        onCloseModal();
      }, 600);
      return () => clearTimeout(close);
    } else {
      containerRef.current.style.top = "100vh";
      const close = setTimeout(() => {
        onCloseModal();
      }, 600);
    }
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
  //   const random = Math.floor(Math.random() * 4);
  //   if (!random) {
  //     createBlankAlbum();
  //   }
  // }, [modalOpened]);

  useEffect(() => {
    if (imgfile) {
      setImgpreview(
        <img
          className={styles.imgpreview}
          width={mobile ? "100%" : ""}
          height={mobile ? "" : "100%"}
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
  const [skinIdx, setSkinIdx] = useState(0);

  const selectVidConfigHandler = (idx) => setVidConfigIdx(idx);
  const selectSkinHandler = (idx) => setSkinIdx(idx);

  /*firebase function*/
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
      mobile: mobile,
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
    if (mobile) closeModalHandler();
    else onCloseModal();
    window.location.reload();
  };

  const deletePhoto = () => {
    setImgfile(null);
  };

  const skinList = [
    [
      <Design1_square className={styles.skinElement} />,
      <Design1_vertical className={styles.skinElement} />,
      <Design1_horizontal className={styles.skinElement} />,
    ],
    [
      <Design2_square className={styles.skinElement} />,
      <Design2_vertical className={styles.skinElement} />,
      <Design2_horizontal className={styles.skinElement} />,
    ],
    [
      <Design3_square className={styles.skinElement} />,
      <Design3_vertical className={styles.skinElement} />,
      <Design3_horizontal className={styles.skinElement} />,
    ],
    [
      <Design4_square className={styles.skinElement} />,
      <Design4_vertical className={styles.skinElement} />,
      <Design4_horizontal className={styles.skinElement} />,
    ],
  ];
  const skinElement = skinIdx ? skinList[skinIdx - 1][vidConfigIdx] : null;

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

  const [photoAnimation, setPhotoAnimation] = useState();
  const animation = useCallback((time) => {
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
  });

  const [faceMode, setFaceMode] = useState("user");
  const handleFacingMode = useCallback(() => {
    setFaceMode((prevState) => (prevState === "user" ? "environment" : "user"));
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={`${styles.cam_container} ${classNameBySkin}`}>
        {mobile && photoAnimation}
        {skinElement}
        {version === "mobile" && !imgfile && !photoAnimation && (
          <img
            src={ConvertCamera}
            alt="convertcamera"
            className={styles.convertCamera}
            onClick={handleFacingMode}
          />
        )}
        <div className={`${styles.cam_mask} ${classNameByConfig}`}>
          {imgpreview}
          {imgfile && <div className={styles.shutter}></div>}

          {!imgfile && (
            <Webcam
              className={styles.webcam}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              audio={false}
              mirrored={true}
              imageSmoothing={true}
              width={mobile ? "100%" : ""}
              height={mobile ? "" : "100%"}
              style={{ position: "absolute" }}
              facingMode={faceMode}
            />
          )}
        </div>
      </div>

      <div
        className={styles.actions}
        style={{ backgroundColor: darkmode ? "#C9B3EF" : "#C9B3EF" }}
      >
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
