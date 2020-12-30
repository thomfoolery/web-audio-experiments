import { useMemo } from "react";

function useSynth(audioContext, destination) {
  return useMemo(() => {
    const masterGain = audioContext.createGain();
    const context = {};

    masterGain.connect(destination);

    let waveform1 = "sine";
    let waveform2 = "triangle";
    let attack = 0.2;
    let release = 0.2;

    function playNote(frequency, time, hold) {
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();

      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();

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

      gain1.connect(masterGain);
      gain2.connect(masterGain);

      osc1.frequency.value = frequency;
      osc2.frequency.value = frequency;

      osc1.type = waveform1;
      osc2.type = waveform2;

      osc1.start(time);
      osc2.start(time);

      context[frequency] = {
        gains: [gain1, gain2],
        oscillators: [osc1, osc2],
      };

      if (hold) {
        stopNote(frequency, time + hold);
      }
    }

    function stopNote(frequency, time = audioContext.currentTime) {
      if (context[frequency]) {
        const { oscillators = [], gains = [] } = context[frequency];

        gains.forEach((g) => {
          g.gain.linearRampToValueAtTime(0, time + release);
        });

        oscillators.forEach((osc) => {
          osc.stop(time + release);
        });

        delete context[frequency];
      }
    }

    function setWaveform1(newWaveform1) {
      waveform1 = newWaveform1;
    }
    function setWaveform2(newWaveform2) {
      waveform2 = newWaveform2;
    }
    function setAttack(newAttack) {
      attack = newAttack;
    }
    function setRelease(newRelease) {
      release = newRelease;
    }

    return {
      audioContext,
      masterGain,
      context,
      playNote,
      stopNote,
      setWaveform1,
      setWaveform2,
      setAttack,
      setRelease,
    };
  }, [audioContext, destination]);
}

export default useSynth;
