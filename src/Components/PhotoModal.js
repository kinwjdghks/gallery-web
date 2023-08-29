import React, { useState, useRef, useEffect } from "react";
import styles from "./PhotoModal.module.css";
import { getWebcam,Style1,Style2,Style3 } from "../Utility/Camera";
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
  const [recording, setRecording] = useState(false);
  const [drawIntervalID, setDrawIntervalID] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();
  const canvas_container_ref = useRef();
  //촬영 시 적용될 비디오규격
  const [vidConfig,setVidConfig] = useState(Style1);
  //drawing context

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

  const CameraHandling = async () => {
    try {
      if (recording) {
        const s = videoRef.current.srcObject;
        s.getTracks().forEach((track) => {
          track.stop();
        });
        setRecording(!recording);
        clearInterval(drawIntervalID);
      } else {
        getWebcam((stream) => {
          setRecording(true);
          videoRef.current.srcObject = stream;
        });
        setRecording(!recording);
        const drawID = setInterval(() => CanvasDrawing(), 50);
        setDrawIntervalID(drawID);
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };
  const CanvasDrawing = () => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context && context !== null) {
        if (videoRef.current) {
          context.translate(canvasRef.current.width, 0);

          context.scale(-1, 1);
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          context.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const takePhoto = (time) => {
    
    if (videoRef.current && canvasRef.current) {
      // Capture canvas image as base64 data URL
      //5초 타이머 후 사진 촬영
      let count = 5;
      let imageData;
      const blankcanvas = document.createElement("canvas");
      blankcanvas.classList.add(`${styles.canvas_count}`);
      canvas_container_ref.current.appendChild(blankcanvas);
      blankcanvas.style.width=`${vidConfig.Video.width}`;
      blankcanvas.style.height=`${vidConfig.Video.height}`;
      //drawing context
      const context = blankcanvas.getContext("2d");
      context.font = "48px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";

      const timer = setInterval(() => {
        if (count <= 0) {
          clearInterval(timer);
          canvas_container_ref.current.removeChild(blankcanvas);
          // imageData = canvasRef.current.toDataURL("image/png");
          // console.log(imageData);
        }
        context.clearRect(0, 0, blankcanvas.width, blankcanvas.height);
        context.fillText(
          count.toString(),
          blankcanvas.width / 2,
          blankcanvas.height / 2
        );
        console.log(count);
        count--;
      }, 1000);
      //   이후 사진 처리코드
    }
  };
  return (
    <div>
      {recording && (
        <div className={styles.container}>
          <video ref={videoRef} autoPlay style={vidConfig.Video}/>

          <div className={styles.canvas_container} 
          ref={canvas_container_ref} 
          style={{width:vidConfig.Video.width, height:vidConfig.Video.height, position:'relative'}}>
            <canvas ref={canvasRef} style={vidConfig.Video} />
          </div>
          
          <button onClick={()=>takePhoto(5)}>찰칵</button>
        </div>
      )}
      <button onClick={CameraHandling}>{recording ? '끄기':'인생네컷 찍기'}</button>
    </div>
  );
};

export default PhotoModal;
