import { useEffect, useState } from "react";
import { getClips, supabase } from "../supabase";
import styles from "./Guess.module.css";
import React from "react";
import { useAuth } from "../auth/AuthContext";

const rankOrder = [
  "Iron 1", "Iron 2", "Iron 3", "Bronze 1", "Bronze 2", "Bronze 3",
  "Silver 1", "Silver 2", "Silver 3", "Gold 1", "Gold 2", "Gold 3",
  "Platinum 1", "Platinum 2", "Platinum 3", "Diamond 1", "Diamond 2", "Diamond 3",
  "Ascendant 1", "Ascendant 2", "Ascendant 3", "Immortal 1", "Immortal 2", "Immortal 3",
  "Radiant"
];

const calculatePoints = (guess, correct) => {
  const diff = Math.abs(rankOrder.indexOf(guess) - rankOrder.indexOf(correct));
  if (diff === 0) return 3;
  if (diff === 1) return 1;
  return 0;
};

const rankImages = [
  { name: "Iron 1", src: "/ranks/Iron_1_Rank.png" },
  { name: "Iron 2", src: "/ranks/Iron_2_Rank.png" },
  { name: "Iron 3", src: "/ranks/Iron_3_Rank.png" },
  { name: "Bronze 1", src: "/ranks/Bronze_1_Rank.png" },
  { name: "Bronze 2", src: "/ranks/Bronze_2_Rank.png" },
  { name: "Bronze 3", src: "/ranks/Bronze_3_Rank.png" },
  { name: "Silver 1", src: "/ranks/Silver_1_Rank.png" },
  { name: "Silver 2", src: "/ranks/Silver_2_Rank.png" },
  { name: "Silver 3", src: "/ranks/Silver_3_Rank.png" },
  { name: "Gold 1", src: "/ranks/Gold_1_Rank.png" },
  { name: "Gold 2", src: "/ranks/Gold_2_Rank.png" },
  { name: "Gold 3", src: "/ranks/Gold_3_Rank.png" },
  { name: "Platinum 1", src: "/ranks/Platinum_1_Rank.png" },
  { name: "Platinum 2", src: "/ranks/Platinum_2_Rank.png" },
  { name: "Platinum 3", src: "/ranks/Platinum_3_Rank.png" },
  { name: "Diamond 1", src: "/ranks/Diamond_1_Rank.png" },
  { name: "Diamond 2", src: "/ranks/Diamond_2_Rank.png" },
  { name: "Diamond 3", src: "/ranks/Diamond_3_Rank.png" },
  { name: "Ascendant 1", src: "/ranks/Ascendant_1_Rank.png" },
  { name: "Ascendant 2", src: "/ranks/Ascendant_2_Rank.png" },
  { name: "Ascendant 3", src: "/ranks/Ascendant_3_Rank.png" },
  { name: "Immortal 1", src: "/ranks/Immortal_1_Rank.png" },
  { name: "Immortal 2", src: "/ranks/Immortal_2_Rank.png" },
  { name: "Immortal 3", src: "/ranks/Immortal_3_Rank.png" },
  { name: "Radiant", src: "/ranks/Radiant_Rank.png" },
];

