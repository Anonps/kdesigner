import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Music2,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Volume2,
  VolumeX,
  Sparkles,
  Code2,
  ShieldCheck,
  Smartphone,
  Users,
  Bot,
  ChevronRight,
  ChevronLeft,
  Upload,
} from "lucide-react";

const skills = [
  {
    id: 1,
    title: "تصميم صفحات ويب حديثة",
    description: "واجهات راقية مستوحاة من Apple وStripe تبرز هوية علامتك.",
    icon: Sparkles,
    glow: "rgba(99, 102, 241, 0.25)",
  },
  {
    id: 2,
    title: "تطوير مواقع احترافية",
    description: "أداء سريع وتجربة سلسة.",
    icon: Code2,
    glow: "rgba(168, 85, 247, 0.25)",
  },
  {
    id: 3,
    title: "إدارة مواقع بشكل احترافي",
    description: "متابعة وتحديث وحماية وتطوير مستمر.",
    icon: ShieldCheck,
    glow: "rgba(59, 130, 246, 0.25)",
  },
  {
    id: 4,
    title: "توافق كامل",
    description: "تناسق مثالي على الجوال والتابلت والحاسوب.",
    icon: Smartphone,
    glow: "rgba(236, 72, 153, 0.25)",
  },
  {
    id: 5,
    title: "تجربة مستخدم احترافية",
    description: "هندسة رحلات العملاء لتقليل الخطوات وزيادة الأرباح.",
    icon: Users,
    glow: "rgba(245, 158, 11, 0.25)",
  },
  {
    id: 6,
    title: "ذكاء اصطناعي مخصص",
    description: "وكلاء محادثة ذكية ومؤتمتة لخدمة العملاء والبيع.",
    icon: Bot,
    glow: "rgba(16, 185, 129, 0.25)",
  },
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>("/sound.mp3");
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-advance skills animation loop every 4.2 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused]);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    }
  };

  const handlePrevSkill = () => {
    setCurrentSkillIndex((prev) => (prev === 0 ? skills.length - 1 : prev - 1));
  };

  const handleNextSkill = () => {
    setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
  };

  const currentSkill = skills[currentSkillIndex];
  const CurrentIcon = currentSkill.icon;

  return (
    <main
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="relative w-full min-h-[115vh] overflow-x-hidden flex flex-col items-center font-sans selection:bg-white/20 selection:text-white"
    >
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Hidden Audio File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        onChange={handleAudioUpload}
        className="hidden"
      />

      {/* Background Video */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover z-[0]"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Atmospheric vignette */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/85 z-[1]" />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-between pt-6 md:pt-10 pb-10">
        {/* Top Header */}
        <header className="w-full flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl liquid-glass flex items-center justify-center text-white shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 256 256"
                fill="currentColor"
              >
                <path d="M 4.688 136 C 68.373 136 120 187.627 120 251.312 C 120 252.883 119.967 254.445 119.905 256 L 0 256 L 0 136.096 C 1.555 136.034 3.117 136 4.688 136 Z M 251.312 136 C 252.883 136 254.445 136.034 256 136.096 L 256 256 L 136.095 256 C 136.032 254.438 136.001 252.875 136 251.312 C 136 187.627 187.627 136 251.312 136 Z M 119.905 0 C 119.967 1.555 120 3.117 120 4.688 C 120 68.373 68.373 120 4.687 120 C 3.117 120 1.555 119.967 0 119.905 L 0 0 Z M 256 119.905 C 254.445 119.967 252.883 120 251.312 120 C 187.627 120 136 68.373 136 4.687 C 136 3.117 136.033 1.555 136.095 0 L 256 0 Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-medium tracking-wider text-base sm:text-lg">
                K DESINGER
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50">
                Creative STUDIO
              </span>
            </div>
          </div>

          {/* Sound Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              aria-label="Sound Toggle"
              className={`liquid-glass text-white/80 hover:text-white p-2.5 rounded-full transition-all cursor-pointer backdrop-blur-md flex items-center justify-center ${
                isPlaying ? "ring-1 ring-emerald-400/60 shadow-emerald-500/20 shadow-lg" : ""
              }`}
              title={isPlaying ? "إيقاف الصوت" : "تشغيل الصوت"}
            >
              {isPlaying ? (
                <Volume2 size={16} className="text-emerald-400 animate-pulse" />
              ) : (
                <VolumeX size={16} className="text-white/60" />
              )}
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload Custom Audio"
              className="liquid-glass text-white/60 hover:text-white p-2.5 rounded-full transition-all cursor-pointer backdrop-blur-md flex items-center justify-center hover:bg-white/10"
              title="تغيير / إدراج ملف صوت خاص بك"
            >
              <Upload size={14} />
            </button>
          </div>
        </header>

        {/* Center / Upper Hero CTA Section: "رفع للتواصل معي عبر فوق" */}
        <div className="flex-1 flex flex-col items-center justify-center my-16 md:my-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <a
              href="https://wa.me/966557733121"
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass bg-white/10 hover:bg-emerald-500/20 active:scale-95 hover:scale-105 text-white px-9 sm:px-12 py-4.5 sm:py-5 rounded-3xl text-lg sm:text-2xl font-medium tracking-wide flex items-center justify-center gap-4 transition-all cursor-pointer shadow-2xl group border border-white/15"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-emerald-400 group-hover:scale-110 transition-transform shrink-0"
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.51c-.19-.09-1.12-.55-1.3-.61-.17-.06-.3-.09-.43.09-.12.19-.49.61-.6.74-.11.12-.22.14-.41.05-.19-.09-.8-.29-1.52-.94-.56-.5-.94-1.12-1.05-1.31-.11-.19-.01-.29.08-.38.09-.08.19-.22.28-.33.09-.11.12-.19.19-.31.06-.12.03-.24-.02-.33-.05-.09-.43-1.03-.59-1.41-.15-.37-.31-.32-.43-.33h-.37c-.12 0-.33.05-.5.23-.17.19-.66.65-.66 1.58s.68 1.83.77 1.96c.09.12 1.33 2.04 3.23 2.86.45.2.8.31 1.08.4.46.15.87.13 1.2.08.37-.06 1.12-.46 1.28-.9.16-.45.16-.83.11-.91-.04-.08-.17-.13-.36-.23" />
              </svg>
              <span>للتواصل معي عبر</span>
            </a>
          </motion.div>
        </div>

        {/* Bottom Section: "المربع مكان المربع بالاسفل الذي فيه وسائل التواصل الاجتماعي" */}
        <motion.footer
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="liquid-glass w-full rounded-3xl p-6 sm:p-8 md:p-10 text-white/70 mt-[15px] relative overflow-hidden backdrop-blur-xl border border-white/10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Dynamic subtle ambient glow behind the active skill */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30 transition-colors duration-1000"
            style={{ background: currentSkill.glow }}
          />

          {/* Top of bottom box: Progress counter & navigation header */}
          <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
            {/* Step indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {skills.map((skill, index) => (
                <button
                  key={skill.id}
                  onClick={() => setCurrentSkillIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    index === currentSkillIndex
                      ? "w-7 sm:w-9 bg-white"
                      : "w-2 sm:w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Skill ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
                0{currentSkillIndex + 1} / 0{skills.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevSkill}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Previous skill"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={handleNextSkill}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Next skill"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Middle of bottom box: Animated Skill Content */}
          <div
            className="relative z-10 overflow-hidden py-3 min-h-[105px] sm:min-h-[115px] flex flex-col justify-center"
            dir="rtl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSkill.id}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/10 shadow-sm">
                    <CurrentIcon size={16} />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight leading-snug">
                    {currentSkill.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed font-light pr-11">
                  {currentSkill.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom border row: Brand Emblem & Social Media Icons */}
          <div className="pt-6 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            {/* Brand Emblem */}
            <div className="flex items-center gap-3 text-white/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 256 256"
                fill="currentColor"
              >
                <path d="M 4.688 136 C 68.373 136 120 187.627 120 251.312 C 120 252.883 119.967 254.445 119.905 256 L 0 256 L 0 136.096 C 1.555 136.034 3.117 136 4.688 136 Z M 251.312 136 C 252.883 136 254.445 136.034 256 136.096 L 256 256 L 136.095 256 C 136.032 254.438 136.001 252.875 136 251.312 C 136 187.627 187.627 136 251.312 136 Z M 119.905 0 C 119.967 1.555 120 3.117 120 4.688 C 120 68.373 68.373 120 4.687 120 C 3.117 120 1.555 119.967 0 119.905 L 0 0 Z M 256 119.905 C 254.445 119.967 252.883 120 251.312 120 C 187.627 120 136 68.373 136 4.687 C 136 3.117 136.033 1.555 136.095 0 L 256 0 Z" />
              </svg>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-5 text-white">
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-colors hover:text-white p-1"
                aria-label="Music2"
              >
                <Music2 size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-colors hover:text-white p-1"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-colors hover:text-white p-1"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-colors hover:text-white p-1"
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-colors hover:text-white p-1"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}
