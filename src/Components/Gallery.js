import styles from "./Gallery.module.css";
import BlankAlbum from "./BlankAlbum";
import Album from "./Album";
import scrollDown from "../assets/Images/scrollDown.svg";
import scrollDown_white from "../assets/Images/scrollDown_white.svg";
import { useState, useEffect, useRef, useContext } from "react";
import DisplayContext from "../Context/context/Display";

import { db } from "../Utility/firebase";
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  startAfter,
} from "firebase/firestore/lite";
//images
import githubIconBlack from "../assets/Images/github-icon-black.png";
import githubIconWhite from "../assets/Images/github-icon-white.png";

const Gallery = ({ version }) => {
  const darkmode = useContext(DisplayContext).darkmode;
  const [photos, setPhotos] = useState([]);

  let timeStamp = useRef(null);

  const [endOfData, setEndOfData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // scrolldown 배치 코드
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  const [arrows, setArrows] = useState([
    <img
      src={darkmode ? scrollDown_white : scrollDown}
      key={0}
      style={{ position: "absolute", top: 700, left: 110 }}
    />,
  ]);
  const background = useRef(null);
  useEffect(() => {
    if (background.current) {
      setBackgroundHeight(background.current.getBoundingClientRect().height);
    }
  }, [isLoading]);

  useEffect(() => {
    if (background.current) {
      const cnt = arrows.length;
      if ((cnt + 1) * 1000 < backgroundHeight) {
        const newArr = [
          ...arrows,
          <img
            src={darkmode ? scrollDown_white : scrollDown}
            key={cnt + 1}
            style={{ position: "absolute", top: cnt * 1000 + 700, left: 110 }}
          />,
        ];
        setArrows(newArr);
      }
    }
  }, [backgroundHeight]);

  const pageEnd = useRef(null);

  useEffect(() => {
    if (pageEnd.current) observer.observe(pageEnd.current);
  }, []);

  const onIntersect = async ([entry], observer) => {
    if (entry.isIntersecting) {
      console.log("intersect");
      observer.unobserve(entry.target);
      await getMorePhotos();
      setTimeout(() => {
        observer.observe(entry.target);
      }, 800);
    }
  };
  const observer = new IntersectionObserver(onIntersect, { threshold: 0 });

  const getMorePhotos = async () => {
    console.log("photo request");

    let queryTemp;
    if (!timeStamp) {
      //first query
      queryTemp = query(
        collection(db, "Photos"),
        orderBy("timestamp", "desc"),
        limit(10)
      );
    } else {
      //first query
      queryTemp = query(
        collection(db, "Photos"),
        orderBy("timestamp", "desc"),
        startAfter(timeStamp),
        limit(10)
      );
    }

    setIsLoading(true);
    let dataSnapShot;
    try {
      dataSnapShot = await getDocs(queryTemp);
    } catch (error) {
      console.log(error);
    }

    const dataList = dataSnapShot.docs.map((doc) => doc.data());

    const length = dataList.length;
    if (length) {
      timeStamp = dataSnapShot.docs[length - 1];
      setPhotos((prev) => [...prev, ...dataList]);
    } else {
      setEndOfData(true);
    }
    setIsLoading(false);
  };

  // useEffect(() => {
  //   window.scroll({
  //     top: 0,
  //     behavior: "instant",
  //   });
  //   getMorePhotos();
  //   console.log("initial data request");
  // }, []);

  return (
    <>
      <div
        className={styles.background}
        style={{ backgroundColor: darkmode ? "#484848" : "#e0e0e0" }}
        ref={background}
      >
        {!photos.length && <div className={styles.noPic}>사진찍기 ㄱㄱ</div>}
        {photos.length > 0 && (
          <div className={styles.albumContainer}>
            {photos.map((data, index) => {
              if (data.type === "blank") {
                // if (data.url === "blank") {
                return <BlankAlbum key={index} />;
              } else if (data.type === "photo") {
                return <Album key={index} data={data} />;
              } else {
              }
            })}
          </div>
        )}
        {isLoading && <div className={styles.loadingDiv}>Loading...</div>}
        {version !== "mobile" && arrows}
      </div>
      {!endOfData && <div className={styles.pageEnd} ref={pageEnd} />}
      {version !== "mobile" && endOfData && (
        <div className={`${styles.footer} ${darkmode && styles.darkmode}`}>
          <a
            href="https://github.com/skku-comit/gallery-web"
            className={styles.githubLink}
          >
            {darkmode ? (
              <img
                src={githubIconWhite}
                alt="github-icon"
                rel="external"
                width="75"
              />
            ) : (
              <img
                src={githubIconBlack}
                alt="github-icon"
                rel="external"
                width="75"
              />
            )}
          </a>
          <div className={styles.text}>
            <p>Made by Jung Jung Hwan & Kim Ji Ho & Hong Min Jae</p>
            <p>https://comit.skku.io/</p>
            <p>2023. Copyright © COMIT All rights reserved</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
