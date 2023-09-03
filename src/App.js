import Gallery from "./Components/Gallery";
import Header from "./Components/Header";
import "./App.css";
import { useCallback, useState } from "react";

function App() {
  const [takePhoto, setTakePhoto] = useState(false);
  const toggleModal = useCallback(() => setTakePhoto((prev) => !prev), []);
  return (
    <div className="App">
      <Header onClick={toggleModal} />
      <Gallery takePhoto={takePhoto} onToggleModalHandler={toggleModal} />
    </div>
  );
}

export default App;
