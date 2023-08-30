import React, { useState, useRef, useEffect } from "react";
import styles from "./PhotoModal.module.css";
import { getWebcam,Style1,Style2,Style3 } from "../Utility/Camera";
import Webcam from "react-webcam";
// import {saveToFirebaseStorage}
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
  
  //비디오 녹화를 위한 State/refs
  const [recording, setRecording] = useState(true);
  const [drawIntervalID, setDrawIntervalID] = useState(null);
  const webcamRef = useRef(null);
  
  //촬영 시 적용될 비디오규격
  
  const vidConfigList = [
    {width:1000, height:1000},{width:1200, height:900},{width:900, height:1200}
  ];
  const [vidConfig,setVidConfig] = useState(vidConfigList[0]);
  const switchVidConfig = (num) => setVidConfig(vidConfigList[num]);
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
  return (
    <div>
      {recording && (
        <div className={styles.container}>

          <div className={styles.cam_container} 
          style={{...vidConfig, position:'relative', backgroundColor:'green'}}>
          
          {/* <Webcam
            audio={false}
            width={100+'%'} 
            height={100+'%'} 
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={true}/> */}
          </div>
          
          <div className={styles.countdown}></div>

          <button onClick={()=>{}}>찰칵</button>
        </div>
      )}
      <button onClick={()=>setRecording((prev)=>!prev)}>{recording ? '끄기':'인생네컷 찍기'}</button>
      <button onClick={()=>switchVidConfig(0)}>정방형</button>
      <button onClick={()=>switchVidConfig(1)}>4:3</button>
      <button onClick={()=>switchVidConfig(2)}>3:4</button>
    </div>
  );
};

export default PhotoModal;
