import { useState } from "react";
import styles from "./Album.module.css";
import design1_square from "../assets/skins/design1_square.svg";
import design1_horizontal from "../assets/skins/design1_horizontal.svg";
import design1_vertical from "../assets/skins/design1_vertical.svg";
import design2_square from "../assets/skins/design2_square.svg";
import design2_horizontal from "../assets/skins/design2_horizontal.svg";
import design2_vertical from "../assets/skins/design2_vertical.svg";

/*하나의 사진마다 일대일대응되는 컴포넌트. 인자로 규격을 받아 각각 css가 필요함.
하나가 무지니까 (3*2)개 디자인 필요할 것으로 예상.
한 그리드를 사진이 꽉 채우는 것이 아니고 패딩처럼 사진과 그리드 사이에 여백이 존재하는데, 그 사이에
(너무 화려하지 않은) 디자인이 살짝씩 들어가는 느낌.*/

const Album = ({data}) => {
  // const [skinElement,setSkinElement] = useState(null);
  let skinElement;
  const imageurl = data.url;
  const vidConfig = data.vidConfig;
  const skinNum = data.skinNum;
  console.log(vidConfig + " " + skinNum);
  const classNameBySkin = 
  skinNum === 0
      ? styles.opt0
      : skinNum === 1
      ? styles.opt1
      : skinNum === 2
      ? styles.opt2
      : styles.opt3;
  const classNameByConfig =
    vidConfig === 0
      ? styles.square
      : vidConfig === 1
      ? styles.vertical
      : styles.horizontal;
  
  if(skinNum === 0){
    const image = vidConfig === 0 ? design1_square
    : vidConfig === 1 ? design1_vertical
    : design1_horizontal;

    skinElement = <img className={styles.skinElement} src={image} width='350'/>
  }
  else if(skinNum === 1){
    const image = vidConfig === 0 ? design2_square
    : vidConfig === 1 ? design2_vertical
    : design2_horizontal;


    skinElement = <>
    {vidConfig===1 && 
    <div className={styles.skkucomit}>
      <p className={styles.skku}>SKKU</p>
      <p className={styles.comit}>COMIT</p></div>}
    <img className={styles.skinElement} src={image} width='350'/>
    </>
  }
  else if(skinNum === 2){
    // const image = vidConfig === 0 ? design1_square
    // : vidConfig === 1 ? design1_vertical
    // : design1_horizontal;

    // skinElement = <img className={styles.skinElement} src={image} width='350'/>
  }
  // else{
  //   if(vidConfig === 0){
  //     setSkinElement();
  //   }
  //   else if(vidConfig === 1){
  //     setSkinElement();
  //   }
  //   else{
  //     setSkinElement();
  //   }
  // }

  return (
    <div className={`${styles.container} ${classNameBySkin}`}>
      <div className={`${styles.mask} ${classNameByConfig}`}>
        <img src={imageurl} alt="img" />
      </div>
        {skinElement}
    </div>
  );
};

export default Album;
