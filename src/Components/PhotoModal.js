import React, { useState, useRef, useEffect } from "react";
import styles from "./PhotoModal.module.css";
import { getWebcam, Style1, Style2, Style3 } from "../Utility/Camera";
import { db } from "../Firebase/firebase";

/* ������ ���� �� ��Ÿ���� ���
����ڴ� (���η� ��/ ���η� �� / ������ ����) �԰��� �� �� �ְ�,
���� �׵θ� ��Ų�� �� �� �ִ�. (������ 3�� ����, ���� ����)
��޿� 2�� ��ư (�Կ�, ���)�� �����ϸ�, �Կ���ư�� 3�� Ÿ�̸� �� ������ �Կ���.
�Կ� �� �̸����Ⱑ �־����� ���Կ�/ ��� �������� �־�����. (���Կ� ������ ����)
��� ���� Ŭ���ؼ� �������� �ȵǰ� ��� ��ư���θ� ���� ����������.*/

const PhotoModal = () => {
  //�̹��� ������ ���� State
  const [imgurl, setImgurl] = useState("");
  const [imgfile, setImgfile] = useState(null);
  
  //���� ��ȭ�� ���� State/refs
  const [recording, setRecording] = useState(false);
  const [drawIntervalID, setDrawIntervalID] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();
  const canvas_container_ref = useRef();
  //�Կ� �� ����� �����԰�
  const [vidConfig, setVidConfig] = useState(Style1);

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
      //5�� Ÿ�̸� �� �����Կ�
      let count = 5;
      let imageData;
      const blankcanvas = document.createElement("canvas");
      blankcanvas.classList.add(`${styles.canvas_count}`);
      canvas_container_ref.current.appendChild(blankcanvas);
      blankcanvas.style.width = `${vidConfig.Video.width}`;
      blankcanvas.style.height = `${vidConfig.Video.height}`;

      const context = blankcanvas.getContext("2d");
      context.font = "48px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";

      const timer = setInterval(() => {
        if (count <= 0) {
          clearInterval(timer);
          imageData = canvasRef.current.toDataURL("image/png");
          console.log(imageData);
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
      //   ���� ���� ó��
      //   console.log(imageData);
    }
  };
  return (
    <div>
      {recording && (
        <div className={styles.container}>
          <video ref={videoRef} autoPlay style={vidConfig.Video} />

          <div
            className={styles.canvas_container}
            ref={canvas_container_ref}
            style={{
              width: vidConfig.Video.width,
              height: vidConfig.Video.height,
              position: "relative",
            }}
          >
            <canvas ref={canvasRef} style={vidConfig.Video} />
          </div>

          <button onClick={takePhoto}>��Ĭ</button>
        </div>
      )}
      <button onClick={CameraHandling}>
        {recording ? "����" : "�λ����� ���"}
      </button>
    </div>
  );
};

export default PhotoModal;
//
