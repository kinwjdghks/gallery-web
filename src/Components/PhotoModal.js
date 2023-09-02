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

const BackDrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Modal = ({ photoList, onClick }) => {
  const [blankBuffer, setBlankBuffer] = useState(Math.floor(Math.random() * 4)); //���� �������� BlankAlbum �����ϱ�
  const [isLoading, setIsLoading] = useState(false);
  const [imgurl, setImgurl] = useState("");
  const [imgfile, setImgfile] = useState(null);
  const [imgpreview, setImgpreview] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  //sound
  const es = EffectSound(effect, 1);
  const playES = () => {
    es.play();
  };
  //�������� ��� ���� �� �� image��ü ������
  const createBlankAlbum = useCallback(async () => {
    const id = new Date().getTime();
    const timestamp = serverTimestamp();
    const newPhoto = {
      url: "blank",
      timestamp: timestamp,
    };
    try {
      const photos = collection(db, "Photos");
      const response = await setDoc(doc(photos, `${id}`), newPhoto);
    } catch (error) {
      console.log(error);
      return;
    }
    console.log("Blank Album �������");
  }, []);

  useEffect(() => {
    if (blankBuffer === 0) {
      createBlankAlbum();
      setBlankBuffer(Math.floor(Math.random() * 4));
    }
  }, [blankBuffer]);

  //���� �Կ� �� preview �̹��� ����
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
  const curWidth = vidConfigList[vidConfigIdx].width;
  const curHeight = vidConfigList[vidConfigIdx].height;

  const [photoAnimation, setPhotoAnimation] = useState(null);

  const animation = useCallback(
    (time) => {
      let cnt = time;
      const timer = setInterval(() => {
        console.log(cnt);
        if (cnt > 0) {
          console.log("count executed");
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

  const saveToFirebaseStorage = async (file,saveToFireStore) => {
    const id = new Date().getTime();
    const storageRef = sRef(storage, "Images/" + id);
    console.log("saved to fireStorage");
    try {
      setIsLoading(true);
      const upload = await uploadString(storageRef, file, "data_url");
      // console.log(upload)
      const geturl = await getDownloadURL(sRef(storage, storageRef));
      saveToFireStore(geturl);
      console.log(geturl);
      setImgurl(geturl); //미리보기용
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const saveToFireStore = async (imgurl) => {
    let id = new Date().getTime();
    const timestamp = serverTimestamp();
    const newPhoto = {
      id: +id,
      url: imgurl,
      timestamp: timestamp,
      vidconfig: vidConfigIdx
    };
    try {
      const photos = collection(db, "Photos");
      const response = await setDoc(doc(photos, `${id}`), newPhoto);
    } catch (error) {
      console.log(error);
      return;
    }

    console.log("image firebase sent");
  };

  const storage = getStorage();

  const takePhoto = useCallback(
    (e) => {
      setPhotoTaken(true);
      e.preventDefault();
      animation(5);
      const timer = setTimeout(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgfile(imageSrc);
        playES();
      }, 6000);
      return () => clearTimeout(timer);
    },
    [webcamRef, animation]
  );
  const savePhoto = () => {
    console.log("savePhoto executed");
    saveToFirebaseStorage(imgfile,saveToFireStore);
    setBlankBuffer((prev) => prev--);
    onClick();
  };

  const deletePhoto = () => {
    setPhotoTaken(false);
    setImgfile(null);
  };

  const classNameByConfig =
    vidConfigIdx === 0
      ? styles.square
      : vidConfigIdx === 1
      ? styles.vertical
      : styles.horizontal;

  const clickHandler = (index) => {
    setVidConfigIdx(index);
  };
  return (
    <div className={styles.container}>
      <div className={styles.cam_container}>
        <div className={`${styles.cam_mask} ${classNameByConfig}`}>
          {photoAnimation}
          {imgpreview}
          <Webcam
            className={`${styles.webcam} ${classNameByConfig}`}
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
          clicked={clickHandler}
          isLoading={isLoading}
          imgfile={imgfile}
          photoTaken={photoTaken}
          onTakePhoto={takePhoto}
          onSavePhoto={savePhoto}
          onDeletePhoto={deletePhoto}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

const PhotoModal = ({ photoList, onClick }) => {
  return (
    <>
      {ReactDOM.createPortal(
        <BackDrop />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <Modal photoList={photoList} onClick={onClick} />,
        document.getElementById("PhotoModal-root")
      )}
    </>
  );
};

export default PhotoModal;
