import React, { useState, useCallback, useEffect } from "react";

import useSequencer from "./hooks/useSequencer";

import Sequence from "./components/Sequence";
import ParameterControls from "./components/ParameterControls";

import {
  initialKickSequence,
  initialSnareSequence,
  initialHiHatSequence,
} from "./initialSequences";

import styles from "./styles.module.css";

const initialBpm = 120;
const initialSwing = 0.5;
const initialVolume = 0.3;

function toggleSequenceNote(sequence, index) {
  const sequenceCopy = [...sequence];

  sequenceCopy[index] = !sequenceCopy[index];
  return sequenceCopy;
}

function DrumMachine({ synth }) {
  const [bpm, setBpm] = useState(initialBpm);
  const [swing, setSwing] = useState(initialSwing);
  const [volume, setVolume] = useState(initialVolume);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const sequencer = useSequencer(synth, setIsPlaying, setCurrentNote);

  const [kickSequence, setKickSequence] = useState(initialKickSequence);
  const [snareSequence, setSnareSequence] = useState(initialSnareSequence);
  const [hiHatSequence, setHiHatSequence] = useState(initialHiHatSequence);

  const handleClickPlayStop = useCallback(() => {
    if (isPlaying) {
      sequencer.stop();
    } else {
      sequencer.start();
    }
  }, [isPlaying, sequencer]);

  const handleChangeBpm = useCallback((e) => setBpm(e.target.value), []);

  const handleChangeSwing = useCallback((e) => setSwing(e.target.value), []);

  const handleChangeVolume = useCallback((e) => setVolume(e.target.value), []);

  const handleClickClear = useCallback(() => {
    setKickSequence(Array(16).fill(false));
    setSnareSequence(Array(16).fill(false));
    setHiHatSequence(Array(16).fill(false));
  }, [setKickSequence]);

  const handleMouseDownKickNote = useCallback(
    (index) => () =>
      setKickSequence((sequence) => toggleSequenceNote(sequence, index)),
    [setKickSequence]
  );

  const handleMouseDownSnareNote = useCallback(
    (index) => () =>
      setSnareSequence((sequence) => toggleSequenceNote(sequence, index)),
    [setSnareSequence]
  );

  const handleMouseDownHiHatNote = useCallback(
    (index) => () =>
      setHiHatSequence((sequence) => toggleSequenceNote(sequence, index)),
    [setHiHatSequence]
  );

  const handleMouseEnterKickNote = useCallback(
    (index) => (e) => {
      if (e.buttons === 1) {
        setKickSequence((sequence) => toggleSequenceNote(sequence, index));
      }
    },
    [setKickSequence]
  );

  const handleMouseEnterSnareNote = useCallback(
    (index) => (e) => {
      if (e.buttons === 1) {
        setSnareSequence((sequence) => toggleSequenceNote(sequence, index));
      }
    },
    [setSnareSequence]
  );

  const handleMouseEnterHiHatNote = useCallback(
    (index) => (e) => {
      if (e.buttons === 1) {
        setHiHatSequence((sequence) => toggleSequenceNote(sequence, index));
      }
    },
    [setHiHatSequence]
  );

  useEffect(() => sequencer.setSequence(0, kickSequence), [
    sequencer,
    kickSequence,
  ]);

  useEffect(() => sequencer.setSequence(1, snareSequence), [
    sequencer,
    snareSequence,
  ]);

  useEffect(() => sequencer.setSequence(2, hiHatSequence), [
    sequencer,
    hiHatSequence,
  ]);

  useEffect(() => sequencer.setBpm(bpm), [sequencer, bpm]);
  useEffect(() => sequencer.setSwing(swing), [sequencer, swing]);
  useEffect(() => (synth.masterGain.gain.value = volume), [synth, volume]);

  return (
    <div className={styles.DrumMachineContainer}>
      <h2>DRUM MACHINE</h2>

      <div className={styles.DrumMachineHeader}>
        <div className={styles.DrumMachineButtons}>
          <button onClick={handleClickPlayStop}>
            {isPlaying ? "Stop" : "Play"}
          </button>
          <button onClick={handleClickClear}>Clear</button>
        </div>
        <ParameterControls
          bpm={bpm}
          swing={swing}
          volume={volume}
          handleChangeBpm={handleChangeBpm}
          handleChangeSwing={handleChangeSwing}
          handleChangeVolume={handleChangeVolume}
        />
      </div>

      <div className={styles.Sequencer}>
        <Sequence
          label="Kick"
          sequence={kickSequence}
          currentNote={currentNote}
          handleMouseDownNote={handleMouseDownKickNote}
          handleMouseEnterNote={handleMouseEnterKickNote}
        />
        <Sequence
          label="Snare"
          sequence={snareSequence}
          currentNote={currentNote}
          handleMouseDownNote={handleMouseDownSnareNote}
          handleMouseEnterNote={handleMouseEnterSnareNote}
        />
        <Sequence
          label="Hi-hat"
          sequence={hiHatSequence}
          currentNote={currentNote}
          handleMouseDownNote={handleMouseDownHiHatNote}
          handleMouseEnterNote={handleMouseEnterHiHatNote}
        />
      </div>
    </div>
  );
}

export default DrumMachine;
