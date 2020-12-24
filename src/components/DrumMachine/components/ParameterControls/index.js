import React, { memo } from "react";

import styles from "./styles.module.css";

function ParameterControls({
  bpm,
  swing,
  volume,
  handleChangeBpm,
  handleChangeSwing,
  handleChangeVolume,
}) {
  return (
    <div className={styles.ParameterControls}>
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
        <label>Swing</label>
        <input
          type="range"
          name="swing"
          step="0.01"
          min="0"
          max="1"
          value={swing}
          onChange={handleChangeSwing}
        />
        <div>{(swing * 100).toFixed(0) - 50} %</div>
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
  );
}

export default memo(ParameterControls);
