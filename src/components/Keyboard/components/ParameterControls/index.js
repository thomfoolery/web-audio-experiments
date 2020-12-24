import React from "react";

import styles from "./styles.module.css";

function ParameterControls({
  waveform1,
  waveform2,
  attack,
  release,
  volume,
  handleWaveformChange1,
  handleWaveformChange2,
  handleAttackChange,
  handleReleaseChange,
  handleVolumeChange,
}) {
  return (
    <div className={styles.ParameterControls}>
      <div>
        {/* Waveform 1 */}
        <div className={styles.ParameterControl}>
          <label htmlFor="waveform1">Waveform 1</label>
          <select
            name="waveform1"
            value={waveform1}
            onChange={handleWaveformChange1}
          >
            <option value="sine">Wave</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        {/* Waveform 2 */}
        <div className={styles.ParameterControl}>
          <label htmlFor="waveform2">Waveform 2</label>
          <select
            name="waveform2"
            value={waveform2}
            onChange={handleWaveformChange2}
          >
            <option value="sine">Wave</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
      </div>
      <div>
        {/* Attack */}
        <div className={styles.ParameterControl}>
          <label htmlFor="attack">Attack</label>
          <input
            type="range"
            name="attack"
            min={0}
            max={1}
            step={0.1}
            value={attack}
            onChange={handleAttackChange}
          />
          <div>{attack}s</div>
        </div>
        {/* Release */}
        <div className={styles.ParameterControl}>
          <label htmlFor="release">Release</label>
          <input
            type="range"
            name="release"
            min={0}
            max={1}
            step={0.1}
            value={release}
            onChange={handleReleaseChange}
          />
          <div>{release}s</div>
        </div>
        {/* Volume */}
        <div className={styles.ParameterControl}>
          <label htmlFor="volume">Volume</label>
          <input
            type="range"
            name="volume"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={handleVolumeChange}
          />
          <div>{volume * 10}/10</div>
        </div>
      </div>
    </div>
  );
}

export default ParameterControls;
