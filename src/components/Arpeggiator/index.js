import React, { memo, useState, useCallback, useEffect } from "react";
import { baseNotes } from "../../synthesis/notes";

import useSequencer from "./hooks/useSequencer";

import { initialSequences } from "./initialSequences";

import styles from "./styles.module.css";

function toggleSequenceNote(sequence, index) {
  const sequenceCopy = [...sequence];

  sequenceCopy[index] = !sequenceCopy[index];
  return sequenceCopy;
}

function Arpeggiator({ synth, connect }) {
  const [sequences, setSequences] = useState(initialSequences);
  const [currentNote, setCurrentNote] = useState(null);

  const [octave, setOctave] = useState(1);
  const [hold, setHold] = useState(0.1);
  const [bpm, setBpm] = useState(120);

  const sequencer = useSequencer(synth, setCurrentNote);

  const handleClickClear = useCallback(() => {
    setSequences([
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
    ]);
  }, [setSequences]);

  const handleChangeOctave = useCallback(
    (e) => setOctave(Number(e.target.value)),
    [setOctave]
  );

  const handleChangeHold = useCallback(
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
  useEffect(() => sequencer.setBpm(bpm), [sequencer, bpm]);

  useEffect(() => {
    connect({ synth, sequencer, setBpm });
  }, [synth, sequencer, connect]);

  return (
    <div className={styles.Arpeggiator}>
      <div className={styles.ArpeggiatorBody}>
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
                      onMouseDown={handleMouseDownNote(
                        sequenceIndex,
                        noteIndex
                      )}
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
        <div className={styles.ParameterControls}>
          <div className={styles.Parameters}>
            <div className={styles.ParameterControl}>
              <label htmlFor="octave">Octave</label>
              <input
                type="range"
                id="octave"
                name="octave"
                min="0"
                max="6"
                step="1"
                value={octave}
                onChange={handleChangeOctave}
              />
              <div>{octave}</div>
            </div>
            <div className={styles.ParameterControl}>
              <label htmlFor="hold">Hold</label>
              <input
                type="range"
                name="hold"
                step="0.01"
                min="0.01"
                max="1"
                value={hold}
                onChange={handleChangeHold}
              />
              <div>{(hold * 100).toFixed(0)}%</div>
            </div>
          </div>
          <div className={styles.ArpeggiatorButtons}>
            <button onClick={handleClickClear}>Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Arpeggiator);
