import React from "react";
import PanoramaViewer from "./components/PanoramaViewer";

function App() {
  return (
    <div className="App">
      <PanoramaViewer
        texturePath="/images/pano_1.jpg"
        lowResTexturePath={"/images/pano_1_small.jpg"}
      />
    </div>
  );
}

export default App;
