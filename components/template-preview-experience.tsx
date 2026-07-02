"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";

export type TemplatePreviewSample = {
  brideName: string;
  groomName: string;
  date: string;
  venue: string;
  message?: string;
  musicSrc?: string;
  sealImageUrl?: string;
};

type TemplatePreviewModalProps = {
  isOpen: boolean;
  templateName: string;
  onClose: () => void;
  sample?: TemplatePreviewSample;
};

const launchPreviewVideo = "/invitation/intro-opening.mp4";
const launchPreviewPoster = "/invitation/closed-invitation.png";

function isLaunchTemplateName(templateName: string) {
  return ["test", "test invitation", "domus aurea invitation"].includes(templateName.toLowerCase());
}

export function TemplatePreviewModal({ isOpen, templateName, onClose }: TemplatePreviewModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isLaunchTemplate = isLaunchTemplateName(templateName);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] overflow-y-auto bg-[#fff6f2]/94 px-4 py-5 text-[#432819] backdrop-blur-xl md:px-8"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={onClose}
            className="fixed right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-[#d9a681]/30 bg-white/65 text-[#432819] backdrop-blur-xl transition hover:bg-[#f2c4c0]"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.55, ease: [0.2, 0.82, 0.18, 1] }}
            className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl content-center gap-7 py-12"
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b77a5a]">
                {isLaunchTemplate ? "Launch-ready template" : "Under development"}
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                {isLaunchTemplate ? "Domus Aurea Invitation" : templateName}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#6e4a35]/70">
                {isLaunchTemplate
                  ? "Luxury floral wedding invitation with the real wax seal opening animation."
                  : "This template is still under development and is not available for selection yet."}
              </p>
            </div>

            {isLaunchTemplate ? (
              <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-[2rem] border border-[#d9a681]/35 bg-[#fff0ea] p-3 shadow-[0_36px_110px_rgba(145,78,61,.24)]">
                <video
                  src={launchPreviewVideo}
                  poster={launchPreviewPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls={false}
                  className="block aspect-[853/1280] w-full rounded-[1.45rem] bg-[#f9e5dc] object-contain"
                  aria-label="Domus Aurea invitation opening preview"
                />
              </div>
            ) : (
              <div className="mx-auto grid min-h-[420px] w-full max-w-3xl place-items-center rounded-[2rem] border border-[#d9a681]/26 bg-white/60 p-8 text-center shadow-[0_36px_120px_rgba(173,99,82,.16)]">
                <div>
                  <span className="mx-auto block h-px w-24 bg-[#b77a5a]/70" />
                  <p className="mt-6 font-display text-4xl">Coming Soon</p>
                  <p className="mt-3 text-[#6e4a35]/62">Under Development</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function PlayPreviewButton({ onClick, isArabic, disabled = false }: { onClick: () => void; isArabic: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full border border-[#d8b15f]/40 bg-black/35 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_40px_rgba(0,0,0,.18)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#f0cf84] hover:bg-[#d8b15f] hover:text-[#120d08] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/45 disabled:hover:translate-y-0"
    >
      <Play className="h-4 w-4" />
      {isArabic ? "تشغيل المعاينة" : "Play Preview"}
    </button>
  );
}
