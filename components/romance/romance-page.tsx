import { RomanceHero } from "./romance-hero";
import styles from "./romance.module.css";

export function RomancePage() {
  return (
    <main className={styles.page}>
      <RomanceHero />
    </main>
  );
}
