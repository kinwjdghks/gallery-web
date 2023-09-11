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
  const mobile = version==='mobile';
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
      style={{ 
        position: "absolute", 
        top: mobile ? 200 : 700, 
        left: mobile ? 5 :110, 
        width: mobile ? "7vw" : '57px' }}
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
      
      if (mobile && ((cnt + 1) * 450 < backgroundHeight) || !mobile && ((cnt + 1) * 1000 < backgroundHeight)) {
        const newArr = [
          ...arrows,
          <img
            src={darkmode ? scrollDown_white : scrollDown}
            key={cnt + 1}
            style={{ position: "absolute",
             top: mobile? (cnt * 450 + 200):(cnt * 1000 + 700),
             left: mobile ? 5 :110,
             width: mobile ? "7vw" : '57px'  }}
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

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "instant",
    });
    getMorePhotos();
    console.log("initial data request");
  }, []);

  return (
    <>
      <div
        className={styles.background}
        style={{ backgroundColor: darkmode ? "#484848" : "#e0e0e0" }}
        ref={background}
      >
        {!photos.length && !isLoading && <div className={styles.noPic}>사진이 없습니다!</div>}

        {photos.length > 0 && (
          <div className={styles.albumContainer}>
            {photos.map((data, index) => {
              if (data.type === "blank") {
                return <BlankAlbum key={index} />;
              } else if (data.type === "photo") {
                return <Album key={index} data={data} />;
              } else {
              }
            })}
          </div>
        )}
        {isLoading && <div className={styles.loadingDiv}>Loading...</div>}
        {arrows}
      </div>
      {!endOfData && <div className={styles.pageEnd} ref={pageEnd} />}
      {endOfData && (
        <div className={styles.footer}
          style={{backgroundColor: darkmode ? "rgb(72, 72, 72)":"#e0e0e0"}}>
          <a
            href="https://github.com/skku-comit/gallery-web"
            className={styles.githubLink}
          >
            <img
              src={darkmode ? githubIconWhite : githubIconBlack}
              alt="github-icon"
              rel="external"
              style={{width: mobile ? "40px" : "75px"}}
            />
          </a>
          <div className={styles.footertext} style={{color:darkmode ? "rgb(255, 255, 255, 0.8)":'#767676',
        fontSize: mobile ? "0.9rem": "1.4rem",
        transition: "all 0.5s"}}>
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
