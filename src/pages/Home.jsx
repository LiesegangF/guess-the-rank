import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={`${styles.container} ${styles.withHeaderOffset}`}>
      <h1 className={styles.title}>Guess the Rank</h1>
      <p className={styles.description}>
        Zuschauer laden Clips hoch – du versuchst zu erraten, welchen Rang sie haben.
        Es gibt 3 Punkte wenn du den exakt richtigen Rank erratest. 1 Punkt gibt es wenn du nur einen Rank daneben ist.
      </p>
    </div>
  );
}
