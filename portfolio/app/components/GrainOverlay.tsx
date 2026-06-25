"use client";

import { useEffect, useRef } from "react";

export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const createNoisePattern = () => {
      const patternCanvas = document.createElement("canvas");
      patternCanvas.width = width;
      patternCanvas.height = height;
      const pCtx = patternCanvas.getContext("2d");
      if (!pCtx) return patternCanvas;

      const imgData = pCtx.createImageData(width, height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const value = Math.random() * 255;
        // Off-white: #f0ede6
        imgData.data[i] = 240;
        imgData.data[i + 1] = 237;
        imgData.data[i + 2] = 230;
        imgData.data[i + 3] = value > 128 ? value : 0; 
      }
      pCtx.putImageData(imgData, 0, 0);
      return patternCanvas;
    };

    let noiseCanvas = createNoisePattern();

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let hasCursor = false;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      hasCursor = true;
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      noiseCanvas = createNoisePattern();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d");

    let rafId: number;
    const maxOpacity = 0.06;
    const minOpacity = 0.02;
    const mobileOpacity = 0.03;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      if (!hasCursor || !offCtx) {
        ctx.globalAlpha = mobileOpacity;
        ctx.drawImage(noiseCanvas, 0, 0);
      } else {
        // Base faint grain
        ctx.globalAlpha = minOpacity;
        ctx.drawImage(noiseCanvas, 0, 0);

        offCanvas.width = width;
        offCanvas.height = height;
        
        // Draw Radial Gradient mask
        const gradient = offCtx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200);
        gradient.addColorStop(0, `rgba(0, 0, 0, ${maxOpacity - minOpacity})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        offCtx.fillStyle = gradient;
        offCtx.fillRect(mouseX - 200, mouseY - 200, 400, 400);

        // Source-in the noise
        offCtx.globalCompositeOperation = "source-in";
        offCtx.drawImage(noiseCanvas, 0, 0);

        // Draw the spotlight on main canvas
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(offCanvas, 0, 0);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 50,
      }}
      aria-hidden="true"
    />
  );
}
