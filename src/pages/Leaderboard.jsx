import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import styles from "./Leaderboard.module.css";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from("clip_answers")
        .select("username, points")
        .order("points", { ascending: false });

      if (!error && data) {
        const grouped = data.reduce((acc, entry) => {
          const existing = acc.find((u) => u.username === entry.username);
          if (existing) {
            existing.points += entry.points;
          } else {
            acc.push({ username: entry.username, points: entry.points });
          }
          return acc;
        }, []);
        setScores(grouped.sort((a, b) => b.points - a.points));
      }
    };

    fetchScores();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Leaderboard</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Platz</th>
            <th>Benutzername</th>
            <th>Punkte</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((user, index) => (
            <tr key={user.username}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
