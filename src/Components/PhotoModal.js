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

/* 사진을 찍을 때 나타나는 모달
사용자는 (가로로 긴/ 세로로 긴 / 정방형 사진) 규격을 고를 수 있고,
사진 테두리 스킨을 고를 수 있다. (선택지 3개 정도, 무지 포함)
모달엔 2개 버튼 (촬영, 취소)이 존재하며, 촬영버튼은 3초 타이머 후 사진이 촬영됨.
촬영 후 미리보기가 주어지며 재촬영/ 등록 선택지가 주어진다. (재촬영 제한은 없음)
모달 밖을 클릭해서 나가지면 안되고 취소 버튼으로만 메인 나가지도록.*/

const BackDrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Modal = ({photoList, onClick}) => {
  //총 찍은 사진 개수
  const [imgcnt, setImgcnt] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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

  //비디오 녹화를 위한 State/refs

  const webcamRef = useRef(null);

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

  const saveToFirebaseStorage = async (file) => {
    const id = new Date().getTime();
    const metaData = {
      contentType: "image/jpeg",
    };
    const storageRef = sRef(storage, "Images/" + id);
    try {
      setIsLoading(true);
      // console.log(upload)
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
                className={`${styles.btn} ${styles.save}`}
                onClick={savePhoto}
              >
                {" "}
                저장
              </button>
            )}
          </div>
            {imgfile && (
              <button
                className={`${styles.btn} ${styles.save}`}
                onClick={savePhoto}
                >{" "}저장</button>)}</div>
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
