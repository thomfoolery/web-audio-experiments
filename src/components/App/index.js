import React, {useRef, useMemo, useState, useCallback, useEffect} from 'react';
import Keyboard from '../Keyboard';
import DrumMachine from '../DrumMachine';
import Oscilloscope from '../Oscilloscope';
import FrequencyAnalyzer from '../FrequencyAnalyzer';

import styles from './styles.module.css';

function App() {
  const audioContext = useMemo(() => new AudioContext(), []);

  const {analyser, masterGain} = useMemo(() => {
    const analyser = audioContext.createAnalyser();
    const masterGain = audioContext.createGain();

    masterGain.connect(audioContext.destination);
    analyser.connect(masterGain);

    return {analyser, masterGain};
  }, [audioContext]);

  const setBpmCBs = useRef([]);
  const setIsPlayingCBs = useRef([]);

  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClickPlayStop = useCallback(
    () => setIsPlaying(isPlaying => !isPlaying),
    [],
  );

  const handleChangeBpm = useCallback(e => setBpm(e.target.value), [setBpm]);
  const handleChangeVolume = useCallback(e => setVolume(e.target.value), [
    setVolume,
  ]);

  const connect = useCallback(({sequencer, setBpm}) => {
    if (sequencer) {
      setIsPlayingCBs.current.push(sequencer);
    }
    if (setBpm) {
      setBpmCBs.current.push(setBpm);
    }
  }, []);

  useEffect(() => {
    setIsPlayingCBs.current.forEach(sequencer => {
      if (isPlaying) {
        sequencer.start();
      } else {
        sequencer.stop();
      }
    });
  }, [isPlaying]);

  useEffect(() => setBpmCBs.current.forEach(setBpm => setBpm(bpm)), [bpm]);
  useEffect(() => (masterGain.gain.value = volume), [volume, masterGain]);

  return (
    <div className={styles.App}>
      <div className={styles.TopBar}>
        <button
          onClick={handleClickPlayStop}
          className={isPlaying ? styles.PlayButtonOn : styles.PlayButtonOff}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <div className={styles.Analysers}>
          <Oscilloscope analyser={analyser} width="250px" height="50px" />
          <FrequencyAnalyzer analyser={analyser} width="250px" height="50px" />
        </div>
        <div>
          <div className={styles.ParameterControl}>
            <label>Tempo</label>
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
          <div className={styles.ParameterControl}>
            <label>Volume</label>
            <input
              type="range"
              name="volume"
              step="0.1"
              min="0"
              max="1"
              value={volume}
              onChange={handleChangeVolume}
            />
            <div>{volume * 10}/10</div>
          </div>
        </div>
      </div>
      <main className={styles.Main}>
        <DrumMachine
          connect={connect}
          analyser={analyser}
          audioContext={audioContext}
        />
        <Keyboard
          connect={connect}
          analyser={analyser}
          isPlaying={isPlaying}
          audioContext={audioContext}
        />
      </main>
    </div>
  );
}

export default App;
