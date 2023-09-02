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
  startAfter
} from "firebase/firestore/lite";

const Gallery = ({ takePhoto, onClick }) => {
    const [photos, setPhotos] = useState([]);
  //이 Timestamp 이전의 사진들은 모두 로드됨.
  const [curTimeStamp, setCurTimeStamp] = useState(null);
  //더 이상 불러올 데이터가 없는지
  const [endOfData, setEndOfData] = useState(false);
  //데이터 로딩중
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
        const newArr = [...arrows,<ScrollDown key={cnt+1} top_={cnt * 800 + 700} />];
        setArrows(newArr);
      }
    }
  }, [backgroundHeight]);

  //가장 아래에 닿으면 데이터를 10개씩 더 가져온다.
  const pageEnd = useRef(null);

    useEffect(()=>{
        if(pageEnd.current) observer.observe(pageEnd.current);
        },[]);
    
    const onIntersect = async ([entry], observer) => {
        if (entry.isIntersecting) {
            console.log('intersect');
            observer.unobserve(entry.target);
            const response = await getMorePhotos();
            observer.observe(entry.target);
        }
    };
    const observer = new IntersectionObserver(onIntersect, { threshold: 0 });

  


  const getMorePhotos = async () => {
    //10개씩 사진 가져오기.
    console.log("사진 가져오기");
    let queryTemp;
    if(curTimeStamp){
        queryTemp = query(
          collection(db, "Photos"),
          orderBy("id","desc"),
          startAfter(curTimeStamp),
          limit(10));
    }
    else{ //first query
        queryTemp = query(
            collection(db, "Photos"),
            orderBy("id","desc"),
            limit(10));
    }
    
    setIsLoading(true);
    const dataSnapShot = await getDocs(queryTemp);
    const dataList = dataSnapShot.docs.map((doc) => doc.data());
    const length = dataList.length;
    // console.log(dataList);
    console.log(dataSnapShot.docs[length-1].data());
    if (length) {
      const lastTimeStamp  = dataSnapShot.docs[length-1];
      console.log('last: '+lastTimeStamp);
      setCurTimeStamp(lastTimeStamp); //가져온 마지막 데이터의 TimeStamp를 저장
      setPhotos((prev) => [ ...prev,...dataList]);
    } else {
      setEndOfData(true);
    }
    setIsLoading(false);
  };



//   처음 실행 시 사진 가져오기
  useEffect(()=>{
      console.log('처음 사진 가져오기');
      getMorePhotos();
      window.scrollTo(0,0);
    }
  ,[]);
    // useEffect(()=>{
    // console.log('curTimeStamp: '+curTimeStamp);
    // },[curTimeStamp]);



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
        {isLoading && <div className={styles.loadingDiv}> Loading...</div>}
        {arrows}
      </div>
      {!endOfData && <div className={styles.pageEnd} ref={pageEnd}></div>}
    </>
  );
};

export default Gallery;
