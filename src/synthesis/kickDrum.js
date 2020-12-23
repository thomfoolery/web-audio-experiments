function kickDrum(synth, time) {
  const { audioContext, masterGain } = synth;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  const frequency = 150;
  const release = 0.5;

  osc.connect(gain);
  gain.connect(masterGain);

  osc.frequency.value = frequency;
  gain.gain.value = 1;

  osc.frequency.exponentialRampToValueAtTime(0.01, time + release);
  gain.gain.exponentialRampToValueAtTime(0.01, time + release);

  osc.start(time);
  osc.stop(time + release);
}

export default kickDrum;
