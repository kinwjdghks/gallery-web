//react
import React, { useState, useRef } from "react";
//css
import styles from "./PhotoModal.module.css";

/* 사진을 찍을 때 나타나는 모달
사용자는 (가로로 긴/ 세로로 긴 / 정방형 사진) 규격을 고를 수 있고,
사진 테두리 스킨을 고를 수 있다. (선택지 3개 정도, 무지 포함)
모달엔 2개 버튼 (촬영, 취소)이 존재하며, 촬영버튼은 3초 타이머 후 사진이 촬영됨.
촬영 후 미리보기가 주어지며 재촬영/ 등록 선택지가 주어진다. (재촬영 제한은 없음)
모달 밖을 클릭해서 나가지면 안되고 취소 버튼으로만 메인 나가지도록.*/

const PhotoModal = () => {
  const [playing, setPlaying] = useState(false);
  const [drawIntervalID, setDrawIntervalID] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();

  const getWebcam = (callback) => {
    try {
      const constraints = {
        video: true,
        audio: false,
      };
      navigator.mediaDevices.getUserMedia(constraints).then(callback);
    } catch (err) {
      console.log(err);
      return undefined;
    }
  };
  const CameraHandling = async () => {
    try {
      if (playing) {
        const s = videoRef.current.srcObject;
        s.getTracks().forEach((track) => {
          track.stop();
        });
        setPlaying(!playing);
        clearInterval(drawIntervalID);
      } else {
        getWebcam((stream) => {
          setPlaying(true);
          videoRef.current.srcObject = stream;
        });
        setPlaying(!playing);
        const drawID = setInterval(() => CanvasDrawing(), 100);
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
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      // Capture canvas image as base64 data URL
      const imageData = canvasRef.current.toDataURL("image/png");
      console.log(imageData);
    }
  };
  return (
    <div>
      {playing ? (
        <button onClick={CameraHandling}>끄기</button>
      ) : (
        <button onClick={CameraHandling}>인생네컷 찍기</button>
      )}

      {playing && (
        <div className={styles.container}>
          <video ref={videoRef} autoPlay className={styles.video} />
          <canvas ref={canvasRef} className={styles.canvas} />
          <button onClick={takePhoto}>찰칵</button>
        </div>
      )}
    </div>
  );
};

export default PhotoModal;
