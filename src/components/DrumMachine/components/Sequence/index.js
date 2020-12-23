import React, { memo } from "react";

import styles from "./styles.module.css";

function Sequence({ label, sequence, currentNote, handleClickNote }) {
  return (
    <div className={styles.Sequence}>
      <div>{label}</div>
      {sequence.map((note, index) => {
        const classList = [styles.Note];

        if (currentNote === index) {
          classList.push(styles.NoteCurrent);
        }

        if (note === true) {
          classList.push(styles.NoteSelected);
        }

        return (
          <div
            key={`note-${index + 1}`}
            className={classList.join(" ")}
            onClick={handleClickNote(index)}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
}

export default memo(Sequence);
