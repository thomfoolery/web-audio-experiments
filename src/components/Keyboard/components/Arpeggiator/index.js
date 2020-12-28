import React, { memo, useState, useCallback, useEffect } from "react";
import { baseNotes } from "../../../../synthesis/notes";

import useSequencer from "../../hooks/useSequencer";

import styles from "./styles.module.css";

const initialSequences = Array(baseNotes.length)
  .fill(true)
  .map(() => Array(16).fill(false));

function toggleSequenceNote(sequence, index) {
  const sequenceCopy = [...sequence];

  sequenceCopy[index] = !sequenceCopy[index];
  return sequenceCopy;
}

function Arpeggiator({ synth }) {
  const [sequences, setSequences] = useState(initialSequences);
  const [currentNote, setCurrentNote] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [octave, setOctave] = useState(3);
  const [hold, setHold] = useState(0.1);

  const sequencer = useSequencer(synth, setIsPlaying, setCurrentNote);

  const handleClickPlayStop = useCallback(() => {
    if (isPlaying) {
      sequencer.stop();
    } else {
      sequencer.start();
    }
  }, [isPlaying, sequencer]);

  const handleClickClear = useCallback(() => setSequences(initialSequences), [
    setSequences,
  ]);

  const handleChangeOctave = useCallback((e) => setOctave(e.target.value), [
    setOctave,
  ]);

  const handleChangehold = useCallback(
    (e) => setHold(Number(e.target.value)),
    []
  );

  const handleMouseDownNote = useCallback(
    (sequenceIndex, noteIndex) => () =>
      setSequences((sequences) => {
        const oldSequence = sequences[sequenceIndex];
        const newSequence = toggleSequenceNote(oldSequence, noteIndex);

        return [
          ...sequences.slice(0, sequenceIndex),
          newSequence,
          ...sequences.slice(sequenceIndex + 1),
        ];
      }),
    [setSequences]
  );

  const handleMouseEnterNote = useCallback(
    (sequenceIndex, noteIndex) => (e) =>
      setSequences((sequences) => {
        if (e.buttons === 1) {
          const oldSequence = sequences[sequenceIndex];
          const newSequence = toggleSequenceNote(oldSequence, noteIndex);

          return [
            ...sequences.slice(0, sequenceIndex),
            newSequence,
            ...sequences.slice(sequenceIndex + 1),
          ];
        }
        return sequences;
      }),
    [setSequences]
  );

  useEffect(() => sequencer.setSequences(sequences), [sequencer, sequences]);
  useEffect(() => sequencer.setOctave(octave), [sequencer, octave]);
  useEffect(() => sequencer.setHold(hold), [sequencer, hold]);

  return (
    <div className={styles.Arpeggiator}>
      <div className={styles.ArpeggiatorControls}>
        <div className={styles.ArpeggiatorButtons}>
          <button onClick={handleClickPlayStop}>
            {isPlaying ? "Stop" : "Play"}
          </button>
          <button onClick={handleClickClear}>Clear</button>
        </div>
        <div className={styles.ArpeggiatorControl}>
          <label htmlFor="octave">Octave</label>
          <select
            id="octave"
            name="octave"
            value={octave}
            onChange={handleChangeOctave}
          >
            <option>0</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </select>
        </div>
        <div className={styles.ArpeggiatorControl}>
          <label htmlFor="hold">hold</label>
          <input
            type="range"
            name="hold"
            step="0.01"
            min="0.01"
            max="1"
            value={hold}
            onChange={handleChangehold}
          />
          <div>{hold}s</div>
        </div>
      </div>
      <div className={styles.Sequences}>
        {baseNotes.map(([note], sequenceIndex) => {
          return (
            <div key={`note-${note}`} className={styles.Sequence}>
              <div>{note}</div>
              {sequences[sequenceIndex].map((note, noteIndex) => {
                const classList = [styles.Note];

                if (currentNote === noteIndex) {
                  classList.push(styles.NoteCurrent);
                }

                if (note === true) {
                  classList.push(styles.NoteSelected);
                }
                return (
                  <div
                    className={classList.join(" ")}
                    key={`note-${note}-${noteIndex}`}
                    onMouseDown={handleMouseDownNote(sequenceIndex, noteIndex)}
                    onMouseEnter={handleMouseEnterNote(
                      sequenceIndex,
                      noteIndex
                    )}
                  >
                    {noteIndex + 1}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Arpeggiator);
