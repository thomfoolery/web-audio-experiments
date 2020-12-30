import React, { memo, useRef, useEffect } from "react";

import styles from "./styles.module.css";

function draw(
  canvasRef,
  ctx,
  analyser,
  width,
  height,
  bufferArray,
  bufferLength
) {
  analyser.getByteFrequencyData(bufferArray);

  ctx.fillStyle = "rgba(42,42,42,0.25)";
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.beginPath();

  const barWidth = (width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  bufferArray.forEach((data) => {
    barHeight = data / 2;

    ctx.fillStyle = "rgb(0,255,0)";
    ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight);

    x += barWidth + 1;
  });

  if (canvasRef.current) {
    requestAnimationFrame(() =>
      draw(canvasRef, ctx, analyser, width, height, bufferArray, bufferLength)
    );
  }
}

function FrequencyAnalyzer({ analyser, width, height }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      const bufferLength = analyser.frequencyBinCount;
      const bufferArray = new Uint8Array(bufferLength);
      const ctx = canvasRef.current.getContext("2d");
      const { width, height } = canvasRef.current;

      requestAnimationFrame(() =>
        draw(canvasRef, ctx, analyser, width, height, bufferArray, bufferLength)
      );
    }

    return () => (canvasRef.current = null);
  }, [analyser]);

  return (
    <div className={styles.FrequencyAnalyzer}>
      <canvas
        width={width}
        height={height}
        ref={canvasRef}
        title="Frequency Analyzer"
      />
    </div>
  );
}

export default memo(FrequencyAnalyzer);