export default function Guess() {
  const { user } = useAuth();
  const [allClips, setAllClips] = useState([]);
  const [clips, setClips] = useState([]);
  const [answeredClips, setAnsweredClips] = useState([]);
  const [currentClip, setCurrentClip] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function fetchClipsAndAnswers() {
      const { data: all } = await getClips();
      const { data: answers } = await supabase
        .from("clip_answers")
        .select("clip_id, points")
        .eq("username", user.username);

      const answeredIds = answers ? answers.map((a) => a.clip_id) : [];
      const pointsSum = answers ? answers.reduce((sum, a) => sum + (a.points || 0), 0) : 0;
      const remaining = all.filter((clip) => !answeredIds.includes(clip.id));

      setAllClips(all);
      setAnsweredClips(answeredIds);
      setTotalPoints(pointsSum);
      setClips(remaining);
      setCurrentClip(
        remaining[Math.floor(Math.random() * remaining.length)] || null
      );
    }

    fetchClipsAndAnswers();
  }, [user]);

  const handleSelectRank = (rankName) => {
    if (!reveal) {
      setSelectedRank(rankName);
    }
  };

  const handleNext = async () => {
    if (!user || !currentClip) return;
  
    const points = calculatePoints(selectedRank, currentClip.rank);
  
    const { error } = await supabase.from("clip_answers").insert([
      {
        username: user.username,
        clip_id: currentClip.id,
        guessed_rank: selectedRank,
        correct_rank: currentClip.rank,
        is_correct: selectedRank === currentClip.rank,
        points,
      },
    ]);
  
    if (error) {
      console.error("Fehler beim Speichern in Supabase:", error.message);
      alert("Antwort konnte nicht gespeichert werden: " + error.message);
      return;
    }
  
    const newAnswered = [...answeredClips, currentClip.id];
    setAnsweredClips(newAnswered);
    setTotalPoints((prev) => prev + points);
  
    const remainingClips = clips.filter((clip) => clip.id !== currentClip.id);
    setClips(remainingClips);
    setCurrentClip(
      remainingClips[Math.floor(Math.random() * remainingClips.length)] || null
    );
    setSelectedRank(null);
    setReveal(false);
  };
  

  const handleReset = async () => {
    await supabase.from("clip_answers").delete().eq("username", user.username);
    setAnsweredClips([]);
    setTotalPoints(0);
    window.location.reload();
  };

  const progressPercent =
    allClips.length > 0
      ? (answeredClips.length / allClips.length) * 100
      : 0;

  if (
    allClips.length > 0 &&
    answeredClips.length === allClips.length &&
    !currentClip
  ) {
    return (
      <div className={styles.guessPage}>
        <h1>🎉 Runde abgeschlossen!</h1>
        <p>Du hast alle {allClips.length} Clips bewertet.</p>
        <p>Gesamtpunktzahl: {totalPoints} Punkte</p>
        <button onClick={handleReset} className={styles.nextButton}>
          Runde zurücksetzen
        </button>
      </div>
    );
  }

  return (
    <div className={styles.guessPage}>
      <h1>Buchers Guess The Rank</h1>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <p className={styles.progressText}>
        {answeredClips.length} von {allClips.length} Clips bewertet – {totalPoints} Punkte
      </p>

      {currentClip && (
        <>
          <div className={styles.clipAndChat}>
  <div className={styles.clipWrapper}>
    <iframe
      src={`https://www.youtube.com/embed/${extractYouTubeId(currentClip.url)}`}
      title="Clip"
      frameBorder="0"
      allowFullScreen
    ></iframe>
  </div>

  <div className={styles.chatWrapper}>
    <iframe
      src="https://www.twitch.tv/embed/bucher/chat?darkpopout"
      frameBorder="0"
      scrolling="no"
      height="360"
      width="350"
      title="Twitch Chat"
    ></iframe>
  </div>
</div>


          <div className={styles.rankGrid}>
            {rankImages.map((rank) => (
              <React.Fragment key={rank.name}>
                {rank.name === "Ascendant 1" && (
                  <div className={styles.lineBreak}></div>
                )}
                <img
                  src={rank.src}
                  alt={rank.name}
                  className={`${styles.rankImage} ${
                    selectedRank === rank.name ? styles.selected : ""
                  }`}
                  onClick={() => handleSelectRank(rank.name)}
                />
              </React.Fragment>
            ))}
          </div>

          {selectedRank && !reveal && (
            <button
              className={styles.revealButton}
              onClick={() => setReveal(true)}
            >
              Rank Reveal
            </button>
          )}

          {reveal && (
            <div className={styles.resultBox}>
              <p>
                Du hast <strong>{selectedRank}</strong> gewählt.<br />
                Richtig war: <strong>{currentClip.rank}</strong>
              </p>
              <button onClick={handleNext} className={styles.nextButton}>
                Nächster Clip
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function extractYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : "";
}
