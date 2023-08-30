import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./PhotoModal.module.css";
import Webcam from "react-webcam";
import {getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from "../Utility/firebase";

/* 사진을 찍을 때 나타나는 모달
사용자는 (가로로 긴/ 세로로 긴 / 정방형 사진) 규격을 고를 수 있고,
사진 테두리 스킨을 고를 수 있다. (선택지 3개 정도, 무지 포함)
모달엔 2개 버튼 (촬영, 취소)이 존재하며, 촬영버튼은 3초 타이머 후 사진이 촬영됨.
촬영 후 미리보기가 주어지며 재촬영/ 등록 선택지가 주어진다. (재촬영 제한은 없음)
모달 밖을 클릭해서 나가지면 안되고 취소 버튼으로만 메인 나가지도록.*/

const PhotoModal = () => {
  //이미지 저장을 위한 State
  const [imgurl,setImgurl] = useState("");
  const [imgfile,setImgfile] = useState(null);
  const [imgpreview,setImgpreview] = useState(null);
  
  //비디오 녹화를 위한 State/refs
  const [recording, setRecording] = useState(true);
  const webcamRef = useRef(null);
  
  //촬영 시 적용될 비디오규격
  
  const vidConfigList = [
    {width:800, height:800},{width:675, height:900},{width:900, height:675}
  ];
  const [vidConfigIdx,setVidConfigIdx] = useState(0);
  //비디오 규격 맞추기 위한 mask xml
  const [mask, setMask] = useState();
  useEffect(()=>{
    switch (vidConfigIdx) {
      case 0:
        setMask(<>
        <div className={`${styles.mask_square} ${styles.left}`}></div>
        <div className={`${styles.mask_square} ${styles.right}`}></div>
        </>)
        break;
      case 1:
        setMask(<>
          <div className={`${styles.mask_rectangle} ${styles.left}`}></div>
          <div className={`${styles.mask_rectangle} ${styles.right}`}></div>
          </>)
        break;
      case 2:
        setMask(null);
        break;
    }
  },[vidConfigIdx]);
  //throttling 위한 timer
  const [throttle, setThrottle] = useState(null);
  


  // const imageFileHandler = (e) => {
  //   e.preventDefault();
  //   const file = e.target.files[0];
  //   //file type = MIME
  //   const reader = new FileReader();
    
  //   reader.onloadend = () =>{
  //       setImgurl(file);
  //       setImagePreview(reader.result);
  //       saveToFirebaseStorage(file);
  //   }
  //   setImgfile(file);
  // }

  // const videoConstraints ={facingMode:'user'};
  const saveToFirebaseStorage = file => {
    const uniqueKey = new Date().getTime();
    const newName = file.name
      .replace(/[~`!#$%^&*+=\-[\]\\';,/{}()|\\":<>?]/g, "")
      .split(" ")
      .join("");

    const metaData = {
      contentType: file.type
    };

    const storageRef = sRef(storage, "Images/" + newName + uniqueKey);
    const UploadTask = uploadBytesResumable(storageRef, file, metaData);
    UploadTask.on(
      "state_changed",
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      error => {
        alert(`error: image upload error ${JSON.stringify(error)}`);
      },
      () => {
        getDownloadURL(UploadTask.snapshot.ref).then(downloadUrl => {
          console.log(`완료 url: ${downloadUrl}`);
        });
      }
    );
  };


  const storage = getStorage();
  const takePhoto = useCallback((e)=>{
    e.preventDefault();
    const imageSrc = webcamRef.current.getScreenshot();
    const reader = new FileReader();

    reader.onloadend = () =>{
      setImgfile(imageSrc);
      setImgurl(reader.result);
      saveToFirebaseStorage(imageSrc);
    };
    if(imageSrc) reader.readAsDataURL(imageSrc);
  },[webcamRef]);

  return (
    <div>
      {recording && (
        <div className={styles.container}>

          <div className={styles.cam_container}>
          <Webcam
            className={`${styles.webcam} ${vidConfigIdx===0 ? styles.square : vidConfigIdx===1 ? styles.rectangle : styles.horizontal}`}
            audio={false} 
            height={vidConfigList[vidConfigIdx].height}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={true}/>
          {mask}
          <div className={styles.countdown}></div>
          </div>
          

          <button onClick={takePhoto}>찰칵</button>
        </div>
      )}
      <button onClick={()=>setRecording((prev)=>!prev)}>{recording ? '끄기':'인생네컷 찍기'}</button>
      <button onClick={()=>setVidConfigIdx(0)}>정방형</button>
      <button onClick={()=>setVidConfigIdx(1)}>3:4</button>
      <button onClick={()=>setVidConfigIdx(2)}>4:3</button>
    </div>
  );
};

export default PhotoModal;
