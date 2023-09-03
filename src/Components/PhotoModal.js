import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
//css
import styles from "./PhotoModal.module.css";
//framework
import Webcam from "react-webcam";
//firebase
import {
  getStorage,
  ref as sRef,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { db } from "../Utility/firebase";
import { async } from "@firebase/util";
import {
  collection,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore/lite";
//Components
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

const BackDrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Modal = ({ onToggleModalHandler, modalOpened }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgfile, setImgfile] = useState(null);
  const [imgpreview, setImgpreview] = useState(null);

  //sound
  const es = EffectSound(effect, 1);
  const playES = () => {
    es.play();
  };
  //images
  let skinElement;

  const createBlankAlbum = useCallback(async () => {
    const id = new Date().getTime() % 200000000;
    const timestamp = serverTimestamp();
    const newPhoto = {
      id: +id,
      url: "blank",
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
  //     console.log("�� �ٹ� ������");
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
  const [skinIdx, setSkinIdx] = useState(0);
  const curWidth = vidConfigList[vidConfigIdx].width;
  const curHeight = vidConfigList[vidConfigIdx].height;
  const [photoAnimation, setPhotoAnimation] = useState(null);

  const selectVidConfigHandler = (idx) => setVidConfigIdx(idx);
  const selectSkinHandler = (idx) => setSkinIdx(idx);

  const animation = useCallback(
    (time) => {
      let cnt = time;
      const timer = setInterval(() => {
        console.log(cnt);
        if (cnt > 0) {
          // console.log("count executed");

          setPhotoAnimation(
            <div
              className={`${styles.animation} ${styles.counting}`}
              style={{ height: curHeight, width: curWidth }}
            >
              {cnt}
            </div>
          );
          cnt--;
        } else {
          setPhotoAnimation(
            <div
              className={`${styles.animation} ${styles.shooting}`}
              style={{ height: curHeight, width: curWidth }}
            ></div>
          );
          clearInterval(timer);
        }
      }, 1000);
    },
    [vidConfigIdx, vidConfigList]
  );

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
    window.location.reload();
  };

  const saveToFireStore = async (imgurl) => {
    let id = new Date().getTime() % 200000000;
    const timestamp = serverTimestamp();
    console.log("���� url: " + imgurl);
    const newPhoto = {
      id: +id,
      url: imgurl,
      vidConfig: vidConfigIdx,
      skin: skinIdx,
      timestamp: timestamp,
    };
    console.log("{" + imgurl + " id: " + id + "}");
    try {
      const photos = collection(db, "Photos");
      await setDoc(doc(photos, `${id}`), newPhoto);
      console.log("firestore ��ü ������");
    } catch (error) {
      console.log(error);
      return;
    }
    window.location.reload();
  };

  const takePhoto = useCallback(() => {
    animation(5);
    const timer = setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgfile(imageSrc);
      console.log("imgfile �����");
      playES();
    }, 6000);
    return () => clearTimeout(timer);
  }, [webcamRef, animation]);

  const savePhoto = async () => {
    onToggleModalHandler();
    await saveToFirebaseStorage(imgfile, saveToFireStore);
    console.log("���� ���� �Ϸ�");
  };

  const deletePhoto = () => {
    setImgfile(null);
  };

  //???????????
  const classNameByConfig =
    vidConfigIdx === 0
      ? styles.square
      : vidConfigIdx === 1
      ? styles.vertical
      : styles.horizontal;

  const classNameBySkin =
    skinIdx === 0
      ? styles.opt0
      : skinIdx === 1
      ? styles.opt1
      : skinIdx === 2
      ? styles.opt2
      : styles.opt3;
  //???�� ???
  if (skinIdx === 0) {
    const image =
      vidConfigIdx === 0
        ? design1_square
        : vidConfigIdx === 1
        ? design1_vertical
        : design1_horizontal;

    skinElement = (
      <img className={styles.skinElement} src={image} width="933" />
    );
  }
  //?��?�� ???
  else if (skinIdx === 1) {
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
  }
  //????�� ???
  else if (skinIdx === 2) {
    // const image =
    //   vidConfigIdx === 0
    //     ? design1_square
    //     : vidConfigIdx === 1
    //     ? design1_vertical
    //     : design1_horizontal;
    // skinElement = (
    //   <>
    //     {vidConfigIdx === 1 && <div></div>}
    //     <img className={styles.skinElement} src={image} width="933" />
    //   </>
    // );
  }
  //???�� ???
  else {
    // if (vidConfigIdx === 0) {
    //   setSkinElement();
    // } else if (vidConfigIdx === 1) {
    //   setSkinElement();
    // } else {
    //   setSkinElement();
    // }
  }
  return (
    <div className={styles.container}>
      <div className={`${styles.cam_container} ${classNameBySkin}`}>
        {skinElement}
        <div className={`${styles.cam_mask} ${classNameByConfig}`}>
          {photoAnimation}
          {imgpreview}
          <Webcam
            className={styles.webcam}
            audio={false}
            height={curHeight}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={true}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <FrameButtons
          isLoading={isLoading}
          imgfile={imgfile}
          onTakePhoto={takePhoto}
          onSavePhoto={savePhoto}
          onDeletePhoto={deletePhoto}
          onToggleModalHandler={onToggleModalHandler}
          onFrameSelect={selectVidConfigHandler}
          onSkinSelect={selectSkinHandler}
        />
      </div>
    </div>
  );
};

const PhotoModal = ({ onToggleModalHandler, modalOpened }) => {
  return (
    <>
      {ReactDOM.createPortal(
        <BackDrop />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <Modal
          onToggleModalHandler={onToggleModalHandler}
          modalOpened={modalOpened}
        />,
        document.getElementById("PhotoModal-root")
      )}
    </>
  );
};

export default PhotoModal;
