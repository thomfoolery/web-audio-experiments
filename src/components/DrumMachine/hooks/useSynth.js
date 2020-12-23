import { useMemo } from "react";

import kickDrum from "../../../synthesis/kickDrum";
import snareDrum from "../../../synthesis/snareDrum";
import hiHat from "../../../synthesis/hiHat";

function useSynth() {
  return useMemo(() => {
    const audioContext = new AudioContext();
    const masterGain = audioContext.createGain();

    masterGain.connect(audioContext.destination);

    function playKick(time) {
      kickDrum({ audioContext, masterGain }, time);
    }

    function playSnare(time) {
      snareDrum({ audioContext, masterGain }, time);
    }

    function playHiHat(time) {
      hiHat({ audioContext, masterGain }, time);
    }

    return { audioContext, masterGain, playKick, playSnare, playHiHat };
  }, []);
}

export default useSynth;
