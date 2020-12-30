import { useState, useCallback, useEffect } from "react";
function useControls(synth) {
  const [volume, setVolume] = useState(1);
  const [attack, setAttack] = useState(0.2);
  const [release, setRelease] = useState(0.2);
  const [waveform1, setWaveform1] = useState("sine");
  const [waveform2, setWaveform2] = useState("triangle");

  const handleVolumeChange = useCallback(
    (e) => {
      synth.masterGain.gain.value = e.target.value;
      setVolume(e.target.value);
    },
    [synth]
  );

  const handleAttackChange = useCallback(
    (e) => setAttack(Number(e.target.value)),
    []
  );

  const handleReleaseChange = useCallback(
    (e) => setRelease(Number(e.target.value)),
    []
  );

  const handleWaveformChange1 = useCallback(
    (e) => setWaveform1(e.target.value),
    []
  );

  const handleWaveformChange2 = useCallback(
    (e) => setWaveform2(e.target.value),
    []
  );

  useEffect(() => (synth.masterGain.gain.value = volume), [synth, volume]);

  return {
    volume,
    attack,
    release,
    waveform1,
    waveform2,
    handleVolumeChange,
    handleAttackChange,
    handleReleaseChange,
    handleWaveformChange1,
    handleWaveformChange2,
  };
}

export default useControls;
