import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import styles from "./Header.module.css";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <nav className={styles.navLinks}>
          <Link to="/">Startseite</Link>
          <Link to="/guess">Guess the Rank</Link>
          <Link to="/leaderboard" className={styles.navLink}>Leaderboard</Link>
          {user && <Link to="/admin">Admin Tools</Link>}
        </nav>
        
        {user ? (
          <Link to="/profil" className={styles.username}>
            {user.username}
          </Link>
        ) : (
          <Link to="/login" className={styles.profileIcon}>
            <FaUserCircle />
          </Link>
        )}
      </div>
    </header>
  );
}
