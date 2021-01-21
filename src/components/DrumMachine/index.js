import React, {useState, useCallback, useEffect} from 'react';

import useSequencer from './hooks/useSequencer';

import Sequence from './components/Sequence';
import ParameterControls from './components/ParameterControls';

import useDrumSynth from '../../synthesis/useDrumSynth';

import {
  initialKickSequence,
  initialSnareSequence,
  initialHiHatSequence,
} from './initialSequences';

import styles from './styles.module.css';

const initialBpm = 120;
const initialSwing = 0.5;
const initialVolume = 1;

function toggleSequenceNote(sequence, index) {
  const sequenceCopy = [...sequence];

  sequenceCopy[index] = !sequenceCopy[index];
  return sequenceCopy;
}

function DrumMachine({connect, analyser, audioContext}) {
  const synth = useDrumSynth(audioContext, analyser);

  const [bpm, setBpm] = useState(initialBpm);
  const [swing, setSwing] = useState(initialSwing);
  const [volume, setVolume] = useState(initialVolume);
  const [currentNote, setCurrentNote] = useState(null);

  const sequencer = useSequencer(synth, setCurrentNote);
  const [sequences, setSequences] = useState([
    initialKickSequence,
    initialSnareSequence,
    initialHiHatSequence,
  ]);

  const handleClickClear = useCallback(
    () =>
      setSequences([
        Array(16).fill(false),
        Array(16).fill(false),
        Array(16).fill(false),
      ]),
    [setSequences],
  );

  const handleChangeSwing = useCallback(e => setSwing(e.target.value), []);
  const handleChangeVolume = useCallback(e => setVolume(e.target.value), []);

  const handleMouseDownNote = useCallback(
    sequenceIndex => noteIndex => () =>
      setSequences(sequences => {
        const oldSequence = sequences[sequenceIndex];
        const newSequence = toggleSequenceNote(oldSequence, noteIndex);

        return [
          ...sequences.slice(0, sequenceIndex),
          newSequence,
          ...sequences.slice(sequenceIndex + 1),
        ];
      }),
    [setSequences],
  );

  const handleMouseEnterNote = useCallback(
    sequenceIndex => noteIndex => e =>
      setSequences(sequences => {
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
    [setSequences],
  );

  useEffect(() => sequencer.setBpm(bpm), [sequencer, bpm]);
  useEffect(() => sequencer.setSwing(swing), [sequencer, swing]);
  useEffect(() => sequencer.setSequences(sequences), [sequencer, sequences]);
  useEffect(() => (synth.masterGain.gain.value = volume), [synth, volume]);

  useEffect(() => {
    connect({synth, sequencer, setBpm});
  }, [synth, sequencer, connect]);

  return (
    <div className={styles.DrumMachineContainer}>
      <h2>DRUM MACHINE</h2>

      <div className={styles.DrumMachinebody}>
        <div className={styles.Sequencer}>
          <Sequence
            label="Kick"
            sequence={sequences[0]}
            currentNote={currentNote}
            handleMouseDownNote={handleMouseDownNote(0)}
            handleMouseEnterNote={handleMouseEnterNote(0)}
          />
          <Sequence
            label="Snare"
            sequence={sequences[1]}
            currentNote={currentNote}
            handleMouseDownNote={handleMouseDownNote(1)}
            handleMouseEnterNote={handleMouseEnterNote(1)}
          />
          <Sequence
            label="Hi-hat"
            sequence={sequences[2]}
            currentNote={currentNote}
            handleMouseDownNote={handleMouseDownNote(2)}
            handleMouseEnterNote={handleMouseEnterNote(2)}
          />
        </div>

        <div className={styles.ParameterControls}>
          <ParameterControls
            swing={swing}
            volume={volume}
            handleChangeSwing={handleChangeSwing}
            handleChangeVolume={handleChangeVolume}
          />
          <div className={styles.DrumMachineButtons}>
            <button onClick={handleClickClear}>Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrumMachine;
