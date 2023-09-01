import Gallery from "./Components/Gallery";
import Header from "./Components/Header";
import "./App.css";
import PhotoModal from "./Components/PhotoModal";
import { useState } from "react";

function App() {
  const [takePhoto, setTakePhoto] = useState(false);
  const toggleModal = () => setTakePhoto((prev) => !prev);
  return (
    <>
      <Header takePhoto={takePhoto} onClick={toggleModal} />
      <Gallery onClick={toggleModal} />
    </>
  );
}

export default App;
