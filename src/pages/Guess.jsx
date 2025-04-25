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

const rankImages = rankOrder.map((name) => ({
  name,
  src: `/ranks/${name.replace(" ", "_")}_Rank.png`
}));

export default function Guess() {
  const { user } = useAuth();
  const [guestName, setGuestName] = useState("");
  const [validatedGuest, setValidatedGuest] = useState(null);
  const [guestError, setGuestError] = useState("");
  const [allClips, setAllClips] = useState([]);
  const [clips, setClips] = useState([]);
  const [answeredClips, setAnsweredClips] = useState([]);
  const [currentClip, setCurrentClip] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(null);

  const username = user?.username || validatedGuest?.username;

  useEffect(() => {
    async function fetchClips() {
      const { data: all } = await getClips();
      setAllClips(all);
      setClips(all);
      setCurrentClip(all[Math.floor(Math.random() * all.length)] || null);
    }

    async function fetchUserAnswers() {
      if (!username) return;
      const { data: answers } = await supabase
        .from("clip_answers")
        .select("clip_id, points")
        .eq("username", username);

      const ids = answers?.map((a) => a.clip_id) || [];
      const points = answers?.reduce((sum, a) => sum + (a.points || 0), 0) || 0;

      setAnsweredClips(ids);
      setTotalPoints(points);
      setClips((prev) => prev.filter((clip) => !ids.includes(clip.id)));
      setCurrentClip((prev) =>
        prev && !ids.includes(prev.id)
          ? prev
          : clips.length > 0
          ? clips[0]
          : null
      );
    }

    fetchClips().then(fetchUserAnswers);
  }, [username]);

  const handleSelectRank = (rankName) => {
    if (!reveal) setSelectedRank(rankName);
  };

  const handleNext = async () => {
    if (!currentClip) return;
    const points = calculatePoints(selectedRank, currentClip.rank);

    const { error } = await supabase.from("clip_answers").insert([
      {
        username,
        clip_id: currentClip.id,
        guessed_rank: selectedRank,
        correct_rank: currentClip.rank,
        is_correct: selectedRank === currentClip.rank,
        points,
      },
    ]);

    if (error) {
      console.error("Fehler beim Speichern:", error.message);
      alert("Antwort konnte nicht gespeichert werden: " + error.message);
      return;
    }

    const newAnswered = [...answeredClips, currentClip.id];
    setAnsweredClips(newAnswered);
    setTotalPoints((prev) => prev + points);

    const remaining = clips.filter((clip) => clip.id !== currentClip.id);
    setClips(remaining);
    setCurrentClip(
      remaining[Math.floor(Math.random() * remaining.length)] || null
    );
    setSelectedRank(null);
    setReveal(false);
    setCurrentPoints(null);
  };

  const handleGuestLogin = async () => {
    if (!guestName) return;

    const trimmedName = guestName.trim().toLowerCase();

    const { data: existingUser } = await supabase
      .from("users")
      .select("username")
      .eq("username", trimmedName)
      .single();

    if (existingUser) {
      setGuestError("Dieser Benutzername ist bereits vergeben.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .insert([{ username: trimmedName }]);

    if (error) {
      console.error(error);
      setGuestError("Fehler beim Erstellen des Benutzers.");
    } else {
      setValidatedGuest({ username: trimmedName });
      setGuestError("");
    }
  };

  const progressPercent =
    allClips.length > 0
      ? (answeredClips.length / allClips.length) * 100
      : 0;

  if (!user && !validatedGuest) {
    return (
      <div className={styles.guestLoginPage}>
        <h2>Guess The Rank</h2>
        <p>Bitte gib deinen gewünschten Benutzernamen ein:</p>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Benutzername"
        />
        <button onClick={handleGuestLogin}>Loslegen</button>
        {guestError && <p>{guestError}</p>}
      </div>
    );
  }

  if (clips.length === 0 && allClips.length > 0) {
    return (
      <div className={styles.guessPage}>
        <h1>Alle Clips bewertet!</h1>
        <p>Du hast {totalPoints} Punkte erreicht.</p>
        <button
          className={styles.resetButton}
          onClick={async () => {
            await supabase
              .from("clip_answers")
              .delete()
              .eq("username", username);
            window.location.reload();
          }}
        >
          Zurücksetzen
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
        {answeredClips.length} von {allClips.length} Clips bewertet –{" "}
        {totalPoints} Punkte
      </p>

      {currentClip && (
        <>
          <div className={styles.clipAndResult}>
            <div className={styles.clipWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(
                  currentClip.url
                )}`}
                title="Clip"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>

            {reveal && (
              <div className={styles.resultColumn}>
                <div className={styles.resultImageBox}>
                  <p>Deine Wahl:</p>
                  <img
                    src={`/ranks/${selectedRank.replace(" ", "_")}_Rank.png`}
                    alt="Deine Wahl"
                    className={styles.resultImage}
                  />
                </div>
                <div className={styles.resultImageBox}>
                  <p>Richtig war:</p>
                  <img
                    src={`/ranks/${currentClip.rank.replace(" ", "_")}_Rank.png`}
                    alt="Richtig"
                    className={styles.resultImage}
                  />
                </div>
                {(currentClip.name || currentPoints !== null) && (
                  <p className={styles.resultMeta}>
                    Name des Einsenders: <strong>{currentClip.name}</strong>
                    {currentPoints !== null && (
                      <>
                        {" "}
                        · Du hast <strong>{currentPoints}</strong>{" "}
                        {currentPoints === 1 ? "Punkt" : "Punkte"} erzielt.
                      </>
                    )}
                  </p>
                )}
              </div>
            )}
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
              onClick={() => {
                setReveal(true);
                setCurrentPoints(
                  calculatePoints(selectedRank, currentClip.rank)
                );
              }}
            >
              Rank Reveal
            </button>
          )}

          {reveal && (
            <div className={styles.nextButtonWrapper}>
              <button className={styles.nextButton} onClick={handleNext}>
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
