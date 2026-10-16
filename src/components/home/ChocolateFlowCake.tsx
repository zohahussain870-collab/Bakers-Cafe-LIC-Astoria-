"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

const HERO_CAKE_SRC =
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85";

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  // Flip Y to match image coordinate system
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision mediump float;

varying vec2 v_uv;

uniform sampler2D u_image;
uniform float u_time;
uniform float u_progress;
uniform vec2 u_resolution;
uniform vec2 u_image_res;

// Replicate CSS object-cover with center positioning
vec2 getCoverUV(vec2 uv) {
  float containerAspect = u_resolution.x / u_resolution.y;
  float imageAspect = u_image_res.x / u_image_res.y;
  
  float scaleX = containerAspect / imageAspect;
  float offsetX = (1.0 - scaleX) * 0.5;
  
  return vec2(offsetX + uv.x * scaleX, uv.y);
}

void main() {
  vec2 baseTexCoord = getCoverUV(v_uv);
  vec4 origColor = texture2D(u_image, baseTexCoord);

  if (u_progress <= 0.001) {
    gl_FragColor = origColor;
    return;
  }

  // 1. Precise Chocolate Mask Extraction
  // Dark chocolate has high red/blue ratio (warm brown) and dark/medium luminance
  float brightness = dot(origColor.rgb, vec3(0.299, 0.587, 0.114));
  float warmth = origColor.r - origColor.b;
  
  float isDark = 1.0 - smoothstep(0.18, 0.44, brightness);
  float isWarmBrown = smoothstep(0.015, 0.08, warmth);
  float colorMask = isDark * isWarmBrown;

  // Cake spatial envelope (confines effect strictly to cake ganache & drips)
  // Prevents any bleeding into background wall (y < 0.20) or plate/stand (y > 0.77)
  float vertMask = smoothstep(0.19, 0.26, v_uv.y) * (1.0 - smoothstep(0.70, 0.78, v_uv.y));
  float horizMask = smoothstep(0.11, 0.18, v_uv.x) * (1.0 - smoothstep(0.85, 0.92, v_uv.x));
  float envelope = vertMask * horizMask;

  float chocolateMask = envelope * smoothstep(0.18, 0.65, colorMask);

  // 2. Individual Drip Channels (located at exact cake drip coordinates)
  // Drip 1: left flank (~0.21)
  float d1 = exp(-pow((v_uv.x - 0.21) / 0.038, 2.0)) * (0.8 + 0.2 * sin(u_time * 0.9 + 1.0));
  // Drip 2: left-center (~0.26)
  float d2 = exp(-pow((v_uv.x - 0.26) / 0.032, 2.0)) * (0.8 + 0.2 * sin(u_time * 1.1 + 2.5));
  // Drip 3: center-left primary drip (~0.45)
  float d3 = exp(-pow((v_uv.x - 0.45) / 0.045, 2.0)) * (0.9 + 0.1 * sin(u_time * 0.8 + 0.4));
  // Drip 4: center-right drip (~0.51)
  float d4 = exp(-pow((v_uv.x - 0.51) / 0.040, 2.0)) * (0.85 + 0.15 * sin(u_time * 1.0 + 3.8));
  // Drip 5: right-center drip (~0.61)
  float d5 = exp(-pow((v_uv.x - 0.61) / 0.042, 2.0)) * (0.85 + 0.15 * sin(u_time * 1.2 + 5.1));
  // Drip 6: right flank drip (~0.66)
  float d6 = exp(-pow((v_uv.x - 0.66) / 0.035, 2.0)) * (0.8 + 0.2 * sin(u_time * 0.95 + 1.7));
  // Drip 7: far right drip (~0.85)
  float d7 = exp(-pow((v_uv.x - 0.85) / 0.040, 2.0)) * (0.8 + 0.2 * sin(u_time * 1.05 + 4.2));

  float allDrips = max(max(max(d1, d2), max(d3, d4)), max(max(d5, d6), d7));

  // 3. Fluid Physics & Gravitational Elongation
  // Drips stretch downward under gravity
  float dripStretchZone = smoothstep(0.24, 0.48, v_uv.y) * (1.0 - smoothstep(0.68, 0.77, v_uv.y));
  float dripDisplacementY = allDrips * dripStretchZone * (0.015 + 0.007 * sin(u_time * 1.1 + v_uv.x * 12.0));

  // Top surface ganache subtle viscous ripple
  float topSurfaceMask = smoothstep(0.18, 0.24, v_uv.y) * (1.0 - smoothstep(0.30, 0.36, v_uv.y)) * horizMask;
  float topRippleY = (sin(v_uv.x * 24.0 + u_time * 1.3) * 0.003 + sin(v_uv.y * 28.0 - u_time * 1.0) * 0.002);
  float topRippleX = cos(v_uv.y * 22.0 + u_time * 1.1) * 0.0025;

  // Surface tension rounding at drip tips
  float dripCurveX = sin(v_uv.y * 36.0 + u_time * 1.4) * 0.002 * allDrips;

  // Combined UV displacement vector
  vec2 totalDisplacement = vec2(
    (topRippleX * topSurfaceMask + dripCurveX) * chocolateMask,
    -(dripDisplacementY + topRippleY * topSurfaceMask) * chocolateMask
  ) * u_progress;

  // Sample displaced texture
  vec2 displacedTexCoord = getCoverUV(v_uv + totalDisplacement);
  vec4 displacedColor = texture2D(u_image, displacedTexCoord);

  // 4. Photorealistic Liquid Chocolate Highlights & Specular Sheen
  // Light sweep across viscous chocolate curvature
  float lightSweep = sin(v_uv.x * 11.0 - v_uv.y * 7.0 + u_time * 1.4);
  float specularGlaze = pow(max(0.0, lightSweep), 8.0) * 0.10 * chocolateMask;

  // Specular sheen along drip ridges
  float dripSheen = allDrips * pow(max(0.0, sin(v_uv.y * 16.0 - u_time * 2.0 + v_uv.x * 4.0)), 6.0) * 0.12 * chocolateMask;

  // Rich warm caramel-gold highlight tint (#F5D5B0)
  vec3 warmHighlight = vec3(1.0, 0.88, 0.74) * (specularGlaze + dripSheen) * u_progress;

  displacedColor.rgb += warmHighlight;

  gl_FragColor = displacedColor;
}
`;

export function ChocolateFlowCake() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isShaderReady, setIsShaderReady] = useState(false);

  // Animation state refs (avoid React re-render cycle during 60fps raf)
  const animStateRef = useRef({
    progress: 0,
    targetProgress: 0,
    time: 0,
    lastTimestamp: 0,
    rafId: 0,
    isRunning: false,
    gl: null as WebGLRenderingContext | null,
    program: null as WebGLProgram | null,
    uTimeLoc: null as WebGLUniformLocation | null,
    uProgressLoc: null as WebGLUniformLocation | null,
    uResolutionLoc: null as WebGLUniformLocation | null,
    uImageResLoc: null as WebGLUniformLocation | null,
    texture: null as WebGLTexture | null,
    imageWidth: 1000,
    imageHeight: 735,
    reducedMotion: false,
  });

  // Render a single WebGL frame
  const renderFrame = useCallback(() => {
    const s = animStateRef.current;
    const gl = s.gl;
    const canvas = canvasRef.current;
    if (!gl || !s.program || !canvas) return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(s.program);

    if (s.uTimeLoc) gl.uniform1f(s.uTimeLoc, s.time);
    if (s.uProgressLoc) gl.uniform1f(s.uProgressLoc, s.progress);
    if (s.uResolutionLoc) gl.uniform2f(s.uResolutionLoc, canvas.width, canvas.height);
    if (s.uImageResLoc) gl.uniform2f(s.uImageResLoc, s.imageWidth, s.imageHeight);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, []);

  const tickRef = useRef<((timestamp: number) => void) | null>(null);

  // Main 60fps animation loop
  const tick = useCallback(
    (timestamp: number) => {
      const s = animStateRef.current;

      if (!s.lastTimestamp) s.lastTimestamp = timestamp;
      const delta = Math.min((timestamp - s.lastTimestamp) / 1000, 0.1);
      s.lastTimestamp = timestamp;

      // Advance fluid time while active or decaying
      if (s.progress > 0.001 || s.targetProgress > 0.001) {
        s.time += delta;
      }

      // Smooth exponential damping (buttery easing for activation & return)
      const lerpSpeed = s.targetProgress > s.progress ? 5.5 : 4.0;
      s.progress += (s.targetProgress - s.progress) * (1.0 - Math.exp(-lerpSpeed * delta));

      // Threshold check for resting state (Phase D completion)
      if (s.targetProgress === 0 && s.progress < 0.001) {
        s.progress = 0;
        renderFrame();
        s.isRunning = false;
        return;
      }

      renderFrame();
      if (tickRef.current) {
        s.rafId = requestAnimationFrame(tickRef.current);
      }
    },
    [renderFrame]
  );

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  // Trigger animation loop on state change
  const startAnimation = useCallback(() => {
    const s = animStateRef.current;
    if (s.reducedMotion) return;

    if (!s.isRunning && tickRef.current) {
      s.isRunning = true;
      s.lastTimestamp = 0;
      s.rafId = requestAnimationFrame(tickRef.current);
    }
  }, []);

  // Pointer event handlers
  const handlePointerEnter = () => {
    setIsHovered(true);
    animStateRef.current.targetProgress = 1.0;
    startAnimation();
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    animStateRef.current.targetProgress = 0.0;
    startAnimation();
  };

  // Initialize WebGL context and texture on client mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only initialize WebGL on devices with hover/pointer capability (saves ~400ms CPU and 98KB on mobile)
    const hasHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hasHover) {
      return;
    }

    const animState = animStateRef.current;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    animState.reducedMotion = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      animStateRef.current.reducedMotion = e.matches;
      if (e.matches) {
        animStateRef.current.targetProgress = 0;
        animStateRef.current.progress = 0;
        renderFrame();
      }
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Initialize WebGL
    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("[ChocolateFlowCake] WebGL not supported. Gracefully falling back to static photo.");
      return;
    }
    animStateRef.current.gl = gl;

    // Compile shaders helper
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("[ChocolateFlowCake] Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[ChocolateFlowCake] Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    animStateRef.current.program = program;
    animStateRef.current.uTimeLoc = gl.getUniformLocation(program, "u_time");
    animStateRef.current.uProgressLoc = gl.getUniformLocation(program, "u_progress");
    animStateRef.current.uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
    animStateRef.current.uImageResLoc = gl.getUniformLocation(program, "u_image_res");

    // Full screen quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPositionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    // Load original image as WebGL texture
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    let triedLocalFallback = false;
    img.onerror = () => {
      if (!triedLocalFallback) {
        triedLocalFallback = true;
        img.src = "/hero-cake-sample.jpg";
      }
    };
    img.src = HERO_CAKE_SRC;

    img.onload = () => {
      animStateRef.current.imageWidth = img.naturalWidth || 1000;
      animStateRef.current.imageHeight = img.naturalHeight || 735;

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      animStateRef.current.texture = texture;

      setIsShaderReady(true);
      renderFrame();
    };

    // Resize observer to keep canvas resolution crisp on high-DPI screens
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
          renderFrame();
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Pause rendering on tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden && animStateRef.current.isRunning) {
        cancelAnimationFrame(animStateRef.current.rafId);
        animStateRef.current.isRunning = false;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup resources
    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resizeObserver.disconnect();
      cancelAnimationFrame(animState.rafId);

      if (gl) {
        if (animState.texture) gl.deleteTexture(animState.texture);
        if (program) gl.deleteProgram(program);
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
      }
    };
  }, [renderFrame]);

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#F4ECE1] group select-none transition-shadow duration-500 hover:shadow-[0_25px_60px_-15px_rgba(33,21,16,0.35)] cursor-pointer"
      title="Hover to see fresh Belgian chocolate flow"
    >
      {/* 1. Underlying Ground-Truth Static Photo */}
      <Image
        src={HERO_CAKE_SRC}
        alt="Artisan Belgian chocolate cake layered with rich ganache"
        fill
        priority
        fetchPriority="high"
        quality={75}
        sizes="(max-width: 640px) 384px, (max-width: 1024px) 448px, 500px"
        className="object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
      />

      {/* 2. Hardware-Accelerated Chocolate Flow Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${
          isShaderReady ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 3. Original Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* 4. Original Hero Caption Card */}
      <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
        <span className="text-[11px] font-bold tracking-widest uppercase text-[#F5D5B0]">
          Signature Cake
        </span>
        <h2 className="font-serif text-xl font-bold mt-0.5">
          Belgian Dark Chocolate Fudge
        </h2>
        <p className="text-xs text-white/90 mt-1">
          Layers of dark cocoa sponge with 54% Callebaut ganache
        </p>
      </div>

      {/* 5. Subtle Interactive Hint on Desktop */}
      <div
        className={`absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-medium text-amber-200 border border-white/10 transition-opacity duration-300 pointer-events-none hidden sm:flex items-center gap-1.5 ${
          isHovered ? "opacity-0" : "opacity-80"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        <span>Hover for fresh ganache flow</span>
      </div>
    </div>
  );
}
