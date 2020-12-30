import { useMemo } from "react";

import { baseNotes } from "../../../synthesis/notes";

const lookahead = 100; // ms
const schedulerInterval = 25; // ms

function useSequencer(synth, setCurrentNote, timeSignature = "4/4") {
  return useMemo(() => {
    const { audioContext } = synth;

    const [beatsPerBar, notesPerBeat] = timeSignature.split("/");
    const sequenceLength = beatsPerBar * notesPerBeat;

    let sequences = [
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
    ];

    let nextNoteTime = 0;
    let currentNote = 0;
    let hold = 0.1;
    let octave = 3;
    let bpm = 120;

    let timerID;

    function nextNote() {
      const secondsPerNote = 60 / (bpm * notesPerBeat);

      nextNoteTime += secondsPerNote;
      currentNote++;

      if (currentNote === sequenceLength) {
        currentNote = 0;
      }
    }

    function checkNote(sequence, index) {
      if (sequence[currentNote] === true) {
        const secondsPerNote = 60 / (bpm * notesPerBeat);
        // eslint-disable-next-line no-unused-vars
        const [_, baseFrequency] = baseNotes[index];
        const frequency = baseFrequency * Math.pow(2, octave);

        synth.playNote(
          frequency,
          audioContext.currentTime,
          secondsPerNote * hold
        );
      }
    }

    function scheduler() {
      while (nextNoteTime < audioContext.currentTime + lookahead / 1000) {
        sequences.forEach(checkNote);

        setCurrentNote(currentNote);
        nextNote();
      }

      timerID = setTimeout(scheduler, schedulerInterval);
    }

    function start() {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      nextNoteTime = audioContext.currentTime;
      currentNote = 0;

      scheduler();
    }

    function stop() {
      clearTimeout(timerID);
      setCurrentNote(null);
    }

    function setSequences(newSequence) {
      sequences = newSequence;
    }

    function setHold(newHold) {
      hold = newHold;
    }

    function setOctave(newOctave) {
      octave = newOctave;
    }

    function setBpm(newBpm) {
      bpm = newBpm;
    }

    return {
      start,
      stop,
      setBpm,
      setHold,
      setOctave,
      setSequences,
    };
  }, [synth, setCurrentNote, timeSignature]);
}

export default useSequencer;
