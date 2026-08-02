import type { Metadata } from "next";
import { ApologyEditor } from "@/components/apology/apology-editor";

export const metadata: Metadata = {
  title: "محرر الاعتذار | Domus Aurea",
  description: "صمّم رسالة اعتذار تفاعلية بمعاينة مباشرة."
};

export default function ApologyEditorPage() {
  return <ApologyEditor />;
}
