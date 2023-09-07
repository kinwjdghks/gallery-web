import React, { useState, useRef, useEffect, useCallback, useTransition } from "react";
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
import triangle from "../assets/Images/triangle.svg";
import camera from "../assets/Images/camera.png";
const BackDrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Modal = ({ onCloseModal,version }) => {
  //등장 animation
    const containerRef = useRef(null);
    useEffect(()=>{
      if(containerRef){
        setTimeout(()=>{
          containerRef.current.style.top = '3vh';
        },100);
      }
    },[]);
  const closeModalHandler = () =>{
    containerRef.current.style.top = '100vh';
    setTimeout(()=>{
       onCloseModal();
    },600);
    
  }
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
  //images
  let skinElement;

  const createBlankAlbum = useCallback(async () => {
    const id = new Date().getTime() % 100000000;
    const timestamp = serverTimestamp();
    const newPhoto = {
      id: +id,
      type: 'blank',
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
            height: vidConfigList[vidConfigIdx].height,
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

  const vidConfigList = [
    { width: 800, height: 800 },
    { width: 600, height: 800 },
    { width: 800, height: 600 },
  ];
  const [vidConfigIdx, setVidConfigIdx] = useState(0);
  const [skinIdx, setSkinIdx] = useState(1);
  const curWidth = vidConfigList[vidConfigIdx].width;
  const curHeight = vidConfigList[vidConfigIdx].height;

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
      type:'photo',
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
    if(version==='mobile') closeModalHandler();
    else onCloseModal();
    window.location.reload();
  };

  const deletePhoto = () => {
    setImgfile(null);
  };

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

  if (skinIdx === 1) {
    const image =
      vidConfigIdx === 0
        ? design1_square
        : vidConfigIdx === 1
        ? design1_vertical
        : design1_horizontal;

    skinElement = (
      <img className={styles.skinElement} src={image} width="933" />
    );
  } else if (skinIdx === 2) {
    const image =
      vidConfigIdx === 0
        ? design2_square
        : vidConfigIdx === 1
        ? design2_vertical
        : design2_horizontal;

    skinElement = (
      <>
        {vidConfigIdx === 1 && (
          <div className={styles.skkucomit}>
            <p className={styles.skku}>SKKU</p>
            <p className={styles.comit}>COMIT</p>
          </div>
        )}
        <img className={styles.skinElement} src={image} width="933" />
      </>
    );
  } else if (skinIdx === 3) {
    const image =
      vidConfigIdx === 0
        ? design3_square
        : vidConfigIdx === 1
        ? design3_vertical
        : design3_horizontal;
    const width_ = vidConfigIdx === 0 ? 960 : vidConfigIdx === 1 ? 1150 : 880;
    skinElement = (
      <>
        {vidConfigIdx === 1 && (
          <div>
            <div className={styles.skkucomit}>
              <p className={styles.skku}>SKKU</p>
              <p className={styles.comit}>COMIT</p>
            </div>
          </div>
        )}
        <img
          className={`${styles.skinElement} ${styles.design3} ${classNameByConfig}`}
          src={image}
          width={width_}
        />
      </>
    );
  } else if (skinIdx === 4) {
    skinElement = (
      <>
        <div className={styles.borderText}>
          <p className={styles.up}>COMIT FILM</p>
          <p className={`${styles.right} ${classNameByConfig}`}>
            TAKE YOUR MEMORY
          </p>
          <div className={styles.left}>
            <p style={{ display: "inline" }}>11</p>
            <img width="26" src={triangle} />
          </div>
          <p className={`${styles.down} ${classNameByConfig}`}>29</p>
          {vidConfigIdx !== 0 && (
            <img
              className={`${styles.camera} ${classNameByConfig}`}
              src={camera}
              width="170"
            />
          )}
        </div>
      </>
    );
  }
  return (
    <div className={styles.container} ref={containerRef}>
      <div className={`${styles.cam_container} ${classNameBySkin}`}>
        {skinElement}
        <div className={`${styles.cam_mask} ${classNameByConfig}`}>
          {imgpreview}
          {imgfile && <div className={styles.shutter}></div>}
          {/* <Webcam
            className={styles.webcam}
            audio={false}
            height={curHeight}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={true}
          /> */}
        </div>
      </div>

      <div className={styles.actions}>
        <FrameButtons
          isLoading={isLoading}
          imgfile={imgfile}
          whileTimer={whileTimer}
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
        <Modal
          onCloseModal={onCloseModal}
          version={version}
        />,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default PhotoModal;
