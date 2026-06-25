"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VoiceCassette from "./VoiceCassette";

type ContactType = "HIRE ME" | "FREELANCE" | "COLLAB" | "JUST SAYING HI";

type BudgetRange = "< ₹10K" | "₹10K-50K" | "₹50K-1L" | "1L+" | "LET'S TALK";

const contactTypes: ContactType[] = [
  "HIRE ME",
  "FREELANCE",
  "COLLAB",
  "JUST SAYING HI",
];

const budgetOptions: BudgetRange[] = [
  "< ₹10K",
  "₹10K-50K",
  "₹50K-1L",
  "1L+",
  "LET'S TALK",
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

const inputClass =
  "mt-2 w-full border-0 border-b border-[#2a2a1a] bg-[#0d0d0a] px-0 py-2 font-mono text-[13px] text-[#f0ede6] outline-none transition-colors duration-200 focus:border-[#e8ff00]";

export default function ContactNotePanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactType, setContactType] = useState<ContactType | "">("");
  const [showOptional, setShowOptional] = useState(false);
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [budget, setBudget] = useState<BudgetRange | "">("");
  const [showNoteComposer, setShowNoteComposer] = useState(false);
  const [activeTab, setActiveTab] = useState<"voice" | "text">("voice");
  const [transcription, setTranscription] = useState("");
  const [englishNote, setEnglishNote] = useState("");
  const [detectedLang, setDetectedLang] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", type: "" });
  const [shake, setShake] = useState({ name: false, email: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);
  const [typewriter, setTypewriter] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);

  const needsBudget = contactType === "HIRE ME" || contactType === "FREELANCE";

  const handleTranscriptionChange = (value: string) => {
    setTranscription(value);
    setEnglishNote("");
    setDetectedLang("");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const speech =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
    const supported = Boolean(speech) && typeof MediaRecorder !== "undefined";
    setSpeechSupported(supported);
    if (!supported) {
      setActiveTab("text");
    }
  }, []);

  const typewriterMessage = useMemo(() => {
    if (!sent) return "";
    return [
      "✓ message received.",
      `i'll get back to you at ${email}.`,
      "usually within 24 hours.",
      "— Utsav",
    ].join("\n");
  }, [sent, email]);

  useEffect(() => {
    if (!sent) return;
    let index = 0;
    setTypewriter("");
    const timer = window.setInterval(() => {
      index += 1;
      setTypewriter(typewriterMessage.slice(0, index));
      if (index >= typewriterMessage.length) {
        window.clearInterval(timer);
      }
    }, 22);
    return () => window.clearInterval(timer);
  }, [sent, typewriterMessage]);

  const triggerShake = (field: "name" | "email") => {
    setShake((prev) => ({ ...prev, [field]: true }));
    window.setTimeout(() => {
      setShake((prev) => ({ ...prev, [field]: false }));
    }, 400);
  };

  const validate = () => {
    let ok = true;
    const nextErrors = { name: "", email: "", type: "" };

    if (!name.trim()) {
      nextErrors.name = "name is required";
      triggerShake("name");
      ok = false;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!email.trim() || !emailValid) {
      nextErrors.email = "valid email required";
      triggerShake("email");
      ok = false;
    }

    if (!contactType) {
      nextErrors.type = "select a type";
      ok = false;
    }

    setErrors(nextErrors);
    return ok;
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setContactType("");
    setShowOptional(false);
    setPhone("");
    setCompany("");
    setGithub("");
    setLinkedin("");
    setWebsite("");
    setBudget("");
    setShowNoteComposer(false);
    setActiveTab("voice");
    setTranscription("");
    setEnglishNote("");
    setDetectedLang("");
    setTypedMessage("");
    setErrors({ name: "", email: "", type: "" });
    setShake({ name: false, email: false });
    setSubmitting(false);
    setSubmitError("");
    setSent(false);
    setTypewriter("");
  };

  const handleSubmit = async () => {
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const finalEnglish =
        activeTab === "voice" ? (englishNote || transcription).trim() : typedMessage.trim();
      const originalNote = activeTab === "voice" ? transcription.trim() : "";
      const languageName = detectedLang
        ? `${languageNameByCode[detectedLang] || detectedLang} → English${
            detectedLang === "EN" ? "" : " (auto translated)"
          }`
        : "";

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          type: contactType,
          phone: phone.trim(),
          company: company.trim(),
          github: github.trim(),
          linkedin: linkedin.trim(),
          website: website.trim(),
          budget: needsBudget ? budget : "",
          noteEnglish: finalEnglish,
          noteOriginal: originalNote,
          language: languageName,
        }),
      });
      if (!response.ok) {
        throw new Error("send failed");
      }
      setSent(true);
    } catch (error) {
      setSubmitError("Could not send yet. Try again in a bit.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto flex w-full max-w-[480px] flex-col items-center justify-center gap-4 rounded-md border border-[#2a2a1a] bg-[#0d0d0a] px-6 py-10 text-center">
        <pre className="whitespace-pre-line text-[12px] font-mono uppercase tracking-[0.2em] text-[#e8ff00]">
          {typewriter}
        </pre>
        <button
          type="button"
          onClick={resetForm}
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f0ede6]/80 hover:text-[#e8ff00]"
        >
          send another →
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[480px]">
      <div className="rounded-md border border-[#2a2a1a] bg-[#11110d] px-5 py-6">
        <div className="flex items-center justify-between">
          <span className="border-b border-[#e8ff00] pb-1 font-mono text-[10px] uppercase tracking-[0.32em] text-[#f0ede6]">
            WHO ARE YOU
          </span>
        </div>

        <div className="mt-5">
          <label className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#666]">
            Name <span className="text-[#e8ff00]">*</span>
          </label>
          <input
            className={`${inputClass} ${shake.name ? "input-shake" : ""}`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="your name"
          />
          {errors.name && (
            <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#ff6b6b]">
              {errors.name}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#666]">
            Email <span className="text-[#e8ff00]">*</span>
          </label>
          <input
            className={`${inputClass} ${shake.email ? "input-shake" : ""}`}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your email"
            type="email"
          />
          {errors.email && (
            <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#ff6b6b]">
              {errors.email}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#666]">
            What&apos;s this about? <span className="text-[#e8ff00]">*</span>
          </label>
          <div
            className={`mt-3 flex flex-wrap gap-2 rounded-md border border-transparent p-2 transition-colors ${
              errors.type ? "border-[#ff6b6b]" : "border-[#1a1a14]"
            }`}
          >
            {contactTypes.map((type) => {
              const active = contactType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setContactType(type)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${
                    active
                      ? "border-[#e8ff00] bg-[#e8ff00] text-[#1a1a14]"
                      : "border-[#e8ff00] bg-[#11110d] text-[#e8ff00]"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowOptional((prev) => !prev)}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a] hover:text-[#e8ff00]"
        >
          + add more details (optional)
        </button>

        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
            showOptional ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-5 grid gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#666]">Phone</label>
              <input
                className={inputClass}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="phone number (optional)"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#666]">
                Company / College
              </label>
              <input
                className={inputClass}
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="where are you from? (optional)"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#666]">GitHub</label>
              <input
                className={inputClass}
                value={github}
                onChange={(event) => setGithub(event.target.value)}
                placeholder="github.com/username (optional)"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#666]">LinkedIn</label>
              <input
                className={inputClass}
                value={linkedin}
                onChange={(event) => setLinkedin(event.target.value)}
                placeholder="linkedin.com/in/username (optional)"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#666]">Website</label>
              <input
                className={inputClass}
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="your website (optional)"
              />
            </div>

            {needsBudget && (
              <div>
                <label className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#666]">Budget</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {budgetOptions.map((option) => {
                    const active = budget === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setBudget(option)}
                        className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${
                          active
                            ? "border-[#e8ff00] bg-[#e8ff00] text-[#1a1a14]"
                            : "border-[#e8ff00] bg-[#11110d] text-[#e8ff00]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="my-6 flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.28em] text-[#666]">
          <span className="h-px flex-1 bg-[#2a2a1a]" />
          <span>AND YOUR NOTE</span>
          <span className="h-px flex-1 bg-[#2a2a1a]" />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowNoteComposer((prev) => !prev)}
            aria-expanded={showNoteComposer}
            aria-controls="contact-note-composer"
            className="group flex w-full items-center justify-between gap-4 border-b border-[#2a2a1a] pb-3 text-left transition-colors hover:border-[#3a3a2a]"
          >
            <span className="border-b border-[#e8ff00] pb-1 font-mono text-[10px] uppercase tracking-[0.32em] text-[#f0ede6]">
              ADD A NOTE (OPTIONAL)
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.24em] transition-all duration-300 ${
                showNoteComposer ? "text-[#e8ff00]" : "text-[#6a6a6a] group-hover:text-[#f0ede6]"
              }`}
            >
              {showNoteComposer ? "close −" : "open +"}
            </span>
          </button>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6a6a6a]">
            {showNoteComposer
              ? "record your voice or just type below"
              : "click to open a smooth note drawer with voice and typing options"}
          </p>

          <AnimatePresence initial={false}>
            {showNoteComposer ? (
              <motion.div
                id="contact-note-composer"
                key="contact-note-composer"
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <div className="relative inline-grid grid-cols-2 rounded-full border border-[#2a2a1a] bg-[#0d0d0a] p-1">
                    <motion.span
                      layoutId="contact-note-tab"
                      className="absolute bottom-1 left-1 top-1 rounded-full border border-[#3a3a2a] bg-[#17170f]"
                      style={{ width: "calc(50% - 4px)" }}
                      animate={{ x: activeTab === "voice" ? 0 : "100%" }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                    <button
                      type="button"
                      onClick={() => setActiveTab("voice")}
                      className={`relative z-10 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${
                        activeTab === "voice" ? "text-[#f0ede6]" : "text-[#6a6a6a]"
                      }`}
                    >
                      Voice Note
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("text")}
                      className={`relative z-10 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${
                        activeTab === "text" ? "text-[#f0ede6]" : "text-[#6a6a6a]"
                      }`}
                    >
                      Type Instead
                    </button>
                  </div>

                  <div className="relative mt-5">
                    <AnimatePresence mode="wait" initial={false}>
                      {activeTab === "voice" ? (
                        <motion.div
                          key="voice-note"
                          initial={{ opacity: 0, x: -18 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 18 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                          {speechSupported ? (
                            <VoiceCassette
                              transcription={transcription}
                              onTranscriptionChange={handleTranscriptionChange}
                              onTranslationChange={({ english, detectedLang }) => {
                                setEnglishNote(english);
                                setDetectedLang(detectedLang);
                              }}
                            />
                          ) : (
                            <div className="rounded-md border border-[#2a2a1a] bg-[#0d0d0a] px-4 py-6 text-center">
                              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">
                                voice notes work best in Chrome or Edge. use the TYPE INSTEAD tab to
                                leave a message, or open this page in Chrome.
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="text-note"
                          initial={{ opacity: 0, x: 18 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -18 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                          <div className="rounded-md border border-[#2a2a1a] bg-[#0d0d0a] p-4">
                            <textarea
                              className="min-h-[140px] w-full resize-none bg-transparent font-mono text-[13px] text-[#f0ede6] outline-none"
                              placeholder="type your message here... no judgment, no word limit."
                              maxLength={500}
                              value={typedMessage}
                              onChange={(event) => setTypedMessage(event.target.value)}
                            />
                            <div className="mt-2 text-right font-mono text-[9px] uppercase tracking-[0.22em] text-[#6a6a6a]">
                              <span className={typedMessage.length >= 450 ? "text-[#e8ff00]" : ""}>
                                {typedMessage.length} / 500
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {submitError && (
          <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#ff6b6b]">
            {submitError}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-[#e8ff00] px-4 py-3 font-mono text-[12px] uppercase tracking-[0.32em] text-[#1a1a14] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "SENDING..."
            : showNoteComposer && activeTab === "voice"
              ? "SEND VOICE NOTE →"
              : showNoteComposer && activeTab === "text"
                ? "SEND MESSAGE →"
                : "SEND INQUIRY →"}
        </button>
      </div>
    </div>
  );
}
