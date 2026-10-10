import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
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
  Upload,
  Award,
} from "lucide-react";

/* ================================================================
 * ثوابت عامة
 * ================================================================ */

/** وسيلة التواصل المحددة (واتساب) — يقود إليها زر "تواصل" وقسم البطل */
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

/* ================================================================
 * البيانات
 * ================================================================ */

type Skill = {
  id: number;
  title: string;
  description: string;
  icon: typeof Sparkles;
  /** نسبة إتقان المهارة تُستخدم في شريط التقدم والعدّاد */
  level: number;
  /** لون بداية وتدرج شريط التقدم */
  color: string;
  color2: string;
  /** توهّج داخلي يظهر عند المرور على البطاقة */
  glow: string;
};

const skills: Skill[] = [
  {
    id: 1,
    title: "تصميم صفحات ويب حديثة",
    description: "واجهات راقية مستوحاة من Apple وStripe تبرز هوية علامتك.",
    icon: Sparkles,
    level: 98,
    color: "#6366f1",
    color2: "#8b5cf6",
    glow: "rgba(99, 102, 241, 0.3)",
  },
  {
    id: 2,
    title: "تطوير مواقع احترافية",
    description: "أداء سريع وتجربة سلسة.",
    icon: Code2,
    level: 95,
    color: "#a855f7",
    color2: "#c084fc",
    glow: "rgba(168, 85, 247, 0.3)",
  },
  {
    id: 3,
    title: "إدارة مواقع بشكل احترافي",
    description: "متابعة وتحديث وحماية وتطوير مستمر.",
    icon: ShieldCheck,
    level: 92,
    color: "#3b82f6",
    color2: "#60a5fa",
    glow: "rgba(59, 130, 246, 0.3)",
  },
  {
    id: 4,
    title: "توافق كامل",
    description: "تناسق مثالي على الجوال والتابلت والحاسوب.",
    icon: Smartphone,
    level: 97,
    color: "#ec4899",
    color2: "#f472b6",
    glow: "rgba(236, 72, 153, 0.3)",
  },
  {
    id: 5,
    title: "تجربة مستخدم احترافية",
    description: "هندسة رحلات العملاء لتقليل الخطوات وزيادة الأرباح.",
    icon: Users,
    level: 90,
    color: "#f59e0b",
    color2: "#fbbf24",
    glow: "rgba(245, 158, 11, 0.3)",
  },
  {
    id: 6,
    title: "ذكاء اصطناعي مخصص",
    description: "وكلاء محادثة ذكية ومؤتمتة لخدمة العملاء والبيع.",
    icon: Bot,
    level: 88,
    color: "#10b981",
    color2: "#34d399",
    glow: "rgba(16, 185, 129, 0.3)",
  },
];

/* ================================================================
 * مكوّنات مساعدة
 * ================================================================ */

/** أيقونة واتساب — تُستخدم في قسم البطل وزر "تواصل" العائم */
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

/**
 * بطاقة مهارة واحدة:
 * - تظهر بحركة خفيفة عند التمرير إليها (whileInView).
 * - عدّاد متحرك للنسبة (98% ...) يبدأ لحظة ظهور البطاقة.
 * - شريط تقدم يمتلئ حتى نسبة الإتقان مع لمعة مستمرة.
 */
function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.25 });
  const [displayLevel, setDisplayLevel] = useState(0);
  const Icon = skill.icon;
  const stagger = (index % 3) * 0.1;

  // عدّاد النسبة المتحرك — ينطلق عند ظهور البطاقة أثناء التمرير
  useEffect(() => {
    if (!isInView) return;
    let frame = 0;
    const delay = 300;
    const duration = 1100;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime - delay;
      const progress = Math.min(Math.max(elapsed / duration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayLevel(Math.round(eased * skill.level));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, skill.level]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: stagger, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-5 sm:p-6 overflow-hidden transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.09]"
    >
      {/* توهّج ملوّن خلف البطاقة يظهر عند المرور */}
      <div
        className="absolute -top-14 -left-14 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
        style={{ background: skill.glow }}
      />

      {/* أيقونة المهارة + نسبة الإتقان المتحركة */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/15"
          style={{
            background: `linear-gradient(135deg, ${skill.color}33, ${skill.color2}1F)`,
            color: skill.color2,
            boxShadow: `0 8px 22px ${skill.color}2E`,
          }}
        >
          <Icon size={20} />
        </div>
        <div
          className="text-2xl sm:text-[26px] font-bold leading-none tracking-tight"
          style={{ color: skill.color2 }}
        >
          {displayLevel}
          <span className="text-sm font-semibold text-white/45">%</span>
        </div>
      </div>

      <h3 className="relative z-10 text-base sm:text-lg font-semibold text-white leading-snug mt-1">
        {skill.title}
      </h3>

      <p className="relative z-10 text-[13px] sm:text-sm text-white/60 leading-relaxed flex-1">
        {skill.description}
      </p>

      {/* شريط التقدم — يمتلئ من اليمين إلى اليسار عند الظهور */}
      <div className="relative z-10 mt-1">
        <div className="mb-2 text-[11px] text-white/45 tracking-wide">
          مستوى الإتقان
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="skill-fill h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${skill.color}, ${skill.color2})`,
              boxShadow: `0 0 14px ${skill.color}99`,
            }}
            initial={{ width: "0%" }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 1.1,
              delay: 0.35 + stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </div>
    </motion.article>
  );
}

