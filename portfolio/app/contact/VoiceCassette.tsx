"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CassetteMode = "idle" | "recording" | "playing" | "error";

type SpeechRecognitionType = new () => SpeechRecognitionInstance;

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const MAX_SECONDS = 60;
const WAVE_BARS = 12;

const baseWaveBars = Array.from({ length: WAVE_BARS }, () => 6);

const indiaLanguages = [
  { value: "hi-IN", label: "Hindi (हिन्दी)", code: "HI" },
  { value: "hi-IN", label: "Hinglish (हिन्दी + EN)", code: "HI" },
  { value: "bn-IN", label: "Bengali (বাংলা)", code: "BN" },
  { value: "te-IN", label: "Telugu (తెలుగు)", code: "TE" },
  { value: "mr-IN", label: "Marathi (मराठी)", code: "MR" },
  { value: "ta-IN", label: "Tamil (தமிழ்)", code: "TA" },
  { value: "gu-IN", label: "Gujarati (ગુજરાતી)", code: "GU" },
  { value: "kn-IN", label: "Kannada (ಕನ್ನಡ)", code: "KN" },
  { value: "ml-IN", label: "Malayalam (മലയാളം)", code: "ML" },
  { value: "pa-IN", label: "Punjabi (ਪੰਜਾਬੀ)", code: "PA" },
  { value: "or-IN", label: "Odia (ଓଡ଼ିଆ)", code: "OR" },
  { value: "as-IN", label: "Assamese (অসমীয়া)", code: "AS" },
  { value: "ur-IN", label: "Urdu (اردو)", code: "UR" },
];

const internationalLanguages = [
  { value: "en-US", label: "English (US)", code: "EN" },
  { value: "en-IN", label: "English (India)", code: "EN" },
  { value: "en-GB", label: "English (UK)", code: "EN" },
  { value: "es-ES", label: "Spanish", code: "ES" },
  { value: "fr-FR", label: "French", code: "FR" },
  { value: "de-DE", label: "German", code: "DE" },
  { value: "ja-JP", label: "Japanese", code: "JA" },
  { value: "ko-KR", label: "Korean", code: "KO" },
  { value: "zh-CN", label: "Chinese", code: "ZH" },
  { value: "ar-SA", label: "Arabic", code: "AR" },
  { value: "pt-BR", label: "Portuguese", code: "PT" },
  { value: "ru-RU", label: "Russian", code: "RU" },
  { value: "it-IT", label: "Italian", code: "IT" },
];

const languageNameByCode: Record<string, string> = {
  HI: "Hindi",
  BN: "Bengali",
  TE: "Telugu",
  MR: "Marathi",
  TA: "Tamil",
  GU: "Gujarati",
  KN: "Kannada",
  ML: "Malayalam",
  PA: "Punjabi",
  OR: "Odia",
  AS: "Assamese",
  UR: "Urdu",
  EN: "English",
  ES: "Spanish",
  FR: "French",
  DE: "German",
  JA: "Japanese",
  KO: "Korean",
  ZH: "Chinese",
  AR: "Arabic",
  PT: "Portuguese",
  RU: "Russian",
  IT: "Italian",
};

const supportedLanguages = [...indiaLanguages, ...internationalLanguages];

function getLanguageCode(value: string) {
  if (value === "auto") return "HI";
  const found = supportedLanguages.find((lang) => lang.value === value);
  return found?.code || value.split("-")[0].toUpperCase();
}

function resolveAutoLanguage(locale: string) {
  const normalized = locale.toLowerCase();
  const exact = supportedLanguages.find((lang) => lang.value.toLowerCase() === normalized);
  if (exact) return exact.value;
  const base = normalized.split("-")[0];
  const map: Record<string, string> = {
    hi: "hi-IN",
    bn: "bn-IN",
    te: "te-IN",
    mr: "mr-IN",
    ta: "ta-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    pa: "pa-IN",
    or: "or-IN",
    as: "as-IN",
    ur: "ur-IN",
    en: "en-IN",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    ja: "ja-JP",
    ko: "ko-KR",
    zh: "zh-CN",
    ar: "ar-SA",
    pt: "pt-BR",
    ru: "ru-RU",
    it: "it-IT",
  };
  return map[base] || "hi-IN";
}

