import Gallery from "./Components/Gallery";
import Header from "./Components/Header";
import "./App.css";
import { useCallback, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ActionBar from "./Components/ActionBar";

function App() {
  
  const PC = useMediaQuery({
    query : "(min-width:1024px)"
  });
  const TABLET = useMediaQuery({
    query : "(min-width:768px) and (max-width:1023px)"
  });
  const MOBILE = useMediaQuery({
    query : "(max-width:767px)"
  });
  const version = PC ? 'pc' : TABLET ? 'tablet' : 'mobile';
  const [takePhoto, setTakePhoto] = useState(false);
  const toggleModal = useCallback(() => setTakePhoto((prev) => !prev), []);
  return (
    <div className="App">
      <Header onClick={toggleModal} version={version} />
      <Gallery takePhoto={takePhoto} onToggleModalHandler={toggleModal} version={version} />
      {MOBILE && <ActionBar onTakePhoto={toggleModal}/>}
    </div>
  );
}

export default App;
