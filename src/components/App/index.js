import React from "react";
import Keyboard from "../Keyboard";
import DrumMachine from "../DrumMachine";

import styles from "./styles.module.css";

function App() {
  return (
    <div className={styles.App}>
      <Keyboard />
      <DrumMachine />
    </div>
  );
}

export default App;
