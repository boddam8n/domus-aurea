"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  Copy,
  ExternalLink,
  Move,
  RotateCcw,
  Save,
  Sparkles
} from "lucide-react";
import {
  ApologyConfig,
  apologyConfigSchema,
  apologyFontLabels,
  defaultApologyConfig
} from "@/lib/apology-config";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ApologyExperience } from "./apology-experience";
import styles from "./apology-editor.module.css";

const colorSwatches = ["#fff0cf", "#ffd778", "#ff9fba", "#9ff2e5", "#ffffff", "#241b32"];

export function ApologyEditor() {
  const router = useRouter();
  const [config, setConfig] = useState<ApologyConfig>(defaultApologyConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [copied, setCopied] = useState(false);

  function update<K extends keyof ApologyConfig>(key: K, value: ApologyConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
    setPublicUrl("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const parsed = apologyConfigSchema.safeParse(config);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message;
      setError(firstIssue || "راجع إعدادات الرسالة قبل الحفظ.");
      return;
    }

    setSaving(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth/sign-in?next=/apology/editor");
        return;
      }

      const response = await fetch("/api/apologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`
        },
        body: JSON.stringify({ config: parsed.data })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "لم نتمكن من حفظ تجربة الاعتذار.");
      setPublicUrl(result.publicUrl);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "حدث خطأ غير متوقع.");
    } finally {
      setSaving(false);
    }
  }

  async function copyLink() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className={styles.page} dir="rtl">
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Domus Aurea">DA</Link>
        <div>
          <p>DOMUS AUREA · APOLOGY STUDIO</p>
          <h1>محرر الاعتذار</h1>
        </div>
        <Link href="/apology" className={styles.previewLink}>
          عرض التجربة
          <ExternalLink aria-hidden="true" />
        </Link>
      </header>

      <form onSubmit={save} className={styles.workspace}>
        <div className={styles.controls}>
          <section className={styles.controlSection}>
            <SectionHeading number="01" title="الرسالة" />
            <label className={styles.field}>
              <span>نص الاعتذار</span>
              <textarea
                value={config.message}
                onChange={(event) => update("message", event.target.value.slice(0, 1200))}
                rows={7}
                dir={config.language === "ar" ? "rtl" : "ltr"}
                placeholder="اكتب رسالتك هنا..."
              />
              <small>{Array.from(config.message).length} / 1200</small>
            </label>

            <div className={styles.segmented} aria-label="لغة الرسالة">
              <button type="button" className={config.language === "ar" ? styles.activeSegment : ""} onClick={() => update("language", "ar")}>عربي</button>
              <button type="button" className={config.language === "en" ? styles.activeSegment : ""} onClick={() => update("language", "en")}>English</button>
            </div>
          </section>

          <section className={styles.controlSection}>
            <SectionHeading number="02" title="الخط والتنسيق" />
            <div className={styles.twoColumns}>
              <label className={styles.field}>
                <span>نوع الخط</span>
                <select value={config.fontFamily} onChange={(event) => update("fontFamily", event.target.value as ApologyConfig["fontFamily"])}>
                  {Object.entries(apologyFontLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label.ar} · {label.en}</option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span>لون النص</span>
                <span className={styles.colorPicker}>
                  <input type="color" value={config.textColor} onChange={(event) => update("textColor", event.target.value)} />
                  <code>{config.textColor.toUpperCase()}</code>
                </span>
              </label>
            </div>
            <div className={styles.swatches} aria-label="ألوان مقترحة">
              {colorSwatches.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`اختيار ${color}`}
                  aria-pressed={config.textColor === color}
                  className={config.textColor === color ? styles.selectedSwatch : ""}
                  style={{ background: color }}
                  onClick={() => update("textColor", color)}
                />
              ))}
            </div>
            <RangeControl label="حجم الخط" value={config.fontSize} min={14} max={34} unit="px" onChange={(value) => update("fontSize", value)} />
            <RangeControl label="تباعد السطور" value={config.lineSpacing} min={1.25} max={2.4} step={0.05} onChange={(value) => update("lineSpacing", value)} />
            <div className={styles.alignment} aria-label="محاذاة النص">
              <button type="button" aria-label="يمين" className={config.textAlignment === "start" ? styles.activeAlignment : ""} onClick={() => update("textAlignment", "start")}><AlignRight /></button>
              <button type="button" aria-label="وسط" className={config.textAlignment === "center" ? styles.activeAlignment : ""} onClick={() => update("textAlignment", "center")}><AlignCenter /></button>
              <button type="button" aria-label="يسار" className={config.textAlignment === "end" ? styles.activeAlignment : ""} onClick={() => update("textAlignment", "end")}><AlignLeft /></button>
            </div>
          </section>

          <section className={styles.controlSection}>
            <SectionHeading number="03" title="المقاسات والمواقع" icon={<Move />} />
            <RangeControl label="عرض اللوحة" value={config.boardWidth} min={72} max={100} unit="%" onChange={(value) => update("boardWidth", value)} />
            <RangeControl label="أقل ارتفاع للوحة" value={config.boardHeight} min={180} max={520} unit="px" onChange={(value) => update("boardHeight", value)} />
            <PositionControl label="موضع اللوحة" x={config.boardX} y={config.boardY} onX={(value) => update("boardX", value)} onY={(value) => update("boardY", value)} />
            <PositionControl label="موضع ايوه" x={config.yesX} y={config.yesY} onX={(value) => update("yesX", value)} onY={(value) => update("yesY", value)} />
            <PositionControl label="موضع علامة لا" x={config.noX} y={config.noY} onX={(value) => update("noX", value)} onY={(value) => update("noY", value)} />
            <PositionControl label="موضع شيتوس" x={config.catX} y={config.catY} onX={(value) => update("catX", value)} onY={(value) => update("catY", value)} />
          </section>

          <section className={styles.controlSection}>
            <SectionHeading number="04" title="الأجواء" icon={<Sparkles />} />
            <Toggle label="الزينة والأسهم المتحركة" checked={config.decorationsEnabled} onChange={(value) => update("decorationsEnabled", value)} />
            <Toggle label="موسيقى الخلفية" checked={config.musicEnabled} onChange={(value) => update("musicEnabled", value)} />
            <Toggle label="مؤثرات شيتوس والأزرار" checked={config.soundEffectsEnabled} onChange={(value) => update("soundEffectsEnabled", value)} />
          </section>

          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <div className={styles.actions}>
            <button type="submit" className={styles.saveButton} disabled={saving}>
              <Save aria-hidden="true" />
              {saving ? "جاري الحفظ..." : "حفظ وإنشاء الرابط"}
            </button>
            <button type="button" className={styles.resetButton} onClick={() => setConfig(defaultApologyConfig)}>
              <RotateCcw aria-hidden="true" />
              إعادة الضبط
            </button>
          </div>

          {publicUrl ? (
            <div className={styles.success}>
              <p><Check aria-hidden="true" /> تم إنشاء التجربة</p>
              <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a>
              <button type="button" onClick={copyLink}><Copy aria-hidden="true" />{copied ? "تم النسخ" : "نسخ الرابط"}</button>
            </div>
          ) : null}
        </div>

        <aside className={styles.previewPane} aria-label="المعاينة المباشرة">
          <div className={styles.previewHeading}>
            <div>
              <span>LIVE PREVIEW</span>
              <h2>المشهد النهائي</h2>
            </div>
            <i aria-hidden="true" />
          </div>
          <div className={styles.previewViewport}>
            <ApologyExperience initialConfig={config} previewMode />
          </div>
          <p className={styles.previewNote}>المعاينة تستخدم نفس المكوّن الذي يظهر في الرابط العام.</p>
        </aside>
      </form>
    </main>
  );
}

function SectionHeading({ number, title, icon }: { number: string; title: string; icon?: ReactNode }) {
  return (
    <div className={styles.sectionHeading}>
      <span>{number}</span>
      <h2>{title}</h2>
      {icon ? <i aria-hidden="true">{icon}</i> : null}
    </div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.rangeField}>
      <span><b>{label}</b><output>{value}{unit}</output></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function PositionControl({
  label,
  x,
  y,
  onX,
  onY
}: {
  label: string;
  x: number;
  y: number;
  onX: (value: number) => void;
  onY: (value: number) => void;
}) {
  return (
    <div className={styles.positionField}>
      <strong>{label}</strong>
      <RangeControl label="أفقي" value={x} min={-70} max={70} unit="px" onChange={onX} />
      <RangeControl label="رأسي" value={y} min={-70} max={70} unit="px" onChange={onY} />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className={styles.toggle}>
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true"><span /></i>
    </label>
  );
}
