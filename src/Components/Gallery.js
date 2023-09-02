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
  startAfter
} from "firebase/firestore/lite";

const Gallery = ({ takePhoto, onClick }) => {
  const [photos, setPhotos] = useState([]);
  //이 Timestamp 이전의 사진들은 모두 로드됨.
  let timeStamp = useRef(null);
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
      if ((cnt + 1) * 1000 < backgroundHeight) {
        const newArr = [...arrows,<ScrollDown key={cnt+1} top_={cnt * 1000 + 700} />];
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
            const response = await getMorePhotos(updatePage);
            observer.observe(entry.target);
        }
    };
    const observer = new IntersectionObserver(onIntersect, { threshold: 0 });

  
  const updatePage = (dataSnapShot, dataList) =>{
      const length = dataList.length;
      if (length) {
        
        timeStamp = dataSnapShot.docs[length-1];
        setPhotos((prev) => [ ...prev,...dataList]);
      } else {
        setEndOfData(true);
      }
      setIsLoading(false);
    };

  const getMorePhotos = async (updatePage) => {
    //10개씩 사진 가져오기.
    console.log("사진 가져오기");
    
    let queryTemp;
    console.log('timeStamp: '+timeStamp);
    if(timeStamp){
        queryTemp = query(
          collection(db, "Photos"),
          orderBy("id","desc"),
          startAfter(timeStamp),
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

    updatePage(dataSnapShot,dataList);
  };
    



//   처음 실행 시 사진 가져오기
  useEffect(()=>{
      // console.log('처음 사진 가져오기');
      window.scroll({
        top: 0,
        behavior: "instant",
      });
      getMorePhotos(updatePage);
    }
  ,[]);
// 사진 찍고나면 갤러리 초기화하기
    useEffect(()=>{
      window.location.reload();
    },[]);

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
        {isLoading && <div className={styles.loadingDiv}> Loading...</div>}
        {arrows}
      </div>
      {!endOfData && <div className={styles.pageEnd} ref={pageEnd}></div>}
    </>
  );
};

export default Gallery;
