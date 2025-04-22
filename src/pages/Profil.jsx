import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import styles from "./profil.module.css";

export default function Profil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <p className={styles.info}>Nicht eingeloggt.</p>;
  }

  return (
    <div className={styles.container}>
      <h2>👤 Profil</h2>
      <p>Angemeldet als: <strong>{user.username}</strong></p>
      <button onClick={handleLogout}>Abmelden</button>
    </div>
  );
}
