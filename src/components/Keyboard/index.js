import React, { useCallback, useEffect } from "react";

import { allNotesMap } from "../../synthesis/notes";

import ParameterControls from "./components/ParameterControls";
import Arpeggiator from "./components/Arpeggiator";
import Keys from "./components/Keys";

import useKeys from "./hooks/useKeys";
import useControls from "./hooks/useControls";

import keyStyles from "./components/Keys/styles.module.css";
import styles from "./styles.module.css";

function Keyboard({ synth }) {
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
        const frequency = allNotesMap[note];

        synth.playNote(frequency);

        e.target.classList.add(keyStyles.KeyPressed);
      }
    },
    [synth, waveform1, waveform2, attack]
  );

  const onNoteReleased = useCallback(
    (e) => {
      const { note } = e.target.dataset;
      const frequency = allNotesMap[note];

      synth.stopNote(frequency);

      e.target.classList.remove(keyStyles.KeyPressed);
    },
    [synth, release]
  );

  useKeys({ onNotePressed, onNoteReleased });

  useEffect(() => synth.setAttack(attack), [attack]);
  useEffect(() => synth.setRelease(release), [release]);
  useEffect(() => synth.setWaveform1(waveform1), [waveform1]);
  useEffect(() => synth.setWaveform2(waveform2), [waveform2]);

  return (
    <div className={styles.KeyboardContainer}>
      <h2>KEYBOARD</h2>
      <ParameterControls
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
      <Arpeggiator
        synth={synth}
        attack={attack}
        release={release}
        waveform1={waveform1}
        waveform2={waveform2}
      />
      <Keys onNotePressed={onNotePressed} onNoteReleased={onNoteReleased} />
    </div>
  );
}

export default Keyboard;
