import styles from "./Gallery.module.css";
import PhotoModal from "./PhotoModal";
import BlankAlbum from "./BlankAlbum";
import Album from "./Album";
import ScrollDown from "../common/ScrollDown";
import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "../Utility/firebase";
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  startAfter,
} from "firebase/firestore/lite";

const Gallery = ({ takePhoto, onClick }) => {
  let tempTimeStamp = useRef(null);
  //?? Timestamp ?????? ???????? ???? ?ε???.
  // const [curTimeStamp, setCurTimeStamp] = useState(null);
  //?? ??? ????? ??????? ??????
  const [endOfData, setEndOfData] = useState(false);
  //?????? ?ε???
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  // <ScrollDown/> 개수
  const [arrows, setArrows] = useState([<ScrollDown key={0} top_={900} />]);

  const background = useRef(null);
  //새로 데이터가 로딩될때마다 background 높이 업데이트하기
  useEffect(() => {
    if (background.current) {
      setBackgroundHeight(background.current.getBoundingClientRect().height);
    }
  }, [isLoading]);
  //일정 높이에 도달할 때마다 <ScrollDown /> 추가하기
  useEffect(() => {
    if (background.current) {
      const cnt = arrows.length;
      if (280 + (cnt + 1) * 800 < backgroundHeight) {
        const newArr = [
          ...arrows,
          <ScrollDown key={cnt + 1} top_={cnt * 800 + 700} />,
        ];
        setArrows(newArr);
      }
    }
  }, [backgroundHeight]);

  //가장 아래에 닿으면 데이터를 10개씩 더 가져온다.
  const pageEnd = useRef(null);

  const onIntersect = async ([entry], observer) => {
    console.log("intersect");
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      const response = await getMorePhotos();
      observer.observe(entry.target);
    }
  };
  const observer = new IntersectionObserver(onIntersect, { threshold: 0.5 });

  const [photos, setPhotos] = useState([]);

  const getMorePhotos = async () => {
    //10???? ???? ????????.
    console.log("getmorePhotos");
    console.log("curTimeStamp");
    // console.log(curTimeStamp);
    let queryTemp;
    if (tempTimeStamp) {
      console.log("If");
      queryTemp = query(
        collection(db, "Photos"),
        orderBy("id", "desc"),
        startAfter(tempTimeStamp),
        limit(10)
      );
    } else {
      console.log("Else");
      //first query
      queryTemp = query(
        collection(db, "Photos"),
        orderBy("id", "desc"),
        limit(10)
      );
    }

    setIsLoading(true);
    const dataSnapShot = await getDocs(queryTemp);
    const dataList = dataSnapShot.docs.map((doc) => doc.data());
    const length = dataList.length;
    if (length) {
      console.log("Here");
      console.log(dataSnapShot.docs[length - 1].data().timestamp);
      // setCurTimeStamp(dataSnapShot.docs[length - 1]); //?????? ?????? ???????? TimeStamp?? ????
      tempTimeStamp = dataSnapShot.docs[length - 1];

      setPhotos((prev) => [...prev, ...dataList]);
    } else {
      setEndOfData(true);
    }
    setIsLoading(false);
  };
  //   o?? ???? ?? ???? ????????
  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
    getMorePhotos();
  }, []);

  return (
    <>
      {takePhoto && <PhotoModal photoList={photos} onClick={onClick} />}
      <div className={styles.background} ref={background}>
        <div className={styles.albumContainer}>
          {photos.map((data, index) => {
            if (data.url === "blank") {
              return <BlankAlbum key={index} />;
            } else {
              return <Album key={index} data={data} />;
            }
          })}
        </div>
        {isLoading && <div className={styles.loadingDiv}>Loading...</div>}
        {arrows}
      </div>
      {!endOfData && <div className={styles.pageEnd} ref={pageEnd}></div>}
    </>
  );
};

export default Gallery;
