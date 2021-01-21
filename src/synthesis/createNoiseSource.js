let noiseBuffer;

function fillBuffer(output, bufferSize) {
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
}

function createNoiseBuffer(audioContext) {
  if (noiseBuffer) return noiseBuffer;

  const bufferSize = audioContext.sampleRate;

  noiseBuffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate,
  );

  const buffer = noiseBuffer.getChannelData(0);

  fillBuffer(buffer, bufferSize);

  return noiseBuffer;
}

function createNoiseSource(audioContext) {
  const noiseSource = audioContext.createBufferSource();
  const noiseBuffer = createNoiseBuffer(audioContext);

  noiseSource.buffer = noiseBuffer;

  return noiseSource;
}

export default createNoiseSource;
