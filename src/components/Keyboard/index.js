import React, { useCallback } from "react";

import Controls from "./components/Controls";
import Keys from "./components/Keys";

import useKeys from "./hooks/useKeys";
import useSynth from "./hooks/useSynth";
import useControls from "./hooks/useControls";

import keyStyles from "./components/Keys/styles.module.css";
import styles from "./styles.module.css";

function Keyboard() {
  const synth = useSynth();

  const {
    volume,
    attack,
    release,
    waveform1,
    waveform2,
    handleVolumeChange,
    handleAttackChange,
    handleReleaseChange,
    handleWaveformChange1,
    handleWaveformChange2,
  } = useControls(synth);

  const onNotePressed = useCallback(
    (e) => {
      if (e.buttons === 1) {
        const { note } = e.target.dataset;

        synth.playNote(waveform1, waveform2, attack, note);

        e.target.classList.add(keyStyles.KeyPressed);
      }
    },
    [synth, waveform1, waveform2, attack]
  );

  const onNoteReleased = useCallback(
    (e) => {
      const { note } = e.target.dataset;

      synth.stopNote(release, note);

      e.target.classList.remove(keyStyles.KeyPressed);
    },
    [synth, release]
  );

  useKeys({ onNotePressed, onNoteReleased });

  return (
    <div className={styles.KeyboardContainer}>
      <h2>KEYBOARD</h2>
      <Controls
        volume={volume}
        attack={attack}
        release={release}
        waveform1={waveform1}
        waveform2={waveform2}
        handleVolumeChange={handleVolumeChange}
        handleAttackChange={handleAttackChange}
        handleReleaseChange={handleReleaseChange}
        handleWaveformChange1={handleWaveformChange1}
        handleWaveformChange2={handleWaveformChange2}
      />
      <Keys onNotePressed={onNotePressed} onNoteReleased={onNoteReleased} />
    </div>
  );
}

export default Keyboard;