/* ================================================================
 * الصفحة الرئيسية
 * ================================================================ */

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>(BACKGROUND_AUDIO_URL);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------------
   * التشغيل التلقائي للصوت في الخلفية
   * ------------------------------------------------------------------
   * سياسة Autoplay في المتصفحات: يُمنع تشغيل الصوت "بصوت مسموع" قبل أن
   * يتفاعل الزائر مع الصفحة (نقرة / لمسة / ضغط على لوحة المفاتيح).
   *
   * الاستراتيجية المطبّقة هنا (كما هو مطلوب):
   *  1) نحاول تشغيل الملف فور تحميل الصفحة — نجاح إن سمح المتصفح
   *     (مثل إعادة زيارة سابقًا تفاعل فيها).
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

        {/* Center / Upper Hero CTA Section */}
        <div
          id="contact"
          className="flex-1 flex flex-col items-center justify-center my-16 md:my-28 scroll-mt-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass bg-white/10 hover:bg-emerald-500/20 active:scale-95 hover:scale-105 text-white px-9 sm:px-12 py-4.5 sm:py-5 rounded-3xl text-lg sm:text-2xl font-medium tracking-wide flex items-center justify-center gap-4 transition-all cursor-pointer shadow-2xl group border border-white/15"
            >
              <WhatsAppIcon
                size={26}
                className="text-emerald-400 group-hover:scale-110 transition-transform shrink-0"
              />
              <span>للتواصل معي عبر</span>
            </a>
          </motion.div>
        </div>

        {/* ==============================================================
         * قسم المهارات (أسفل الصفحة) — بطاقات مع أشرطة تقدم بنسب
         * ============================================================== */}
        <motion.section
          id="skills"
          dir="rtl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="liquid-glass w-full rounded-3xl p-6 sm:p-8 md:p-10 text-white mt-2 relative overflow-hidden backdrop-blur-xl border border-white/10"
        >
          {/* توهجات محيطة خفيفة */}
          <div
            className="absolute -top-28 -left-28 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-25"
            style={{ background: "rgba(99, 102, 241, 0.35)" }}
          />
          <div
            className="absolute -bottom-24 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ background: "rgba(16, 185, 129, 0.35)" }}
          />

          {/* عنوان القسم */}
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-7 md:mb-9">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl liquid-glass flex items-center justify-center text-white shadow-lg border border-white/10">
                <Award size={18} />
              </div>
              <div>
                <span className="block text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white/40">
                  Skills &amp; Expertise
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-1 tracking-tight">
                  المهارات
                </h2>
              </div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-sm text-start sm:text-end">
              مهارات أتقنها بعناية، أضعها بين يديك لبناء تجربة رقمية مميزة
              تجمع بين الجمال والأداء.
            </p>
          </div>

          {/* شبكة البطاقات — أعمدة حسب حجم الشاشة */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {skills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Bottom Footer: Brand Emblem & Social Media Icons */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="liquid-glass w-full rounded-3xl p-6 sm:p-8 text-white/70 mt-5 relative overflow-hidden backdrop-blur-xl border border-white/10"
        >
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
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

      {/* ==============================================================
       * زر "تواصل" ثابت وبارز — يقود مباشرة إلى وسيلة التواصل المحددة
       * ============================================================== */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معي عبر واتساب"
        title="تواصل"
        dir="rtl"
        initial={{ opacity: 0, y: 24, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="group fixed bottom-5 left-5 sm:bottom-7 sm:left-7 z-50 flex items-center gap-2.5 rounded-full px-4 py-3 text-white font-medium text-sm sm:text-base shadow-2xl shadow-emerald-700/40 ring-1 ring-white/20 hover:ring-emerald-300/60 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        style={{ background: "linear-gradient(135deg, #10b981 0%, #047857 100%)" }}
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <span
            className="absolute inset-0 rounded-full bg-white/40 animate-ping"
            style={{ animationDuration: "2.4s" }}
            aria-hidden="true"
          />
          <WhatsAppIcon size={16} className="relative text-white" />
        </span>
        <span>تواصل</span>
      </motion.a>
    </main>
  );
}
