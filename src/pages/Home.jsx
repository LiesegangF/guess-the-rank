import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={`${styles.container} ${styles.withHeaderOffset}`}>
      <h1 className={styles.title}>🎮 Guess the Rank</h1>
      <p className={styles.description}>
        Zuschauer laden Clips hoch – du versuchst zu erraten, welchen Rang sie haben.
        Je genauer du triffst, desto mehr Punkte bekommst du!
      </p>
    </div>
  );
}
