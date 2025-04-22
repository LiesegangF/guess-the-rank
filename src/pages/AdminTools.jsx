import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";
import "./adminTools.css";

function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

export default function AdminTools() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editClip, setEditClip] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", rank: "" });

  useEffect(() => {
    fetchClips();
  }, []);

  const fetchClips = async () => {
    const { data, error } = await supabase
      .from("clips")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setClips(data);
    } else {
      console.error("Fehler beim Laden:", error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Clip wirklich löschen?")) return;
    await supabase.from("clips").delete().eq("id", id);
    fetchClips();
  };

  const handleEdit = (clip) => {
    setEditClip(clip.id);
    setEditValues({ name: clip.name, rank: clip.rank });
  };

  const handleEditSave = async (id) => {
    const { error } = await supabase
      .from("clips")
      .update({ name: editValues.name, rank: editValues.rank })
      .eq("id", id);

    if (!error) {
      setEditClip(null);
      fetchClips();
    } else {
      console.error("Update fehlgeschlagen:", error.message);
    }
  };

  const handleEditCancel = () => {
    setEditClip(null);
    setEditValues({ name: "", rank: "" });
  };

  if (loading) return <p className="admin-loading">Lade Clips...</p>;

  return (
    <div className="admin-container">
      <h2>🎬 Hochgeladene Clips</h2>

      <div className="admin-tools-actions">
        <Link to="/upload" className="upload-button">➕ Clip hinzufügen</Link>
      </div>

      {clips.length === 0 ? (
        <p>Keine Clips gefunden.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Clip</th>
              <th>Name</th>
              <th>Rank</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {clips.map((clip) => {
              const videoId = extractYouTubeId(clip.url);

              return (
                <tr key={clip.id}>
                  <td>
                    {videoId ? (
                      <iframe
                        width="200"
                        height="120"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      "Ungültiger Link"
                    )}
                  </td>

                  {editClip === clip.id ? (
                    <>
                      <td>
                        <input
                          value={editValues.name}
                          onChange={(e) =>
                            setEditValues({ ...editValues, name: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={editValues.rank}
                          onChange={(e) =>
                            setEditValues({ ...editValues, rank: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <button onClick={() => handleEditSave(clip.id)}>💾</button>
                        <button onClick={handleEditCancel}>✖️</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{clip.name}</td>
                      <td>{clip.rank}</td>
                      <td>
                        <button onClick={() => handleEdit(clip)}>✏️</button>
                        <button onClick={() => handleDelete(clip.id)}>🗑️</button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
