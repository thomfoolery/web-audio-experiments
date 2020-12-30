import React, { useRef, useState, useCallback, useEffect } from "react";

import Arpeggiator from "../Arpeggiator";

import { allNotesMap } from "../../synthesis/notes";

import ParameterControls from "./components/ParameterControls";

import Keys from "./components/Keys";

import useKeys from "./hooks/useKeys";
import useControls from "./hooks/useControls";

import keyStyles from "./components/Keys/styles.module.css";
import styles from "./styles.module.css";

function Keyboard({ synth, isPlaying, connect }) {
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

  const setIsPlayingCBs = useRef([]);
  const [isArpVisible, setIsArpVisible] = useState(false);

  const toggleIsArpVisible = useCallback(
    () => setIsArpVisible((isArpVisible) => !isArpVisible),
    []
  );

  const onNotePressed = useCallback(
    (e) => {
      if (e.buttons === 1) {
        const { note } = e.target.dataset;
        const frequency = allNotesMap[note];

        synth.playNote(frequency);

        e.target.classList.add(keyStyles.KeyPressed);
      }
    },
    [synth]
  );

  const onNoteReleased = useCallback(
    (e) => {
      const { note } = e.target.dataset;
      const frequency = allNotesMap[note];

      synth.stopNote(frequency);

      e.target.classList.remove(keyStyles.KeyPressed);
    },
    [synth]
  );

  const reconnect = useCallback(
    (...args) => {
      const [{ sequencer }] = args;

      if (sequencer) {
        setIsPlayingCBs.current.push(sequencer);
      }
      connect(args);
    },
    [connect]
  );

  useKeys({ onNotePressed, onNoteReleased });

  useEffect(() => synth.setAttack(attack), [synth, attack]);
  useEffect(() => synth.setRelease(release), [synth, release]);
  useEffect(() => synth.setWaveform1(waveform1), [synth, waveform1]);
  useEffect(() => synth.setWaveform2(waveform2), [synth, waveform2]);

  useEffect(() => {
    setIsPlayingCBs.current.forEach((sequencer) => {
      if (isArpVisible && isPlaying) {
        sequencer.start();
      } else {
        sequencer.stop();
      }
    });
  }, [isPlaying, isArpVisible]);

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
      <div className={styles.ArpeggiatorContainer}>
        <div className={styles.ArpeggiatorHeader}>
          <h3>Arpeggiator</h3>
          <button onClick={toggleIsArpVisible}>
            {isArpVisible ? "Close" : "Open"}
          </button>
        </div>
        <div
          className={
            isArpVisible ? styles.ArpeggiatorVisible : styles.ArpeggiatorHidden
          }
        >
          <Arpeggiator synth={synth} connect={reconnect} />
        </div>
      </div>
      <Keys onNotePressed={onNotePressed} onNoteReleased={onNoteReleased} />
    </div>
  );
}

export default Keyboard;
