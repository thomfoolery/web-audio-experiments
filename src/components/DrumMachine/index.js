import React, { useState, useCallback, useEffect } from "react";

import useSynth from "./hooks/useSynth";
import useSequencer from "./hooks/useSequencer";
import Sequence from "./components/Sequence";

import {
  initialKickSequence,
  initialSnareSequence,
  initialHiHatSequence,
} from "./initialSequences";

import styles from "./styles.module.css";

const initialBpm = 120;

function toggleSequenceNote(sequence, index) {
  const sequenceCopy = [...sequence];

  sequenceCopy[index] = !sequenceCopy[index];
  return sequenceCopy;
}

function DrumMachine() {
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const synth = useSynth();
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

  const handleClickKickNote = useCallback(
    (index) => () =>
      setKickSequence((sequence) => toggleSequenceNote(sequence, index)),
    [setKickSequence]
  );

  const handleClickSnareNote = useCallback(
    (index) => () =>
      setSnareSequence((sequence) => toggleSequenceNote(sequence, index)),
    [setSnareSequence]
  );

  const handleClickHiHatNote = useCallback(
    (index) => () =>
      setHiHatSequence((sequence) => toggleSequenceNote(sequence, index)),
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

  useEffect(() => {
    sequencer.setBpm(bpm);
  }, [sequencer, bpm]);

  return (
    <div className={styles.DrumMachineContainer}>
      <h2>DRUM MACHINE</h2>

      <div className={styles.DrumMachineControls}>
        <button onClick={handleClickPlayStop}>
          {isPlaying ? "Stop" : "Play"}
        </button>
        <div className={styles.BpmControl}>
          <input
            type="range"
            name="bpm"
            step="1"
            min="60"
            max="260"
            value={bpm}
            onChange={handleChangeBpm}
          />
          <div>{bpm} BPM</div>
        </div>
      </div>

      <div className={styles.Sequencer}>
        <Sequence
          label="Kick"
          sequence={kickSequence}
          currentNote={currentNote}
          handleClickNote={handleClickKickNote}
        />
        <Sequence
          label="Snare"
          sequence={snareSequence}
          currentNote={currentNote}
          handleClickNote={handleClickSnareNote}
        />
        <Sequence
          label="Hi-hat"
          sequence={hiHatSequence}
          currentNote={currentNote}
          handleClickNote={handleClickHiHatNote}
        />
      </div>
    </div>
  );
}

export default DrumMachine;
