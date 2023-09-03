import Gallery from "./Components/Gallery";
import Header from "./Components/Header";
import "./App.css";
import { useCallback, useState } from "react";

function App() {
  const [takePhoto, setTakePhoto] = useState(false);
  const toggleModal = useCallback(() => setTakePhoto((prev) => !prev),[]);
  return (
    <>
      <Header onClick={toggleModal} />
      <Gallery takePhoto={takePhoto} onToggleModalHandler={toggleModal} />
    </>
  );
}

export default App;
