import { useState, useCallback } from "react";
function useControls({ masterGainNode }) {
  const [volume, setVolume] = useState(0.25);
  const [attack, setAttack] = useState(0.2);
  const [release, setRelease] = useState(0.2);
  const [waveform1, setWaveform1] = useState("sine");
  const [waveform2, setWaveform2] = useState("square");

  const handleVolumeChange = useCallback(
    (e) => {
      masterGainNode.gain.value = e.target.value;
      setVolume(e.target.value);
    },
    [masterGainNode]
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
    handleWaveformChange2
  };
}

export default useControls;
