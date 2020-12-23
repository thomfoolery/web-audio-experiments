let noiseBuffer;

function createNoiseBuffer(audioContext) {
  if (noiseBuffer) return noiseBuffer;

  const bufferSize = audioContext.sampleRate;

  noiseBuffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate
  );

  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  return noiseBuffer;
}

function snareDrum(synth, time) {
  const { audioContext, masterGain } = synth;
  const noiseSource = audioContext.createBufferSource();
  const noiseFilter = audioContext.createBiquadFilter();
  const noiseBuffer = createNoiseBuffer(audioContext);
  const noiseEnvelope = audioContext.createGain();
  const oscEnvelope = audioContext.createGain();
  const osc = audioContext.createOscillator();

  const noiseRelease = 0.2;
  const oscRelease = 0.1;

  noiseSource.buffer = noiseBuffer;
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 1000;

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseEnvelope);
  noiseEnvelope.connect(masterGain);

  noiseEnvelope.gain.value = 1;
  noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + noiseRelease);

  osc.type = "triangle";
  osc.connect(oscEnvelope);
  oscEnvelope.connect(masterGain);

  osc.frequency.value = 100;
  oscEnvelope.gain.value = 0.7;
  oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + oscRelease);

  osc.start(time);
  noiseSource.start(time);

  osc.stop(time + noiseRelease);
  noiseSource.stop(time + noiseRelease);
}

export default snareDrum;
