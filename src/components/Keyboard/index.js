import React, {useRef, useState, useCallback, useEffect} from 'react';

import Arpeggiator from '../Arpeggiator';

import {allNotesMap} from '../../synthesis/notes';

// import ParameterControls from './components/ParameterControls';

import Keys from './components/Keys';

import useKeys from './hooks/useKeys';
// import useControls from './hooks/useControls';

import wind from '../../synthesis/patches/wind.json';
import bells from '../../synthesis/patches/bells.json';
import fanfare from '../../synthesis/patches/fanfare.json';
import fatBass from '../../synthesis/patches/fat-bass.json';
import simpleFm from '../../synthesis/patches/simple-fm.json';
import tb303 from '../../synthesis/patches/tb-303.json';
import tesla from '../../synthesis/patches/tesla.json';
import violin from '../../synthesis/patches/violin.json';
import useComposeSynth from '../../synthesis/useComposeSynth';
import pew from '../../synthesis/patches/pew.json';
// import robot from '../../synthesis/patches/robot.json';
// import smurfShrek from '../../synthesis/patches/smurf-&-shrek.json';
// import space from '../../synthesis/patches/space.json';
// import useSynth from '../../synthesis/useSynth';

import keyStyles from './components/Keys/styles.module.css';
import styles from './styles.module.css';

const patches = [
  ['tb303', tb303],
  ['violin', violin],
  ['bells', bells],
  ['fanfare', fanfare],
  ['fatBass', fatBass],
  ['simpleFm', simpleFm],
  ['tesla', tesla],
  ['wind', wind],
  ['pew', pew],
  // ['robot', robot],
  // ['smurfShrek', smurfShrek],
  // ['space', space],
];

function Keyboard({isPlaying, connect, analyser, audioContext}) {
  const [patch, setPatch] = useState(patches[0][1]);
  const synth = useComposeSynth(audioContext, analyser, patch);

  // const {
  //   volume,
  //   attack,
  //   release,
  //   waveform1,
  //   waveform2,
  //   handleVolumeChange,
  //   handleAttackChange,
  //   handleReleaseChange,
  //   handleWaveformChange1,
  //   handleWaveformChange2,
  // } = useControls(synth);

  const setIsPlayingCBs = useRef([]);
  const [isArpVisible, setIsArpVisible] = useState(false);

  const handleChangePatch = useCallback(event => {
    const patch = patches.find(([name]) => name === event.target.value).pop();
    setPatch(patch);
  }, []);

  const toggleIsArpVisible = useCallback(
    () => setIsArpVisible(isArpVisible => !isArpVisible),
    [],
  );

  const onNotePressed = useCallback(
    e => {
      if (e.buttons === 1) {
        const {note} = e.target.dataset;
        const frequency = allNotesMap[note];

        synth.playNote(frequency);

        e.target.classList.add(keyStyles.KeyPressed);
      }
    },
    [synth],
  );

  const onNoteReleased = useCallback(
    e => {
      const {note} = e.target.dataset;
      const frequency = allNotesMap[note];

      synth.stopNote(frequency);

      e.target.classList.remove(keyStyles.KeyPressed);
    },
    [synth],
  );

  const reconnect = useCallback(
    (...args) => {
      const [{sequencer}] = args;

      if (sequencer) {
        setIsPlayingCBs.current.push(sequencer);
      }
      connect(args);
    },
    [connect],
  );

  useKeys({onNotePressed, onNoteReleased});

  // useEffect(() => synth.setAttack(attack), [synth, attack]);
  // useEffect(() => synth.setRelease(release), [synth, release]);
  // useEffect(() => synth.setWaveform1(waveform1), [synth, waveform1]);
  // useEffect(() => synth.setWaveform2(waveform2), [synth, waveform2]);

  useEffect(() => {
    setIsPlayingCBs.current.forEach(sequencer => {
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
      {/* <ParameterControls
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
      /> */}
      <select onChange={handleChangePatch}>
        {patches.map(([name]) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <div className={styles.ArpeggiatorContainer}>
        <div className={styles.ArpeggiatorHeader}>
          <h3>Arpeggiator</h3>
          <button onClick={toggleIsArpVisible}>
            {isArpVisible ? 'Close' : 'Open'}
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
