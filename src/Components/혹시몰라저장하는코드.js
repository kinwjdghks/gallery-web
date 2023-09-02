
  //모두 가져오는 버전
  // const getPhotos =  async () =>{
  //     const dataSnapShot = await getDocs(collection(db,'Photos'));
  //     const dataList = dataSnapShot.docs.map(doc=> doc.data());
  //     setPhotos(dataList);
  // }
  // //모달 열리고 닫힐때만 사진 가져오기
  // useEffect(()=>{
  //     console.log('사진 가져오기');
  //     getPhotos();
  // }
  // ,[takePhoto]);

  // useEffect(() => {
  //   let observer;
  //   if (pageEnd.current && !endOfData) {
  //     const onIntersect = async ([entry], observer) => {
  //       if (entry.isIntersecting) {
  //         observer.unobserve(entry.target);
  //         getMorePhotos();
  //       //   debouncedGetMorePhotos();
  //         observer.observe(entry.target);
  //       }
  //     };
  //     observer = new IntersectionObserver(onIntersect, { threshold: 1 });
  //     observer.observe(pageEnd.current);
  //   }
  //   return () => observer && observer.disconnect();
  // }, [pageEnd]);
