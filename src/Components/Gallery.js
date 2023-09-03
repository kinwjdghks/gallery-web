import styles from "./Gallery.module.css";
import PhotoModal from "./PhotoModal";
import BlankAlbum from "./BlankAlbum";
import Album from "./Album";
import ScrollDown from "../common/ScrollDown";
import { useState, useEffect, useRef } from "react";

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
  const [photos, setPhotos] = useState([]);
  //이 Timestamp 이전의 사진들은 모두 로드됨.
  let timeStamp = useRef(null);
  //더 이상 불러올 데이터가 없는지
  const [endOfData, setEndOfData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  // <ScrollDown/> 배열
  const [arrows, setArrows] = useState([<ScrollDown key={0} top_={900} />]);

  const background = useRef(null);
  //데이터를 가져올때마다 backgroundHeight를 업데이트한다.
  useEffect(() => {
    if (background.current) {
      setBackgroundHeight(background.current.getBoundingClientRect().height);
    }
  }, [isLoading]);
  //높이가 일정 수준 증가할 때마다 <ScrollDown />를 추가한다.
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

  //페이지의 마지막에 닿으면 데이터를 더 로딩하는 무한스크롤 코드.
  const pageEnd = useRef(null);

  useEffect(() => {
    if (pageEnd.current) observer.observe(pageEnd.current);
  }, []);

  const onIntersect = async ([entry], observer) => {
    if (entry.isIntersecting) {
      console.log("intersect");
      observer.unobserve(entry.target);
      const response = await getMorePhotos();
      //다음 데이터 로딩까지 시간 간격을 약간 둔다.
      setTimeout(() => {
        observer.observe(entry.target);
      }, 800);
    }
  };
  const observer = new IntersectionObserver(onIntersect, { threshold: 0 });

  //10개씩 사진 가져오기.
  const getMorePhotos = async () => {
    console.log("사진 가져오기");

    let queryTemp;
    console.log("timeStamp: " + timeStamp);
    if (!timeStamp) {
      //first query
      queryTemp = query(
        collection(db, "Photos"),
        orderBy("id", "desc"),
        limit(10)
      );
    } else {
      //first query
      queryTemp = query(
        collection(db, "Photos"),
        orderBy("id", "desc"),
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
      //데이터가 더 없으면 표시한다.
      setEndOfData(true);
    }
    setIsLoading(false);
  };

  //   처음 실행 시 사진 가져오기
  useEffect(() => {
    console.log("처음 사진 가져오기");
    //스크롤 맨 위에서 시작안하는 현상 수정
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
    getMorePhotos();
  }, []);

  return (
    <>
      {takePhoto && <PhotoModal onClick={onClick} />}
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
