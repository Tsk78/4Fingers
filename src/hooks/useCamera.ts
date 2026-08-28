import { useCallback, useEffect, useRef, useState } from 'react';

// Camera permission state machine (design.md §5.1, §9).
//   idle -> requesting -> granted -> active
//   idle -> requesting -> denied | unsupported  (=> fallback to demo buttons)
export type CameraState =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unsupported';

interface UseCameraResult {
  state: CameraState;
  videoRef: React.RefObject<HTMLVideoElement>;
  requestCamera: () => Promise<void>;
  stopCamera: () => void;
  /** Grabs the current video frame as a data URL (kept in caller-local state only). */
  captureFrame: () => string | null;
  /** True when denial/unsupported means the demo-button fallback should show. */
  isFallback: boolean;
}

// Modest resolution keeps camera start-up fast (design.md §8) — never request 4K.
const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: { facingMode: 'environment', width: { ideal: 720 } },
  audio: false,
};

export function useCamera(): UseCameraResult {
  const [state, setState] = useState<CameraState>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Held in state so an effect can attach it once the <video> is mounted.
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
  }, []);

  const requestCamera = useCallback(async () => {
    // Unsupported: no mediaDevices (old browser) or insecure context (non-HTTPS).
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      setState('unsupported');
      return;
    }

    setState('requesting');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS);
      streamRef.current = mediaStream;
      // Flip to 'granted' first so CameraHUD mounts the <video>, THEN attach
      // the stream via the effect below (the element doesn't exist until now).
      setStream(mediaStream);
      setState('granted');
    } catch {
      // NotAllowedError, NotFoundError, insecure context, etc. — treat uniformly
      // as fallback-to-demo (design.md §9), no per-case error UI.
      setState('denied');
    }
  }, []);

  // Attach the stream to the <video> once BOTH exist (element is mounted after
  // state flips to 'granted'). This fixes the attach-before-mount race.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;
    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }
    const tryPlay = () => void video.play().catch(() => undefined);
    tryPlay();
    // Retry once metadata is ready, covering the autoplay/attach race.
    video.addEventListener('loadedmetadata', tryPlay);
    return () => video.removeEventListener('loadedmetadata', tryPlay);
  }, [stream, state]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Returned to caller for a transient preview only — NEVER persisted (Req 4.6).
    return canvas.toDataURL('image/jpeg', 0.7);
  }, []);

  // Release the camera when the acquired stream is replaced or on true unmount.
  // Tying teardown to the specific `stream` avoids React StrictMode's dev-only
  // double-invoke stopping the live stream right after we acquire it.
  useEffect(() => {
    if (!stream) return;
    return () => {
      stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  return {
    state,
    videoRef,
    requestCamera,
    stopCamera,
    captureFrame,
    isFallback: state === 'denied' || state === 'unsupported',
  };
}
