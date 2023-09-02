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
} from "firebase/firestore/lite";

const Gallery = ({ takePhoto, onClick }) => {
  //�� Timestamp ������ �������� ��� �ε��.
  const [curTimeStamp, setCurTimeStamp] = useState(new Date().getTime());
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
        const newArr = [...arrows,<ScrollDown key={cnt+1} top_={cnt * 700 + 700} />];
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
  const observer = new IntersectionObserver(onIntersect, { threshold: 0 });

  const [photos, setPhotos] = useState([
    {
      imageurl: "a",
      vidConfig: 0,
    },
    {
      imageurl: "a",
      vidConfig: 1,
    },
    {
      imageurl: "blank",
      vidConfig: 0,
    },
    {
      imageurl: "a",
      vidConfig: 0,
    },
    {
      imageurl: "blank",
      vidConfig: 1,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "blank",
      vidConfig: 2,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "blank",
      vidConfig: 0,
    },
    {
      imageurl: "a",
      vidConfig: 1,
    },
    {
      imageurl: "blank",
      vidConfig: 0,
    },
    {
      imageurl: "blank",
      vidConfig: 1,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "blank",
      vidConfig: 2,
    },
    {
      imageurl: "a",
      vidConfig: 0,
    },
  ]);

  //   const [photos,setPhotos] = useState([{
  //     imageurl:"a",
  //     vidConfig:0
  // },
  // {
  //   imageurl: "a",
  //   vidConfig: 1,
  // },
  // {
  //     imageurl: 'blank',
  //     vidConfig: 0,
  //   },
  //   {
  //     imageurl: "a",
  //     vidConfig: 0,
  //   },

  //   {
  //     imageurl: "a",
  //     vidConfig: 1,
  //   },

  //   {
  //     imageurl: 'a',
  //     vidConfig: 0,
  //   },
  // ]);

  const getMorePhotos = useCallback(async () => {
    //10���� ���� ��������.
    console.log("getmorePhotos");
    const queryTemp = query(
      collection(db, "Photos"),
      where("id", "<", curTimeStamp),
      limit(10)
    );
    setIsLoading(true);
    const dataSnapShot = await getDocs(queryTemp);
    console.log("���� �ҷ�����");
    const unsortedDataList = dataSnapShot.docs.map((doc) => doc.data());
    const length = unsortedDataList.length;
    const dataList = unsortedDataList.sort((a,b)=>{return b.id-a.id}); //���ð��� ����
    console.log(length);
    if (length) {
      setCurTimeStamp(dataList[length - 1].id); //������ ������ �������� TimeStamp�� ����
      setPhotos((prev) => [ ...dataList,...prev]);
    } else {
      setEndOfData(true);
    }
    setIsLoading(false);
    setPhotos(dataList);
  },[curTimeStamp,photos]);



//   ó�� ���� �� ���� ��������
  useEffect(()=>{
      console.log('ó�� ���� ��������');
      getMorePhotos();
      console.log(endOfData);
      }
  ,[]);

  return (
    <>
      {takePhoto && <PhotoModal photoList={photos} onClick={onClick} />}
      <div className={styles.background} ref={background}>
        <div className={styles.albumContainer}>
          {photos.map((data, index) => {
            if (data.imageurl === "blank") {
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
