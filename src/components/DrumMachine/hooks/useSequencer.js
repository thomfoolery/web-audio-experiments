import { useMemo } from "react";

const scheduleAheadTime = 0.1; // s
const lookahead = 25; // ms

const sequenceLength = 16;

function useSequencer(synth, setIsPlaying, setCurrentNote) {
  return useMemo(() => {
    const { audioContext } = synth;

    let sequences = [
      Array(sequenceLength).fill(false),
      Array(sequenceLength).fill(false),
    ];

    let nextNoteTime = 0;
    let currentNote = 0;
    let bpm = 120;

    let timerID;

    function nextNote() {
      const secondsPerNote = 60 / (bpm * 4);

      nextNoteTime += secondsPerNote;
      currentNote++;

      if (currentNote === sequenceLength) {
        currentNote = 0;
      }
    }

    function scheduler() {
      while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        if (sequences[0][currentNote] === true) {
          synth.playKick(nextNoteTime);
        }

        if (sequences[1][currentNote] === true) {
          synth.playSnare(nextNoteTime);
        }

        if (sequences[2][currentNote] === true) {
          synth.playHiHat(nextNoteTime);
        }

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
