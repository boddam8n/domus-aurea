"use client";

import { motion, useReducedMotion } from "framer-motion";

type TestInvitationObjectProps = {
  isOpen: boolean;
  brideName: string;
  groomName: string;
  date: string;
  venue: string;
  message: string;
  className?: string;
  compact?: boolean;
};

function getInitials(brideName: string, groomName: string) {
  const first = brideName.trim().charAt(0);
  const second = groomName.trim().charAt(0);
  return `${first}${second}`.toUpperCase() || "DA";
}

export function TestInvitationObject({
  isOpen,
  brideName,
  groomName,
  date,
  venue,
  message,
  className = "",
  compact = false
}: TestInvitationObjectProps) {
  const initials = getInitials(brideName, groomName);
  const shouldReduceMotion = useReducedMotion();
  const mainDuration = shouldReduceMotion ? 0.01 : 2.05;
  const secondaryDuration = shouldReduceMotion ? 0.01 : 1.45;
  const revealDelay = shouldReduceMotion ? 0 : 1.08;

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-[#d9b66f]/18 bg-[#efe6d6] shadow-[inset_0_0_0_1px_rgba(255,255,255,.22),0_42px_130px_rgba(0,0,0,.34)] ${compact ? "min-h-[520px]" : "min-h-[640px] sm:min-h-[720px]"} ${className}`}
      aria-label="TEST luxury invitation object"
    >
      <LuxuryTableSurface />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,.34),transparent_38%),linear-gradient(115deg,rgba(255,240,199,.2)_0_12%,transparent_12%_50%,rgba(255,240,199,.15)_50%_62%,transparent_62%)]" />
      <AmbientGoldDust />

      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className={`absolute left-1/2 top-1/2 h-[610px] w-[440px] max-w-none -translate-x-1/2 -translate-y-1/2 will-change-transform ${compact ? "scale-[.62] sm:scale-[.72] md:scale-[.82]" : "scale-[.7] sm:scale-[.8] md:scale-[.9] lg:scale-100"}`}
        style={{ transformStyle: "preserve-3d", perspective: "1800px" }}
      >
        <motion.div
          variants={{
            closed: { rotateX: 8, rotateZ: -4, y: 14, scale: 0.995 },
            open: { rotateX: 4, rotateZ: -1.8, y: -4, scale: 1 }
          }}
          transition={{ duration: mainDuration, ease: [0.2, 0.82, 0.18, 1] }}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute left-1/2 top-[92%] h-32 w-[540px] -translate-x-1/2 rounded-full bg-black/34 blur-3xl" />
          <div className="absolute left-1/2 top-[86%] h-16 w-[390px] -translate-x-1/2 rounded-full bg-[#2a1508]/24 blur-2xl" />

          <div className="absolute inset-x-[36px] top-[58px] h-[504px] rounded-[1.15rem] bg-[#061e19] shadow-[0_40px_120px_rgba(0,0,0,.42),inset_0_0_0_1px_rgba(255,255,255,.08)]">
            <EmeraldMaterial />
            <EnvelopeLowerFlap />
          </div>

          <InvitationPaper
            brideName={brideName}
            groomName={groomName}
            date={date}
            venue={venue}
            message={message}
            initials={initials}
            isOpen={isOpen}
            revealDelay={revealDelay}
            motionDuration={secondaryDuration}
          />

          <motion.div
            variants={{
              closed: { rotateY: 0, x: 0, z: 42 },
              open: { rotateY: -126, x: -24, z: 48 }
            }}
            transition={{ duration: mainDuration, ease: [0.18, 0.78, 0.16, 1] }}
            className="absolute left-[36px] top-[58px] z-30 h-[504px] w-[184px] origin-left rounded-l-[1.15rem]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <GatePanel side="left" />
          </motion.div>

          <motion.div
            variants={{
              closed: { rotateY: 0, x: 0, z: 42 },
              open: { rotateY: 126, x: 24, z: 48 }
            }}
            transition={{ duration: mainDuration, ease: [0.18, 0.78, 0.16, 1] }}
            className="absolute right-[36px] top-[58px] z-30 h-[504px] w-[184px] origin-right rounded-r-[1.15rem]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <GatePanel side="right" />
          </motion.div>

          <motion.div
            variants={{
              closed: { rotateX: 0, y: 0, opacity: 1 },
              open: { rotateX: -126, y: -36, opacity: 0.96 }
            }}
            transition={{ duration: mainDuration, ease: [0.18, 0.78, 0.16, 1] }}
            className="absolute left-[36px] top-[58px] z-40 h-[168px] w-[368px] origin-top overflow-hidden rounded-t-[1.15rem]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 bg-[#08241e] shadow-[inset_0_-30px_60px_rgba(0,0,0,.28)]">
              <EmeraldMaterial />
              <div className="absolute inset-x-10 top-6 h-px bg-[#f0d18a]/30" />
              <div className="absolute inset-x-6 bottom-0 h-px bg-[#d8b15f]/45" />
            </div>
          </motion.div>

          <motion.div
            variants={{
              closed: { scaleX: 1, opacity: 1 },
              open: { scaleX: 0.18, y: 74, opacity: 0 }
            }}
            transition={{ duration: secondaryDuration, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[50px] top-[294px] z-50 h-4 w-[340px] origin-center rounded-full bg-[linear-gradient(90deg,#8c6427,#f3d789_42%,#956723)] shadow-[0_10px_26px_rgba(0,0,0,.34)]"
          />

          <motion.div
            variants={{
              closed: { opacity: 1, scale: 1, y: 0 },
              open: { opacity: 0, scale: 0.74, y: 102, rotate: 10 }
            }}
            transition={{ duration: secondaryDuration, ease: [0.2, 0.82, 0.18, 1] }}
            className="absolute left-1/2 top-[256px] z-[60] h-32 w-32 -translate-x-1/2"
          >
            <WaxSeal initials={initials} />
          </motion.div>

          <motion.div
            variants={{
              closed: { opacity: 0, y: 14 },
              open: { opacity: 1, y: 0 }
            }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.9, delay: isOpen ? revealDelay : 0, ease: [0.2, 0.82, 0.18, 1] }}
            className="absolute bottom-[10px] left-1/2 z-10 -translate-x-1/2 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-[#6f4d25]/75"
          >
            Domus Aurea / TEST
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function TestInvitationMiniature({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#efe6d6] ${className}`}>
      <LuxuryTableSurface />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_20%,rgba(255,255,255,.34),transparent_38%)]" />
      <div className="absolute left-1/2 top-1/2 h-[470px] w-[330px] -translate-x-1/2 -translate-y-1/2 -rotate-3 scale-[.76] sm:scale-[.84]">
        <div className="absolute left-1/2 top-[92%] h-20 w-[360px] -translate-x-1/2 rounded-full bg-black/25 blur-2xl" />
        <div className="absolute inset-x-[28px] top-[46px] h-[390px] rounded-[1rem] bg-[#061e19] shadow-[0_28px_70px_rgba(0,0,0,.35)]">
          <EmeraldMaterial />
        </div>
        <div className="absolute left-[66px] top-[82px] h-[330px] w-[198px] bg-[#f9f0dd] p-5 text-center text-[#1f1710] shadow-[0_24px_55px_rgba(0,0,0,.24)]">
          <div className="absolute inset-3 border border-[#ba8c42]/45" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#997037]">TEST</p>
            <p className="mt-3 font-display text-4xl text-[#b8894b]">DA</p>
            <h3 className="mt-4 font-display text-3xl leading-tight">Layan<br />Yassin</h3>
            <div className="my-4 h-px w-20 bg-[#b8894b]/55" />
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#2c2119]/65">Launch ready invitation</p>
          </div>
        </div>
        <div className="absolute left-[28px] top-[46px] h-[390px] w-[136px] origin-left rounded-l-[1rem] bg-[#08241e] shadow-[0_22px_52px_rgba(0,0,0,.26)]" style={{ transform: "rotateY(-58deg)" }}>
          <GatePanel side="left" />
        </div>
        <div className="absolute right-[28px] top-[46px] h-[390px] w-[136px] origin-right rounded-r-[1rem] bg-[#08241e] shadow-[0_22px_52px_rgba(0,0,0,.26)]" style={{ transform: "rotateY(58deg)" }}>
          <GatePanel side="right" />
        </div>
        <div className="absolute left-1/2 top-[230px] grid h-20 w-20 -translate-x-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_28%_24%,#ffe8a4,#bd7c31_48%,#5b2b18)] text-[#2a170e] shadow-[0_18px_42px_rgba(0,0,0,.34)]">
          <span className="font-display text-3xl">DA</span>
          <span className="absolute inset-2 rounded-full border border-[#2a170e]/25" />
        </div>
      </div>
    </div>
  );
}

function InvitationPaper({
  brideName,
  groomName,
  date,
  venue,
  message,
  initials,
  isOpen,
  revealDelay,
  motionDuration
}: {
  brideName: string;
  groomName: string;
  date: string;
  venue: string;
  message: string;
  initials: string;
  isOpen: boolean;
  revealDelay: number;
  motionDuration: number;
}) {
  return (
    <motion.div
      variants={{
        closed: { opacity: 0.08, y: 34, scale: 0.955, rotateX: 4 },
        open: { opacity: 1, y: -18, scale: 1, rotateX: 0 }
      }}
      transition={{ duration: motionDuration, delay: isOpen ? 0.18 : 0, ease: [0.2, 0.82, 0.18, 1] }}
      className="absolute left-[82px] top-[82px] z-20 h-[456px] w-[276px] overflow-hidden bg-[#fbf2df] p-7 text-center text-[#1f1710] shadow-[0_34px_82px_rgba(0,0,0,.28),inset_0_0_0_1px_rgba(95,57,22,.12),inset_0_18px_28px_rgba(255,255,255,.34)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <PaperFibers />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.38),transparent_34%,rgba(113,76,32,.08)_70%,transparent)]" />
      <div className="absolute inset-4 border border-[#b8894b]/52" />
      <div className="absolute inset-6 border border-[#b8894b]/20" />
      <div className="absolute inset-x-10 top-8 h-px bg-[#d6aa5d]/28" />
      <div className="absolute inset-x-10 bottom-8 h-px bg-[#d6aa5d]/28" />
      <CornerOrnaments />
      <motion.div
        animate={isOpen ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 10, filter: "blur(2px)" }}
        transition={{ duration: motionDuration * 0.72, delay: isOpen ? revealDelay : 0, ease: [0.2, 0.82, 0.18, 1] }}
        className="relative z-10 flex h-full flex-col items-center justify-center"
      >
        <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#9b7330]">Domus Aurea</p>
        <Laurel initials={initials} />
        <h2 className="mt-4 bg-[linear-gradient(110deg,#7a4c1e,#d2a85c_38%,#8b5e29_72%)] bg-clip-text font-display text-[2.45rem] leading-[1.05] text-transparent">
          {brideName}
          <span className="block py-1 text-base text-[#b8894b]">و</span>
          {groomName}
        </h2>
        <p className="mt-4 max-w-[220px] text-[11px] leading-5 text-[#423329]/76">{message}</p>
        <div className="my-4 h-px w-24 bg-[linear-gradient(90deg,transparent,#b8894b,transparent)]" />
        <p className="text-[10px] font-bold uppercase leading-5 tracking-[0.12em] text-[#2f251e]/78">{date}</p>
        <p className="mt-3 font-display text-2xl leading-tight text-[#9b7330]">{venue}</p>
      </motion.div>
    </motion.div>
  );
}

