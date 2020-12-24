import React from "react";
import Keyboard from "../Keyboard";
import DrumMachine from "../DrumMachine";

import useSynth from "../../synthesis/useSynth";
import useDrumSynth from "../../synthesis/useDrumSynth";

import styles from "./styles.module.css";

function App() {
  const synth = useSynth();
  const drumSynth = useDrumSynth();

  return (
    <div className={styles.App}>
      <DrumMachine synth={drumSynth} />
      <Keyboard synth={synth} />
    </div>
  );
}

export default App;
