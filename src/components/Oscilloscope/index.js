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
  analyser.getByteTimeDomainData(bufferArray);

  ctx.fillStyle = "rgb(42,42,42)";
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgb(0, 255, 0)";
  ctx.beginPath();

  const sliceWidth = (width * 1.0) / bufferLength;
  let x = 0;

  bufferArray.forEach((data, index) => {
    var v = data / 128.0;
    var y = (v * height) / 2;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  });

  ctx.lineTo(width, height / 2);
  ctx.stroke();

  if (canvasRef.current) {
    requestAnimationFrame(() =>
      draw(canvasRef, ctx, analyser, width, height, bufferArray, bufferLength)
    );
  }
}

function Oscilloscope({ analyser, width, height }) {
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
    <div className={styles.Oscilloscope}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        title="Oscilloscope"
      />
    </div>
  );
}

export default memo(Oscilloscope);
