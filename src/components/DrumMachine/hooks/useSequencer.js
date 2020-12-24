import { useMemo } from "react";

const scheduleAheadTime = 0.1; // s
const lookahead = 25; // ms

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

    function scheduler() {
      while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        sequences.forEach((seq, index) => {
          if (seq[currentNote] === true) {
            if (index === 0) synth.playKick(nextNoteTime);
            if (index === 1) synth.playSnare(nextNoteTime);
            if (index === 2) synth.playHiHat(nextNoteTime);
          }
        });

        setCurrentNote(currentNote);
        nextNote();
      }

      timerID = setTimeout(scheduler, lookahead);
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

    function setBpm(newBpm) {
      bpm = newBpm;
    }

    return { start, stop, setBpm, setSequence };
  }, [synth, setIsPlaying, setCurrentNote]);
}

export default useSequencer;
