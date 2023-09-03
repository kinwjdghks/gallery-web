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
  //�� Timestamp ������ �������� ��� �ε��.
  let timeStamp = useRef(null);
  //�� �̻� �ҷ��� �����Ͱ� ������
  const [endOfData, setEndOfData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  // <ScrollDown/> �迭
  const [arrows, setArrows] = useState([<ScrollDown key={0} top_={900} />]);

  const background = useRef(null);
  //�����͸� �����ö����� backgroundHeight�� ������Ʈ�Ѵ�.
  useEffect(() => {
    if (background.current) {
      setBackgroundHeight(background.current.getBoundingClientRect().height);
    }
  }, [isLoading]);
  //���̰� ���� ���� ������ ������ <ScrollDown />�� �߰��Ѵ�.
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

  //�������� �������� ������ �����͸� �� �ε��ϴ� ���ѽ�ũ�� �ڵ�.
  const pageEnd = useRef(null);

  useEffect(() => {
    if (pageEnd.current) observer.observe(pageEnd.current);
  }, []);

  const onIntersect = async ([entry], observer) => {
    if (entry.isIntersecting) {
      console.log("intersect");
      observer.unobserve(entry.target);
      const response = await getMorePhotos();
      //���� ������ �ε����� �ð� ������ �ణ �д�.
      setTimeout(() => {
        observer.observe(entry.target);
      }, 800);
    }
  };
  const observer = new IntersectionObserver(onIntersect, { threshold: 0 });

  //10���� ���� ��������.
  const getMorePhotos = async () => {
    console.log("���� ��������");

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
      //�����Ͱ� �� ������ ǥ���Ѵ�.
      setEndOfData(true);
    }
    setIsLoading(false);
  };

  //   ó�� ���� �� ���� ��������
  useEffect(() => {
    console.log("ó�� ���� ��������");
    //��ũ�� �� ������ ���۾��ϴ� ���� ����
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
