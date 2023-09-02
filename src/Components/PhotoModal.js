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
//sound
import EffectSound from "../common/EffectSound";
import effect from "../assets/sounds/camera-shutter.wav";

const BackDrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Modal = ({ photoList, onClick }) => {
  const [blankBuffer, setBlankBuffer] = useState(Math.floor(Math.random()*4)); //랜덤 정수마다 BlankAlbum 생성하기
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
  //랜덤정수 모두 차감 시 빈 image객체 보내기
  const createBlankAlbum = async () =>{
    const id = new Date().getTime();
    const timestamp = serverTimestamp();
    const newPhoto = {
      url: 'blank',
      timestamp: timestamp,
    };
    try {
      const photos = collection(db, "Photos");
      const response = await setDoc(doc(photos, `${id}`), newPhoto);
    } catch (error) {
      console.log(error);
      return;
    }
  }
  useEffect(()=>{
    if(blankBuffer===0){
      createBlankAlbum();
      setBlankBuffer(Math.floor(Math.random()*4));
    console.log("saved");
    }
  },[blankBuffer]);

  //사진 촬영 후 preview 이미지 띄우기
  useEffect(() => { 
    if (imgfile) {
      setImgpreview(<img
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
              style={{ height: curHeight, width: curWidth }}>
              {cnt}
            </div>
          );
          cnt--;
        } else {
          console.log("flash executed");
          setPhotoAnimation(
            <div
              className={`${styles.animation} ${styles.shooting}`}
              style={{ height: curHeight, width: curWidth }}></div>
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
      const upload = await uploadString(storageRef, file, "data_url");
      // console.log(upload)
      const geturl = await getDownloadURL(sRef(storage, storageRef));
      // console.log(geturl);
      setImgurl(geturl.toString());
    } catch (error) {
      console.log(error);
    }
    // console.log(imgurl);
    setIsLoading(false);
  };

  const saveToFireStore = async () => {
    
    let id = new Date().getTime();
    id = (+id)%100; //int 
    const timestamp = serverTimestamp();
    const newPhoto = {
      id:id,
      url: imgurl,
      timestamp: timestamp,
    };
    try {
      const photos = collection(db, "Photos");
      const response = await setDoc(doc(photos, `${id}`), newPhoto);
    } catch (error) {
      console.log(error);
      return;
    }

    console.log("saved");
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
    saveToFirebaseStorage(imgfile); //image -> Storage, need throttling
    saveToFireStore();
    setBlankBuffer((prev)=>prev--);
  };

  const deletePhoto = ()=>{
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
        <div className={styles.cam_container__Frame}>
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
