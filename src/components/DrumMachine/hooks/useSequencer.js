import { useMemo } from "react";

const lookahead = 100; // ms
const schedulerInterval = 25; // ms

function useSequencer(
  synth,
  setIsPlaying,
  setCurrentNote,
  timeSignature = "4/4"
) {
  return useMemo(() => {
    const { audioContext } = synth;

    const [beatsPerBar, notesPerBeat] = timeSignature.split("/");
    const sequenceLength = beatsPerBar * notesPerBeat;

    let sequences = [
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
    ];

    let nextNoteTime = 0;
    let currentNote = 0;
    let swing = 0.5;
    let bpm = 120;

    let timerID;

    function nextNote() {
      const secondsPerNote = 60 / (bpm * notesPerBeat);
      console.log(secondsPerNote);
      nextNoteTime += secondsPerNote;
      currentNote++;

      if (currentNote === sequenceLength) {
        currentNote = 0;
      }
    }

    function checkNote(seq, index) {
      if (seq[currentNote] === true) {
        const secondsPerNote = 60 / (bpm * notesPerBeat);
        const offset =
          currentNote % 2 === 0 ? (swing - 0.5) * secondsPerNote : 0;
        if (index === 0) synth.playKick(nextNoteTime + offset);
        if (index === 1) synth.playSnare(nextNoteTime + offset);
        if (index === 2) synth.playHiHat(nextNoteTime + offset);
      }
    }

    function scheduler() {
      while (nextNoteTime < audioContext.currentTime + lookahead / 100) {
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

      setIsPlaying(true);
      scheduler();
    }

    function stop() {
      clearTimeout(timerID);
      setCurrentNote(null);
      setIsPlaying(false);
    }

    function setSequence(index, newSequence) {
      sequences[index] = newSequence;
    }

    function setSwing(newSwing) {
      swing = newSwing;
    }

    function setBpm(newBpm) {
      bpm = newBpm;
    }

    return { start, stop, setBpm, setSwing, setSequence };
  }, [synth, setIsPlaying, setCurrentNote, timeSignature]);
}

export default useSequencer;
