import { useState } from "react";
import styles from "./Album.module.css";
//images
import design1_square from "../assets/skins/design1_square.svg";
import design1_horizontal from "../assets/skins/design1_horizontal.svg";
import design1_vertical from "../assets/skins/design1_vertical.svg";
import design2_square from "../assets/skins/design2_square.svg";
import design2_horizontal from "../assets/skins/design2_horizontal.svg";
import design2_vertical from "../assets/skins/design2_vertical.svg";
// import design3_square from "";
// import design3_vertical from "";
// import design3_horizontal from "";

const Album = ({ data }) => {
  // const [skinElement,setSkinElement] = useState(null);
  let skinElement;
  const imageurl = data.url;
  const vidConfig = data.vidConfig;
  const skinNum = data.skin;
  console.log(vidConfig + " " + skinNum);
  const classNameBySkin =
    skinNum === 0
      ? styles.default
      : skinNum === 1
      ? styles.opt1
      : skinNum === 2
      ? styles.opt2
      : skinNum === 3
      ? styles.opt3
      : styles.opt4;
  console.log("ClassNameBySkin :");
  console.log(classNameBySkin);
  const classNameByConfig =
    vidConfig === 0
      ? styles.square
      : vidConfig === 1
      ? styles.vertical
      : styles.horizontal;

  if (skinNum === 1) {
    const image =
      vidConfig === 0
        ? design1_square
        : vidConfig === 1
        ? design1_vertical
        : design1_horizontal;

    skinElement = (
      <img className={styles.skinElement} src={image} width="350" />
    );
  } else if (skinNum === 2) {
    const image =
      vidConfig === 0
        ? design2_square
        : vidConfig === 1
        ? design2_vertical
        : design2_horizontal;

    skinElement = (
      <>
        {vidConfig === 1 && (
          <div className={styles.skkucomit}>
            <p className={styles.skku}>SKKU</p>
            <p className={styles.comit}>COMIT</p>
          </div>
        )}
        <img className={styles.skinElement} src={image} width="350" />
      </>
    );
  } else if (skinNum === 3) {
    // const image =
    //   vidConfig === 0
    //     ? design1_square
    //     : vidConfig === 1
    //     ? design1_vertical2
    //     : design1_horizontal;
    // skinElement = (
    //   <>
    //     {vidConfig === 1 && <div></div>}
    //     <img className={styles.skinElement} src={image} width="350" />
    //   </>
    // );
  } else if (skinNum === 4) {
    // if (vidConfig === 0) {
    //   setSkinElement();
    // } else if (vidConfig === 1) {
    //   setSkinElement();
    // } else {
    //   setSkinElement();
    // }
  }

  return (
    <div className={`${styles.container} ${classNameBySkin}`}>
      {skinElement}
      <div className={`${styles.mask} ${classNameByConfig}`}>
        <img src={imageurl} alt="img" />
      </div>
    </div>
  );
};

export default Album;
