import { useState } from "react";
import { supabase } from "../supabase";
import "./upload.css";

export default function Upload() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [status, setStatus] = useState("");

  const isValidYouTubeUrl = (url) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}/.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url || !name || !rank) {
      setStatus("Bitte alle Felder ausfüllen.");
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setStatus("Bitte gib einen gültigen YouTube-Link an.");
      return;
    }

    const { error } = await supabase
      .from("clips")
      .insert([{ url, name, rank }]);

    if (error) {
      setStatus("Fehler beim Speichern der Clip-Daten.");
    } else {
      setStatus("🎉 Clip erfolgreich eingetragen!");
      setUrl("");
      setName("");
      setRank("");
    }
  };

  return (
    <div className="upload-container">
      <h2>🎥 YouTube-Clip einreichen</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="text"
          placeholder="YouTube-Link (z. B. https://youtu.be/xyz12345678)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name / Einsender"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rank (z. B. Gold, Immortal...)"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        />
        <button type="submit">Absenden</button>
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}
