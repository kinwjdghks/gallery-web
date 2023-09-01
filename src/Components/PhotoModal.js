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
import { async } from "@firebase/util";
import {
  collection,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore/lite";

/* ������ ���� �� ��Ÿ���� ���
����ڴ� (���η� ��/ ���η� �� / ������ ����) �԰��� �� �� �ְ�,
���� �׵θ� ��Ų�� �� �� �ִ�. (������ 3�� ����, ���� ����)
��޿� 2�� ��ư (�Կ�, ���)�� �����ϸ�, �Կ���ư�� 3�� Ÿ�̸� �� ������ �Կ���.
�Կ� �� �̸����Ⱑ �־����� ���Կ�/ ��� �������� �־�����. (���Կ� ������ ����)
��� ���� Ŭ���ؼ� �������� �ȵǰ� ��� ��ư���θ� ���� ����������.*/

const BackDrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Modal = ({ photoList, onClick }) => {
  //�� ���� ���� ����
  const [imgcnt, setImgcnt] = useState(0);
  //�̹��� ���� �� loading State
  const [isLoading, setIsLoading] = useState(false);
  //�̹��� ������ ���� State
  const [imgurl, setImgurl] = useState("");
  const [imgfile, setImgfile] = useState(null);
  const [imgpreview, setImgpreview] = useState(null);
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

  //���� ��ȭ�� ���� State/refs

  const webcamRef = useRef(null);

  //�Կ� �� ����� �����԰�
  const vidConfigList = [
    { width: 800, height: 800 },
    { width: 675, height: 900 },
    { width: 900, height: 675 },
  ];
  const [vidConfigIdx, setVidConfigIdx] = useState(0);
  const curWidth = vidConfigList[vidConfigIdx].width;
  const curHeight = vidConfigList[vidConfigIdx].height;

  const [photoAnimation, setPhotoAnimation] = useState(null);

  const animation = useCallback(
    (time) => {
      let cnt = time;
      const timer = setInterval(() => {
        if (cnt > 0) {
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

  /* database ���� �Լ���*/
  const saveToFirebaseStorage = async (file) => {
    const id = new Date().getTime();
    const metaData = {
      contentType: "image/jpeg",
    };
    const storageRef = sRef(storage, "Images/" + id);
    try {
      setIsLoading(true);
      const upload = await uploadString(storageRef, file, "data_url"); //storage�� �̹��� �����ϰ�
      // console.log(upload)
      const geturl = await getDownloadURL(sRef(storage, storageRef)); //���� ��� �޾ƿ���
      // console.log(geturl);
      setImgurl(geturl.toString());
    } catch (error) {
      console.log(error);
    }
    // console.log(imgurl);
    setIsLoading(false);
  };

  const saveToFireStore = async () => {
    const id = new Date().getTime();
    const timestamp = serverTimestamp();
    const newPhoto = {
      url: imgurl,
      timestamp: timestamp,
      vidConfig: vidConfigIdx, //���� �԰� ����
    };
    try {
      console.log("flag");
      const photos = collection(db, "Photos");
      const response = await setDoc(doc(photos, `${id}`), newPhoto);
    } catch (error) {
      console.log(error);
      return;
    }

    setImgcnt((prev) => prev + 1);
    console.log("saved");
  };

  const storage = getStorage();

  /* �����Կ� ���� �Լ��� */
  const takePhoto = useCallback(
    (e) => {
      e.preventDefault();
      animation(5);
      setTimeout(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgfile(imageSrc);
      }, 6000);
    },
    [webcamRef, animation]
  );
  const savePhoto = () => {
    saveToFirebaseStorage(imgfile); //image -> Storage, need throttling
    saveToFireStore();
  };

  const classNameByConfig =
    vidConfigIdx === 0
      ? styles.square
      : vidConfigIdx === 1
      ? styles.vertical
      : styles.horizontal;

  return (
    <div className={styles.background}>
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
          <div className={styles.countdown}></div>
        </div>

        <div className={styles.actions}>
          <div className={styles.frameOptions}>
            <button
              className={`${styles.btn} ${styles.square}`}
              onClick={() => setVidConfigIdx(0)}
            >
              {" "}
              1:1{" "}
            </button>
            <button
              className={`${styles.btn} ${styles.vertical}`}
              onClick={() => setVidConfigIdx(1)}
            >
              3:4{" "}
            </button>
            <button
              className={`${styles.btn} ${styles.horizontal}`}
              onClick={() => setVidConfigIdx(2)}
            >
              4:3
            </button>
          </div>

          {/* <div className={styles.skinOptions}>
            <button
              className={`${styles.btn} ${styles.skin1}`}
              onClick={() => {}}
            >
              A
            </button>
            <button
              className={`${styles.btn} ${styles.skin2}`}
              onClick={() => {}}
            >
              B
            </button>
            <button
              className={`${styles.btn} ${styles.skin3}`}
              onClick={() => {}}
            >
              C
            </button>
          </div> */}

          {!isLoading && !imgfile && (
            <button
              className={`${styles.btn} ${styles.photo}`}
              onClick={takePhoto}
            >
              {" "}
              Take Picture
            </button>
          )}

          {imgfile && (
            <button
              className={`${styles.btn} ${styles.retake}`}
              onClick={() => setImgfile(null)}
            >
              {" "}
              �ٽ����
            </button>
          )}

          {imgfile && (
            <button
              className={`${styles.btn} ${styles.save}`}
              onClick={savePhoto}
            >
              {" "}
              ����
            </button>
          )}
        </div>
      </div>
      {/* <button className={`${styles.btn} ${styles.record}`} onClick={onClick}>
        X
      </button> */}
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
