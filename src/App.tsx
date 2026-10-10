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
  Award,
} from "lucide-react";

/* ================================================================
 * ثوابت عامة
 * ================================================================ */

/** وسيلة التواصل المحددة (واتساب) — يقود إليها زر "تواصل" العائم */
const WHATSAPP_URL = "https://wa.me/966557733121";

/**
 * الملف الصوتي الذي يعمل في خلفية الصفحة.
 * ملاحظة مهمة: المتصفحات الحديثة (Chrome / Safari / Firefox) تمنع تشغيل
 * الصوت تلقائيًا قبل تفاعل الزائر مع الصفحة (سياسة Autoplay)، لذلك راجع
 * useEffect المعنون بـ "التشغيل التلقائي للصوت" أسفل المكوّن — يحاول التشغيل
 * فورًا، ويرتبط بأول تفاعل كحل احتياطي.
 */
const BACKGROUND_AUDIO_URL =
  "https://cdn.hostmora.app/passionate-worth-xz6x8/c7d226d1-e79e-434b-bd76-d0e69b1232cb/WhatsApp%20Audio%202026-10-07%20at%2011.44.18%20PM.mp3";

/** مستوى الصوت الافتراضي للخلفية الصوتية (0 → 1) — يمكن تعديله هنا */
const BACKGROUND_VOLUME = 0.5;

/** مدة عرض المهارة قبل اختفائها والانتقال للتالية (ميلي ثانية) */
const SKILL_INTERVAL = 4500;

/* ================================================================
 * البيانات
 * ================================================================ */

type Skill = {
  id: number;
  title: string;
  description: string;
  icon: typeof Sparkles;
  /** لون بداية وتدرج أيقونة المهارة وشريط التقدم */
  color: string;
  color2: string;
  /** توهّج خلف المربع ينطبق على لون المهارة الحالية */
  glow: string;
};

const skills: Skill[] = [
  {
    id: 1,
    title: "تصميم صفحات ويب حديثة",
    description: "واجهات راقية مستوحاة من Apple وStripe تبرز هوية علامتك.",
    icon: Sparkles,
    color: "#6366f1",
    color2: "#8b5cf6",
    glow: "rgba(99, 102, 241, 0.3)",
  },
  {
    id: 2,
    title: "تطوير مواقع احترافية",
    description: "أداء سريع وتجربة سلسة.",
    icon: Code2,
    color: "#a855f7",
    color2: "#c084fc",
    glow: "rgba(168, 85, 247, 0.3)",
  },
  {
    id: 3,
    title: "إدارة مواقع بشكل احترافي",
    description: "متابعة وتحديث وحماية وتطوير مستمر.",
    icon: ShieldCheck,
    color: "#3b82f6",
    color2: "#60a5fa",
    glow: "rgba(59, 130, 246, 0.3)",
  },
  {
    id: 4,
    title: "توافق كامل",
    description: "تناسق مثالي على الجوال والتابلت والحاسوب.",
    icon: Smartphone,
    color: "#ec4899",
    color2: "#f472b6",
    glow: "rgba(236, 72, 153, 0.3)",
  },
  {
    id: 5,
    title: "تجربة مستخدم احترافية",
    description: "هندسة رحلات العملاء لتقليل الخطوات وزيادة الأرباح.",
    icon: Users,
    color: "#f59e0b",
    color2: "#fbbf24",
    glow: "rgba(245, 158, 11, 0.3)",
  },
  {
    id: 6,
    title: "ذكاء اصطناعي مخصص",
    description: "وكلاء محادثة ذكية ومؤتمتة لخدمة العملاء والبيع.",
    icon: Bot,
    color: "#10b981",
    color2: "#34d399",
    glow: "rgba(16, 185, 129, 0.3)",
  },
];

/* ================================================================
 * مكوّنات مساعدة
 * ================================================================ */

/** أيقونة واتساب — تُستخدم في زر "تواصل" العائم */
function WhatsAppIcon({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.51c-.19-.09-1.12-.55-1.3-.61-.17-.06-.3-.09-.43.09-.12.19-.49.61-.6.74-.11.12-.22.14-.41.05-.19-.09-.8-.29-1.52-.94-.56-.5-.94-1.12-1.05-1.31-.11-.19-.01-.29.08-.38.09-.08.19-.22.28-.33.09-.11.12-.19.19-.31.06-.12.03-.24-.02-.33-.05-.09-.43-1.03-.59-1.41-.15-.37-.31-.32-.43-.33h-.37c-.12 0-.33.05-.5.23-.17.19-.66.65-.66 1.58s.68 1.83.77 1.96c.09.12 1.33 2.04 3.23 2.86.45.2.8.31 1.08.4.46.15.87.13 1.2.08.37-.06 1.12-.46 1.28-.9.16-.45.16-.83.11-.91-.04-.08-.17-.13-.36-.23" />
    </svg>
  );
}

