import styles from "./Gallery.module.css";
import PhotoModal from "./PhotoModal";
import BlankAlbum from "./BlankAlbum";
import Album from "./Album";
import ScrollDown from "../common/ScrollDown";
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
import githubIcon from "../assets/Images/github-icon.png";



const Gallery = ({ takePhoto, onToggleModalHandler, version }) => {
  const darkmode = useContext(DisplayContext).darkmode;
  const [photos, setPhotos] = useState([]);

  let timeStamp = useRef(null);

  const [endOfData, setEndOfData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundHeight, setBackgroundHeight] = useState(0);

  const [arrows, setArrows] = useState([<ScrollDown key={0} top_={900} />]);

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
          <ScrollDown key={cnt + 1} top_={cnt * 1000 + 700} />,
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
      {takePhoto && (
        <PhotoModal
          onToggleModalHandler={onToggleModalHandler}
          modalOpened={takePhoto}
        />
      )}
      <div
        className={`${styles.background} ${darkmode && styles.darkmode}`}
        ref={background}
      >
        {!photos.length && <div className={styles.noPic}>사진찍기 ㄱㄱ</div>}
        {photos.length && (
          <div className={styles.albumContainer}>
            {photos.map((data, index) => {
              if (data.url === "blank") {
                return <BlankAlbum key={index} />;
              } else {
                return <Album key={index} data={data} />;
              }
            })}
          </div>
        )}
        {isLoading && <div className={styles.loadingDiv}>Loading...</div>}
        {arrows}
      </div>
      {!endOfData && <div className={styles.pageEnd} ref={pageEnd} />}
      {endOfData && (
        <div className={`${styles.footer} ${darkmode && styles.darkmode}`}>
          <a
            href="https://github.com/skku-comit/gallery-web"
            className={styles.githubLink}
          >
            <img src={githubIcon} alt="github-icon" rel="external" width="75" />
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
