import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <nav className={styles.navLinks}>
          <Link to="/">Startseite</Link>
          <Link to="/guess">Guess the Rank</Link>
          <Link to="/admin">Admin Tools</Link>
        </nav>
        <Link to="/login" className={styles.profileIcon}>
          <FaUserCircle />
        </Link>
      </div>
    </header>
  );
}