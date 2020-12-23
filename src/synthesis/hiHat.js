function hiHat(synth, time) {
  const { audioContext, masterGain } = synth;

  const baseFrequency = 40;
  const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];

  const gain = audioContext.createGain();

  // Bandpass
  const bandpass = audioContext.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 10000;

  // Highpass
  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 7000;

  // Connect the graph
  bandpass.connect(highpass);
  highpass.connect(gain);
  gain.connect(masterGain);

  // Create the oscillators
  ratios.forEach(function (ratio) {
    const osc = audioContext.createOscillator();

    osc.type = "square";
    osc.frequency.value = baseFrequency * ratio;
    osc.connect(bandpass);
    osc.start(time);
    osc.stop(time + 0.3);
  });

  // Define the volume envelope
  gain.gain.setValueAtTime(0.00001, time);
  gain.gain.exponentialRampToValueAtTime(1, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.3, time + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.00001, time + 0.3);
}

export default hiHat;