function AmbientGoldDust() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden opacity-70 sm:block" aria-hidden="true">
      {Array.from({ length: 11 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-[#e2bd69] shadow-[0_0_16px_rgba(226,189,105,.75)]"
          style={{
            left: `${12 + ((index * 17) % 76)}%`,
            top: `${10 + ((index * 23) % 72)}%`
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.16, 0.58, 0.16],
            scale: [0.75, 1.15, 0.75]
          }}
          transition={{
            duration: 7 + index * 0.38,
            delay: index * 0.32,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

function EnvelopeLowerFlap() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      <div className="absolute inset-x-8 bottom-0 h-[47%] origin-bottom rounded-t-[42%] bg-[linear-gradient(180deg,rgba(255,255,255,.06),rgba(0,0,0,.18)),radial-gradient(circle_at_50%_0%,rgba(229,196,121,.16),transparent_58%)] shadow-[inset_0_18px_34px_rgba(255,255,255,.04),inset_0_-24px_44px_rgba(0,0,0,.22)]" />
      <div className="absolute bottom-[47%] left-1/2 h-px w-[72%] -translate-x-1/2 bg-[#d9b66f]/24" />
    </div>
  );
}

function PaperFibers() {
  return (
    <>
      <div className="absolute inset-0 opacity-[.2] [background-image:radial-gradient(circle_at_9px_9px,rgba(104,74,38,.32)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-0 opacity-[.16] [background-image:repeating-linear-gradient(98deg,rgba(92,67,36,.2)_0_1px,transparent_1px_9px),repeating-linear-gradient(7deg,rgba(255,255,255,.55)_0_1px,transparent_1px_14px)]" />
    </>
  );
}

function LuxuryTableSurface() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#d8c8ae,#f4ead8_38%,#c7ae88_70%,#eadcc7)]" />
      <div className="absolute inset-0 opacity-[.3] [background-image:linear-gradient(110deg,rgba(255,255,255,.45)_0_10%,transparent_10%_28%,rgba(80,50,21,.16)_28%_30%,transparent_30%_100%),repeating-linear-gradient(8deg,rgba(101,71,36,.18)_0_1px,transparent_1px_18px)] [background-size:420px_100%,100%_100%]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_28%,rgba(255,255,255,.52),transparent_25%),radial-gradient(circle_at_78%_82%,rgba(72,39,16,.18),transparent_34%)]" />
    </>
  );
}

function EmeraldMaterial() {
  return (
    <>
      <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_25%_18%,rgba(255,255,255,.1),transparent_28%),linear-gradient(135deg,#0a3028,#041411_58%,#09251f)]" />
      <div className="absolute inset-0 rounded-[inherit] opacity-[.17] [background-image:radial-gradient(circle_at_8px_8px,rgba(255,255,255,.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.24)_1px,transparent_1px)] [background-size:24px_24px,34px_100%]" />
      <div className="absolute inset-3 rounded-[.9rem] border border-[#d7b56c]/35" />
    </>
  );
}

function GatePanel({ side }: { side: "left" | "right" }) {
  const flipped = side === "right";
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-[#08241e] shadow-[inset_0_0_28px_rgba(255,255,255,.04)]">
      <EmeraldMaterial />
      <svg className={`absolute inset-0 h-full w-full ${flipped ? "-scale-x-100" : ""}`} viewBox="0 0 184 504" aria-hidden="true">
        <g fill="#03100d" opacity=".78">
          {Array.from({ length: 13 }).map((_, index) => (
            <path
              key={index}
              d={`M${68 + (index % 2) * 12} ${34 + index * 34} C${30 + (index % 3) * 8} ${62 + index * 31}, ${28 + (index % 2) * 15} ${96 + index * 31}, ${66 + (index % 2) * 18} ${126 + index * 29} C${86 + (index % 2) * 8} ${90 + index * 31}, ${112 + (index % 2) * 7} ${76 + index * 30}, ${146} ${58 + index * 31} C${132} ${112 + index * 29}, ${96 + (index % 2) * 10} ${116 + index * 29}, ${68 + (index % 2) * 12} ${34 + index * 34}Z`}
            />
          ))}
        </g>
        <g fill="none" stroke="#183f35" strokeLinecap="round" strokeWidth="4" opacity=".94">
          <path d="M92 18 C62 104 120 166 76 252 C42 320 72 408 38 486" />
          <path d="M92 18 C124 94 94 154 140 230 C174 288 142 386 170 486" />
          {Array.from({ length: 11 }).map((_, index) => (
            <path key={index} d={`M${76 + (index % 2) * 34} ${56 + index * 38} q${index % 2 ? 34 : -42} ${20 + index} ${index % 2 ? 68 : -72} ${52 + index}`} />
          ))}
        </g>
      </svg>
      <div className={`absolute inset-y-0 w-5 bg-[linear-gradient(90deg,rgba(0,0,0,.36),rgba(255,255,255,.07),rgba(0,0,0,.18))] ${side === "left" ? "left-0" : "right-0"}`} />
    </div>
  );
}

function WaxSeal({ initials }: { initials: string }) {
  return (
    <div className="relative grid h-full w-full place-items-center rounded-full bg-[radial-gradient(circle_at_28%_24%,#ffe6a5,#c8893b_42%,#683219_82%)] text-[#2f190f] shadow-[0_22px_48px_rgba(0,0,0,.38),inset_10px_10px_22px_rgba(255,255,255,.18),inset_-12px_-14px_24px_rgba(0,0,0,.22)]">
      <span className="font-display text-5xl">{initials}</span>
      <span className="absolute inset-3 rounded-full border border-[#2f190f]/24" />
      <span className="absolute inset-6 rounded-full border border-[#2f190f]/16" />
      <span className="absolute left-2 top-7 h-4 w-5 rounded-full bg-white/18 blur-[1px]" />
    </div>
  );
}

function Laurel({ initials }: { initials: string }) {
  return (
    <div className="relative mt-4 grid h-20 w-24 place-items-center">
      <svg viewBox="0 0 130 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g fill="none" stroke="#b8894b" strokeLinecap="round" strokeWidth="1.8">
          <path d="M45 84 C18 62 20 30 52 14" />
          <path d="M85 84 C112 62 110 30 78 14" />
          {Array.from({ length: 7 }).map((_, index) => (
            <path key={index} d={`M${44 - index * 2} ${76 - index * 8} q-15 -5 -21 -17 q14 2 21 17Z`} />
          ))}
          {Array.from({ length: 7 }).map((_, index) => (
            <path key={`r-${index}`} d={`M${86 + index * 2} ${76 - index * 8} q15 -5 21 -17 q-14 2 -21 17Z`} />
          ))}
        </g>
      </svg>
      <span className="font-display text-3xl text-[#9b7330]">{initials}</span>
    </div>
  );
}

function CornerOrnaments() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 276 456" aria-hidden="true">
      <g fill="none" stroke="#b8894b" strokeLinecap="round" strokeWidth="1.4" opacity=".58">
        <path d="M34 54 C34 34 48 30 62 30" />
        <path d="M34 54 C48 48 50 38 50 30" />
        <path d="M242 54 C242 34 228 30 214 30" />
        <path d="M242 54 C228 48 226 38 226 30" />
        <path d="M34 402 C34 422 48 426 62 426" />
        <path d="M34 402 C48 408 50 418 50 426" />
        <path d="M242 402 C242 422 228 426 214 426" />
        <path d="M242 402 C228 408 226 418 226 426" />
      </g>
    </svg>
  );
}
