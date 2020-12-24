import { useMemo } from "react";
import { allNotesMap } from "./notes";

function useSynth() {
  return useMemo(() => {
    const audioContext = new AudioContext();
    const masterGainNode = audioContext.createGain();
    const noteContexts = {};

    masterGainNode.connect(audioContext.destination);

    function playNote(waveform1, waveform2, attack, note) {
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();

      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();

      const frequency = allNotesMap[note];

      gain1.gain.cancelScheduledValues(audioContext.currentTime);
      gain1.gain.setValueAtTime(0, audioContext.currentTime);
      gain1.gain.linearRampToValueAtTime(
        0.5,
        audioContext.currentTime + attack
      );

      gain2.gain.cancelScheduledValues(audioContext.currentTime);
      gain2.gain.setValueAtTime(0, audioContext.currentTime);
      gain2.gain.linearRampToValueAtTime(
        0.5,
        audioContext.currentTime + attack
      );

      osc1.connect(gain1);
      osc2.connect(gain2);

      gain1.connect(masterGainNode);
      gain2.connect(masterGainNode);

      osc1.frequency.value = frequency;
      osc2.frequency.value = frequency;

      osc1.type = waveform1;
      osc2.type = waveform2;

      osc1.start();
      osc2.start();

      noteContexts[note] = {
        gains: [gain1, gain2],
        oscillators: [osc1, osc2],
      };
    }

    function stopNote(release, note) {
      if (noteContexts[note]) {
        const { oscillators = [], gains = [] } = noteContexts[note];

        gains.forEach((g) => {
          g.gain.linearRampToValueAtTime(0, audioContext.currentTime + release);
        });

        oscillators.forEach((osc) => {
          osc.stop(audioContext.currentTime + release);
        });

        delete noteContexts[note];
      }
    }

    return { audioContext, masterGainNode, noteContexts, playNote, stopNote };
  }, []);
}

export default useSynth;