/* ================================================================
 * الشعار السينمائي — K DESINGER بحركة دخول درامية ولمعة مستمرة
 * ================================================================ */

/**
 * عنوان بأسلوب إعلانات الأفلام (trailer-style) ليلفت النظر فورًا:
 * - الدخول: الحروف تتقارب من تباعد واسع + انقشاع ضبابي + صعود متتابع حرفًا حرفًا.
 * - الاستمرار: لمعة ضوئية تعبر النص ذهابًا وإيابًا + توهّج نابض (CSS فقط في index.css).
 */
function CinematicBrand() {
  const letters = "K DESINGER".split("");
  return (
    <motion.span
      dir="ltr"
      aria-label="K DESINGER"
      className="brand-cinematic text-base sm:text-lg"
      initial={{ opacity: 0, letterSpacing: "0.5em", filter: "blur(8px)" }}
      animate={{ opacity: 1, letterSpacing: "0.12em", filter: "blur(0px)" }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {letters.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden="true"
          className="inline-block"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2 + i * 0.06,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ================================================================
 * الصفحة الرئيسية
 * ================================================================ */

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>(BACKGROUND_AUDIO_URL);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  /* ------------------------------------------------------------------
   * عرض المهارات: مهارة واحدة تظهر ثم تختفي ويأتي دور التي بعدها
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
    }, SKILL_INTERVAL);
    return () => clearTimeout(timer);
  }, [currentSkillIndex]);

  /* ------------------------------------------------------------------
   * التشغيل التلقائي للصوت في الخلفية
   * ------------------------------------------------------------------
   * سياسة Autoplay في المتصفحات: يُمنع تشغيل الصوت "بصوت مسموع" قبل أن
   * يتفاعل الزائر مع الصفحة (نقرة / لمسة / ضغط على لوحة المفاتيح).
   *
   * الاستراتيجية المطبّقة هنا (كما هو مطلوب):
   *  1) نحاول تشغيل الملف فور تحميل الصفحة — نجاح إن سمح المتصفح
   *     (مثل زيارة سابقًا تفاعل فيها الزائر).
   *  2) في حال الرفض، ننتظر أول تفاعل حقيقي للزائر ثم نشغّل الصوت
   *     داخل معالج الحدث نفسه (هذا شرط iOS أيضًا)، ثم نزيل المستمعات.
   *
   * زر الصوت في الترويسة يبقى متاحًا للتوقف/التشغيل يدويًا في أي وقت.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = BACKGROUND_VOLUME;

    let started = false;
    const interactionEvents = ["pointerdown", "keydown", "touchstart"] as const;

    const startBackgroundAudio = () => {
      if (started) return;
      audio
        .play()
        .then(() => {
          started = true;
          // نجاح التشغيل — لم نعد نحتاج مستمعات التفاعل الاحتياطية
          interactionEvents.forEach((event) =>
            window.removeEventListener(event, startBackgroundAudio),
          );
        })
        .catch(() => {
          // رفض المتصفح للتشغيل التلقائي (NotAllowedError المتوقع).
          // نبقى منتظمين على أول تفاعل ليبدأ الصوت تلقائيًا عنده.
        });
    };

    // (1) محاولة فورية عند دخول الزائر
    startBackgroundAudio();

    // (2) حل احتياطي: أول نقرة / لمسة / لوحة مفاتيح تبدأ التشغيل
    interactionEvents.forEach((event) =>
      window.addEventListener(event, startBackgroundAudio, { passive: true }),
    );

    return () => {
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, startBackgroundAudio),
      );
    };
  }, []);

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

  const currentSkill = skills[currentSkillIndex];
  const CurrentIcon = currentSkill.icon;

  return (
    <main
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="relative w-full min-h-screen overflow-x-hidden flex flex-col items-center font-sans selection:bg-white/20 selection:text-white"
    >
      {/* Background Audio — يحاول التشغيل التلقائي عند أول تفاعل عند الحاجة */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Background Video — لا يتأثر بالمربع: مثبّت بالكامل خلف كل شيء */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover z-[0]"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Atmospheric vignette — مخفف بالأسفل لتبقى الخلفية ظاهرة خلف المربع */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/60 z-[1]" />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl px-3 sm:px-6 lg:px-8 flex-1 flex flex-col pt-4 md:pt-10 pb-6 sm:pb-10">
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
              <CinematicBrand />
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6, ease: "easeOut" }}
                className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50"
              >
                Creative STUDIO
              </motion.span>
            </div>
          </div>

          {/* الصوت + تواصل — أعلى اليمين مقابل الشعار */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              aria-label="Sound Toggle"
              className={`liquid-glass text-white/80 hover:text-white p-2.5 rounded-full transition-all cursor-pointer backdrop-blur-md flex items-center justify-center ${
                isPlaying
                  ? "ring-1 ring-emerald-400/60 shadow-emerald-500/20 shadow-lg"
                  : ""
              }`}
              title={isPlaying ? "إيقاف الصوت" : "تشغيل الصوت"}
            >
              {isPlaying ? (
                <Volume2 size={16} className="text-emerald-400 animate-pulse" />
              ) : (
                <VolumeX size={16} className="text-white/60" />
              )}
            </button>

            {/* زر "تواصل" أعلى اليمين مقابل K DESIGNER — يقود لواتساب */}
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل معي عبر واتساب"
              title="تواصل"
              dir="rtl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-white font-medium text-xs sm:text-sm shadow-lg shadow-emerald-700/40 ring-1 ring-white/20 hover:ring-emerald-300/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #10b981 0%, #047857 100%)" }}
            >
              <WhatsAppIcon size={14} className="text-white" />
              <span>تواصل</span>
            </motion.a>
          </div>
        </header>

        {/* مساحة مرنة — تُبقي الفيديو الخلفي ظاهرًا دون تغطية */}
        <div className="flex-1 min-h-8" aria-hidden="true" />

        {/* Bottom Footer: Brand Emblem & Social Media Icons */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="liquid-glass w-full max-w-md sm:max-w-none mx-auto rounded-2xl px-4 py-3 sm:p-6 text-white/70 relative overflow-hidden backdrop-blur-xl border border-white/10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
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

        {/* ==============================================================
         * قسم المهارات — مربع صغير يعرض مهارة واحدة تباعًا:
         * تظهر (عنوان + وصف) ثم تختفي، ثم تظهر التي بعدها، وهكذا
         * ============================================================== */}
        <motion.section
          id="skills"
          dir="rtl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="liquid-glass w-full max-w-md sm:max-w-xl mx-auto mt-3 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden backdrop-blur-xl border border-white/10"
        >
          {/* توهج ملوّن خلف المربع يتبع لون المهارة الحالية */}
          <div
            className="absolute -top-20 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-30 transition-colors duration-1000"
            style={{ background: currentSkill.glow }}
          />

          {/* رأس المربع: العنوان + العدّاد + النقاط */}
          <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl liquid-glass flex items-center justify-center text-white/90 border border-white/10 shadow-md">
                <Award size={14} />
              </div>
              <div className="leading-tight">
                <span className="block text-[9px] uppercase tracking-[0.3em] text-white/40">
                  Skills
                </span>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  المهارات
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-widest text-white/40">
                0{currentSkillIndex + 1} / 0{skills.length}
              </span>
              <div className="flex items-center gap-1.5">
                {skills.map((skill, index) => (
                  <button
                    key={skill.id}
                    onClick={() => setCurrentSkillIndex(index)}
                    aria-label={`المهارة ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                      index === currentSkillIndex
                        ? "w-6 bg-white"
                        : "w-2 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* المهارة الحالية: تظهر ثم تختفي فتليها التالية */}
          <div className="relative z-10 min-h-[72px] sm:min-h-[96px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSkill.id}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/15"
                    style={{
                      background: `linear-gradient(135deg, ${currentSkill.color}33, ${currentSkill.color2}1F)`,
                      color: currentSkill.color2,
                    }}
                  >
                    <CurrentIcon size={15} />
                  </div>
                  <h3 className="text-[15px] sm:text-lg font-bold text-white leading-snug">
                    {currentSkill.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed pr-10">
                  {currentSkill.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* شريط زمن رفيع يمتلئ خلال فترة العرض ثم تنتقل للمهارة التالية */}
          <div className="relative z-10 mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              key={`progress-${currentSkillIndex}`}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${currentSkill.color}, ${currentSkill.color2})`,
              }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: SKILL_INTERVAL / 1000, ease: "linear" }}
            />
          </div>
        </motion.section>
      </div>

    </main>
  );
}