const hinglishCorrections: Record<string, string> = {
  mujhe: "mujhe",
  aapko: "aapko",
  chahiye: "chahiye",
  karna: "karna",
  banana: "banana",
  kaam: "kaam",
  theek: "theek",
  achha: "achha",
  bahut: "bahut",
  matlab: "matlab",
  "matlab hai": "matlab hai",
  nahi: "nahi",
  haan: "haan",
  yaar: "yaar",
  bhai: "bhai",
  kal: "kal",
  abhi: "abhi",
  thoda: "thoda",
  zyada: "zyada",
  accha: "accha",
  suno: "suno",
  dekho: "dekho",
  bolna: "bolna",
  project: "project",
  website: "website",
  app: "app",
  build: "build",
  kab: "kab",
  kitna: "kitna",
  paisa: "paisa",
  budget: "budget",
};

function applyHinglishCorrections(text: string) {
  let result = text;
  Object.entries(hinglishCorrections).forEach(([key, value]) => {
    const pattern = new RegExp(key, "gi");
    result = result.replace(pattern, value);
  });
  return result;
}

function formatCounter(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getSpeechRecognition(): SpeechRecognitionType | null {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

function buildReelSvg() {
  const spokes = Array.from({ length: 6 }, (_, i) => i * 60);
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-[72px] w-[72px]"
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="var(--cassette-reel)"
        stroke="var(--cassette-reel-line)"
        strokeWidth="4"
      />
      <circle cx="50" cy="50" r="12" fill="var(--cassette-reel-line)" />
      {spokes.map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="18"
          x2="50"
          y2="38"
          stroke="var(--cassette-reel-line)"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
    </svg>
  );
}

type VoiceCassetteProps = {
  transcription: string;
  onTranscriptionChange: (value: string) => void;
  onTranslationChange?: (payload: { english: string; detectedLang: string }) => void;
};

export default function VoiceCassette({
  transcription,
  onTranscriptionChange,
  onTranslationChange,
}: VoiceCassetteProps) {
  const [mode, setMode] = useState<CassetteMode>("idle");
  const [counter, setCounter] = useState(0);
  const [waveBars, setWaveBars] = useState<number[]>(baseWaveBars);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);
  const [autoLang, setAutoLang] = useState("hi-IN");
  const [manualLang, setManualLang] = useState("hi-IN");
  const [detectedLangCode, setDetectedLangCode] = useState("");
  const [detectingLang, setDetectingLang] = useState(false);
  const [stopFlash, setStopFlash] = useState(false);
  const [englishDraft, setEnglishDraft] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const counterIntervalRef = useRef<number | null>(null);
  const autoStopTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalTranscriptRef = useRef("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptionRef = useRef(transcription);
  const currentLanguage = autoDetect ? autoLang : manualLang;

  useEffect(() => {
    transcriptionRef.current = transcription;
  }, [transcription]);

  useEffect(() => {
    if (!transcription.trim()) {
      setEnglishDraft("");
      setTranslateError("");
      setDetectedLangCode("");
    }
  }, [transcription]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const locale = navigator.language || "hi-IN";
    const resolved = resolveAutoLanguage(locale);
    setAutoLang(resolved);
  }, []);

  const hasRecording = Boolean(audioUrl);

  const leftScale = useMemo(() => {
    const ratio = Math.min(counter / MAX_SECONDS, 1);
    return 1 - ratio * 0.15;
  }, [counter]);

  const rightScale = useMemo(() => {
    const ratio = Math.min(counter / MAX_SECONDS, 1);
    return 1 + ratio * 0.15;
  }, [counter]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.onended = () => setMode("idle");
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startCounter = () => {
    if (counterIntervalRef.current) return;
    counterIntervalRef.current = window.setInterval(() => {
      setCounter((prev) => {
        if (prev >= MAX_SECONDS) return prev;
        return prev + 1;
      });
    }, 1000);
  };

  const stopCounter = () => {
    if (counterIntervalRef.current) {
      window.clearInterval(counterIntervalRef.current);
      counterIntervalRef.current = null;
    }
  };

  const startWaveform = (stream: MediaStream) => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const audioContext = new AudioCtx();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      const nextBars = Array.from({ length: WAVE_BARS }, (_, i) => {
        const segment = Math.floor(bufferLength / WAVE_BARS);
        const start = i * segment;
        const end = start + segment;
        let sum = 0;
        for (let j = start; j < end; j += 1) {
          sum += dataArray[j] ?? 0;
        }
        const avg = sum / segment;
        const height = Math.max(4, Math.min(18, Math.round((avg / 255) * 18)));
        return height;
      });
      setWaveBars(nextBars);
      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    audioContext.resume().catch(() => undefined);
    tick();
  };

  const stopWaveform = () => {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  const startSpeechRecognition = () => {
    const Recognition = getSpeechRecognition();
    if (!Recognition) return;
    const recognition = new Recognition() as SpeechRecognitionInstance;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentLanguage;
    recognition.onresult = (event) => {
      let interim = "";
      let hadFinal = false;
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += `${finalTranscriptRef.current ? " " : ""}${transcript}`;
          hadFinal = true;
        } else {
          interim += transcript;
        }
      }
      const combined = `${finalTranscriptRef.current} ${interim}`.trim();
      const corrected =
        currentLanguage.startsWith("hi") ? applyHinglishCorrections(combined) : combined;
      onTranscriptionChange(corrected);

      if (hadFinal) {
        setDetectingLang(false);
        const sourceLang = autoDetect ? "auto" : currentLanguage;
        const finalText = currentLanguage.startsWith("hi")
          ? applyHinglishCorrections(finalTranscriptRef.current.trim())
          : finalTranscriptRef.current.trim();
        translateToEnglish(finalText, sourceLang);
      }
    };
    recognition.onerror = () => {
      // Allow recording to continue even if speech recognition fails.
    };
    recognition.onend = () => {
      // Keep final transcript.
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // noop
      }
      recognitionRef.current = null;
    }
  };

  const translateToEnglish = async (text: string, sourceLang: string) => {
    const cleaned = text.trim();
    if (!cleaned) {
      setEnglishDraft("");
      setDetectedLangCode("");
      onTranslationChange?.({ english: "", detectedLang: "" });
      return;
    }

    if (sourceLang.startsWith("en")) {
      setEnglishDraft(cleaned);
      setDetectedLangCode("EN");
      onTranslationChange?.({ english: cleaned, detectedLang: "EN" });
      return;
    }

    setIsTranslating(true);
    setTranslateError("");
    try {
      const response = await fetch("/api/contact/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleaned, sourceLang }),
      });
      if (!response.ok) {
        throw new Error("translate failed");
      }
      const data = (await response.json()) as { english?: string; detectedLang?: string };
      const english = data.english || cleaned;
      const detected = (data.detectedLang || "").toUpperCase();
      setEnglishDraft(english);
      setDetectedLangCode(detected || getLanguageCode(sourceLang));
      onTranslationChange?.({ english, detectedLang: detected || getLanguageCode(sourceLang) });
    } catch (error) {
      setTranslateError("couldn't translate — you can edit manually");
      const fallbackCode = getLanguageCode(sourceLang);
      setEnglishDraft(cleaned);
      setDetectedLangCode(fallbackCode);
      onTranslationChange?.({ english: cleaned, detectedLang: fallbackCode });
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (mode === "recording") return;
    if (!hasRecording) return;
    if (!transcriptionRef.current.trim()) return;
    const id = window.setTimeout(() => {
      const sourceLang = autoDetect ? "auto" : currentLanguage;
      translateToEnglish(transcriptionRef.current, sourceLang);
    }, 400);
    return () => window.clearTimeout(id);
  }, [mode, hasRecording, transcription, autoDetect, currentLanguage]);

  useEffect(() => {
    if (autoDetect) return;
    if (mode === "recording") return;
    setDetectedLangCode(getLanguageCode(manualLang));
  }, [autoDetect, manualLang, mode]);

  useEffect(() => {
    if (mode !== "recording") return;
    stopSpeechRecognition();
    startSpeechRecognition();
  }, [mode, currentLanguage, autoDetect]);

  const handleStartRecording = async () => {
    setErrorMessage("");
    setPermissionDenied(false);
    setDetectingLang(true);
    setDetectedLangCode("");
    setEnglishDraft("");
    setTranslateError("");
    setShowOriginal(false);

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMode("error");
      setErrorMessage("Recording not supported on this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        if (!chunksRef.current.length) return;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        chunksRef.current = [];
      };

      finalTranscriptRef.current = "";
      onTranscriptionChange("");
      setCounter(0);
      setWaveBars(baseWaveBars);
      setMode("recording");
      recorder.start();
      mediaRecorderRef.current = recorder;

      startCounter();
      startWaveform(stream);
      startSpeechRecognition();

      autoStopTimeoutRef.current = window.setTimeout(() => {
        handleStopRecording();
      }, MAX_SECONDS * 1000);
    } catch (err) {
      setPermissionDenied(true);
      setMode("error");
      setErrorMessage("microphone access needed");
    }
  };

  const handleStopRecording = () => {
    if (mode !== "recording") return;
    stopRecording();
  };

  const stopRecording = () => {
    stopCounter();
    stopWaveform();
    stopSpeechRecognition();
    setWaveBars(baseWaveBars);
    setDetectingLang(false);

    if (autoStopTimeoutRef.current) {
      window.clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setMode("idle");
  };

  const handleRecordToggle = () => {
    if (mode === "recording") {
      stopRecording();
      return;
    }
    if (mode === "playing") {
      handleStopPlayback();
    }
    handleStartRecording();
  };

  const handleStopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setMode("idle");
  };

  const handlePlay = () => {
    if (!audioUrl) return;
    if (mode === "recording") {
      handleStopRecording();
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    }
    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(() => undefined);
    setMode("playing");
  };

  const handleStop = () => {
    if (mode === "recording") {
      stopRecording();
      setStopFlash(true);
      window.setTimeout(() => setStopFlash(false), 120);
      return;
    }
    if (mode === "playing") {
      handleStopPlayback();
      setStopFlash(true);
      window.setTimeout(() => setStopFlash(false), 120);
    }
  };

  const handleRetake = () => {
    if (mode === "recording") stopRecording();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    onTranscriptionChange("");
    setEnglishDraft("");
    setTranslateError("");
    setDetectedLangCode("");
    setShowOriginal(false);
    setCounter(0);
    setWaveBars(baseWaveBars);
    setMode("idle");
  };

  const indicator = (() => {
    if (mode === "recording") {
      return { text: "● REC", className: "text-[var(--record)] cassette__indicator-pulse" };
    }
    if (mode === "playing") {
      return { text: "● PLAY", className: "text-[var(--success)]" };
    }
    return { text: "○ READY", className: "text-[var(--muted-tertiary)]" };
  })();

  const tapeLangLabel = detectingLang
    ? "DETECTING..."
    : `${detectedLangCode || getLanguageCode(currentLanguage)} → EN`;

  const originalLangName =
    languageNameByCode[detectedLangCode || getLanguageCode(currentLanguage)] || "DETECTED";

  const showComposer = permissionDenied || hasRecording || Boolean(errorMessage);

  return (
    <div className="w-full max-w-[420px]">
      <div className="relative rounded-[16px] border-2 border-[var(--form-border)] bg-[var(--form-card-bg)] px-6 py-7 shadow-[var(--elevated-shadow)]">
        <div className="absolute right-5 top-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em]">
          <span className={indicator.className}>{indicator.text}</span>
        </div>

        <div className="flex items-center justify-between rounded-md bg-[var(--form-bg)] px-3 py-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--accent)]">UTSAV.DEV</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--fg)]">◈ VOICE MESSAGE ◈</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--muted-tertiary)]">C-60</span>
        </div>

        <div className="relative mx-2 mt-4 rounded-[8px] border border-[var(--form-border)] bg-[var(--form-bg)] px-4 py-4">
          <div className="absolute right-3 top-3 font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--accent)]">
            {tapeLangLabel}
          </div>
          <div className="absolute left-1/2 top-3 flex -translate-x-1/2 items-end gap-[4px]">
            {waveBars.map((height, index) => (
              <div
                key={index}
                className="w-[4px] rounded-sm bg-[var(--form-border)] transition-[height] duration-150"
                style={{ height }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between px-3 pb-4 pt-6">
            <div className="flex w-1/2 justify-center">
              <div
                className="flex items-center justify-center"
                style={{ transform: `scale(${leftScale})` }}
              >
                <div className={mode === "recording" ? "cassette__reel-spin" : ""}>{buildReelSvg()}</div>
              </div>
            </div>
            <div className="flex w-1/2 justify-center">
              <div
                className="flex items-center justify-center"
                style={{ transform: `scale(${rightScale})` }}
              >
                <div className={mode === "recording" ? "cassette__reel-spin" : ""}>{buildReelSvg()}</div>
              </div>
            </div>
          </div>

          <svg
            viewBox="0 0 200 20"
            className="absolute bottom-3 left-1/2 w-[70%] -translate-x-1/2"
            aria-hidden="true"
          >
            <path
              d="M 0 10 C 50 18, 150 18, 200 10"
              stroke="var(--cassette-reel)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="mt-3 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setAutoDetect((prev) => {
                const next = !prev;
                if (next) {
                  setDetectedLangCode("");
                }
                return next;
              })
            }
            className={`h-[28px] rounded-full border px-[10px] py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
              autoDetect
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--form-border)] text-[var(--muted-tertiary)]"
            }`}
          >
            ◉ AUTO DETECT
          </button>
          {autoDetect && (
            <p className="text-center font-mono text-[9px] italic text-[var(--muted-tertiary)]">
              speak in any language — i&apos;ll understand
            </p>
          )}
        </div>

        {!autoDetect && (
          <div className="mt-3">
            <div className="relative">
              <select
                value={manualLang}
                onChange={(event) => setManualLang(event.target.value)}
                className="h-[36px] w-full appearance-none rounded-[4px] border border-[var(--form-border)] bg-[var(--form-bg)] px-3 pr-10 font-mono text-[12px] text-[var(--fg)] outline-none transition-colors focus:border-[var(--accent)]"
              >
                <optgroup label="── INDIA ──">
                  {indiaLanguages.map((lang) => (
                    <option key={`${lang.value}-${lang.label}`} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="── INTERNATIONAL ──">
                  {internationalLanguages.map((lang) => (
                    <option key={`${lang.value}-${lang.label}`} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </optgroup>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-[var(--accent)]">
                ▾
              </span>
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--muted-tertiary)]">COUNTER</p>
          <div className="mt-2 flex items-center justify-center rounded-md border border-[var(--meter-border)] bg-[var(--meter-bg)] py-2 font-mono text-[18px] tracking-[0.16em] text-[var(--meter-fg)]">
            {formatCounter(counter)}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            className="flex h-12 w-9 flex-col items-center justify-center gap-1 rounded-sm border border-[var(--control-border)] bg-[var(--control-bg)] font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--fg)] shadow-[0_3px_0_var(--control-shadow)] opacity-35"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className="text-base">⏮</span>
            <span>REWIND</span>
          </button>
          <button
            type="button"
            onClick={handlePlay}
            className={`flex h-12 w-9 flex-col items-center justify-center gap-1 rounded-sm border border-[var(--control-border)] bg-[var(--control-bg)] font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--fg)] shadow-[0_3px_0_var(--control-shadow)] ${
              mode === "playing" ? "border-[var(--success)] bg-[var(--success-bg)] text-[var(--success)]" : ""
            }`}
          >
            <span className="text-base">▶</span>
            <span>PLAY</span>
          </button>
          <button
            type="button"
            onClick={handleRecordToggle}
            className={`flex h-12 w-9 flex-col items-center justify-center gap-1 rounded-sm border border-[var(--control-border)] bg-[var(--control-bg)] font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--fg)] shadow-[0_3px_0_var(--control-shadow)] ${
              mode === "recording" ? "border-[var(--record)] bg-[var(--record-bg)] text-[var(--record)]" : ""
            }`}
          >
            <span className="text-base">⏺</span>
            <span>{isMobile ? "TAP" : "RECORD"}</span>
          </button>
          <button
            type="button"
            onClick={handleStop}
            className={`flex h-12 w-9 flex-col items-center justify-center gap-1 rounded-sm border border-[var(--control-border)] bg-[var(--control-bg)] font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--fg)] shadow-[0_3px_0_var(--control-shadow)] transition-opacity ${
              stopFlash ? "opacity-50" : "opacity-100"
            }`}
          >
            <span className="text-base">■</span>
            <span>STOP</span>
          </button>
          <button
            type="button"
            className="flex h-12 w-9 flex-col items-center justify-center gap-1 rounded-sm border border-[var(--control-border)] bg-[var(--control-bg)] font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--fg)] shadow-[0_3px_0_var(--control-shadow)] opacity-35"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className="text-base">⏭</span>
            <span>FF</span>
          </button>
        </div>

        {isMobile && (
          <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--muted-tertiary)]">
            TAP TO RECORD
          </p>
        )}

      </div>

      <div className="ml-auto mt-[10px] block w-fit rounded-[3px] bg-[var(--accent)] px-2 py-1 font-mono text-[8px] uppercase text-[var(--accent-contrast)] [transform:rotate(-1.5deg)] [position:relative] z-0">
        <p>SIDE A</p>
        <p>LEAVE A MESSAGE</p>
      </div>

      <div
        className={`mt-6 overflow-hidden transition-all duration-[400ms] ${
          showComposer ? "max-h-[600px] translate-y-0 opacity-100" : "max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <div className="rounded-md border border-[var(--form-border)] bg-[var(--form-card-bg)] p-4">
          {permissionDenied && (
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--error)]">
              microphone access needed
            </p>
          )}
          {errorMessage && !permissionDenied && (
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--error)]">
              {errorMessage}
            </p>
          )}

          <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--accent)]">
            ENGLISH TRANSLATION — edit if needed
          </label>
          <textarea
            className={`mt-2 min-h-[120px] w-full resize-none rounded-md border border-[var(--form-border)] bg-[var(--form-bg)] px-3 py-2 font-mono text-[12px] text-[var(--fg)] outline-none ${
              isTranslating && !englishDraft ? "translate-pulse" : ""
            }`}
            value={isTranslating && !englishDraft ? "translating..." : englishDraft}
            onChange={(event) => {
              setEnglishDraft(event.target.value);
              setTranslateError("");
              onTranslationChange?.({
                english: event.target.value,
                detectedLang: detectedLangCode || getLanguageCode(currentLanguage),
              });
            }}
            readOnly={isTranslating && !englishDraft}
            placeholder="translation will appear here..."
          />
          {translateError && autoDetect && (
            <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--error)]">
              couldn&apos;t translate — you can edit manually
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowOriginal((prev) => !prev)}
            className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted-tertiary)] hover:text-[var(--accent)]"
          >
            {showOriginal ? "hide original ←" : "show original →"}
          </button>

          {showOriginal && (
            <div className="mt-3">
              <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--muted-tertiary)]">
                ORIGINAL ({originalLangName})
              </label>
              <textarea
                className="mt-2 min-h-[100px] w-full resize-none rounded-md border border-[var(--form-border)] bg-[var(--form-bg)] px-3 py-2 font-mono text-[12px] text-[var(--muted)] outline-none"
                value={transcription}
                readOnly
              />
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleRetake}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--error)] opacity-80 hover:opacity-100"
            >
              ✕ retake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
