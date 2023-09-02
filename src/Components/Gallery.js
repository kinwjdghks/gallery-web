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
  where,
  limit,
  orderBy,
  startAfter,
} from "firebase/firestore/lite";

const Gallery = ({ takePhoto, onClick }) => {
  let tempTimeStamp = useRef(null);
  //�� Timestamp ������ �������� ��� �ε��.
  // const [curTimeStamp, setCurTimeStamp] = useState(null);
  //�� �̻� �ҷ��� �����Ͱ� ������
  const [endOfData, setEndOfData] = useState(false);
  //������ �ε���
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  // <ScrollDown/> ����
  const [arrows, setArrows] = useState([<ScrollDown key={0} top_={900} />]);

  const background = useRef(null);
  // useEffect(()=>console.log(backgroundHeight),[backgroundHeight]);
  //���� �����Ͱ� �ε��ɶ����� background ���� ������Ʈ�ϱ�
  useEffect(() => {
    if (background.current) {
      setBackgroundHeight(background.current.getBoundingClientRect().height);
    }
  }, [isLoading]);
  //���� ���̿� ������ ������ <ScrollDown /> �߰��ϱ�
  useEffect(() => {
    if (background.current) {
      const cnt = arrows.length;
      if (280 + (cnt + 1) * 700 < backgroundHeight) {
        const newArr = [
          ...arrows,
          <ScrollDown key={cnt + 1} top_={cnt * 700 + 700} />,
        ];
        setArrows(newArr);
      }
    }
  }, [backgroundHeight]);

  const pageEnd = useRef(null);
  //���� �Ʒ��� ������ �����͸� 10���� �� �����´�.

  useEffect(() => {
    if (pageEnd.current) {
      console.log("executed");
      observer.observe(pageEnd.current);
    }
  }, []);

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
    //10���� ���� ��������.
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
    // console.log('unsorted: '+unsortedDataList);
    // console.log(length);
    console.log("dataList:");
    console.log(dataList);
    console.log(dataSnapShot.docs[length - 1].data());
    if (length) {
      console.log("Here");
      console.log(dataSnapShot.docs[length - 1].data().timestamp);
      // setCurTimeStamp(dataSnapShot.docs[length - 1]); //������ ������ �������� TimeStamp�� ����
      tempTimeStamp = dataSnapShot.docs[length - 1];

      setPhotos((prev) => [...prev, ...dataList]);
    } else {
      setEndOfData(true);
    }
    setIsLoading(false);
  };

  //   ó�� ���� �� ���� ��������
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
