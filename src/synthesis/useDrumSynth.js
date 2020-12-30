import { useMemo } from "react";

import kickDrum from "./kickDrum";
import snareDrum from "./snareDrum";
import hiHat from "./hiHat";

function useDrumSynth(audioContext, destination) {
  return useMemo(() => {
    const masterGain = audioContext.createGain();

    masterGain.connect(destination);

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
  }, [audioContext, destination]);
}

export default useDrumSynth;
