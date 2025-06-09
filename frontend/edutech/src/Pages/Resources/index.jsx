import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthConetxts";

export default function Resources() {
  const { topicName } = useParams(); // Destructure directly
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  //  ---Function to get token id from firebase----
  const getFirebaseIdToken = async () => {
    if (user) {
      return await user.getIdToken();
    }
    return null;
  };
  useEffect(() => {
    const fetchVideos = async () => {
      if (!topicName) {
        setError("Topic name not found");
        return;
      }

      setLoading(true);
      setError(null);
      setVideos([]);
      const idToken = await getFirebaseIdToken();
      if (!idToken) {
        alert("You must be logged in to generate a roadmap.");
        return;
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/video/",
          { topic: topicName },
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setVideos(response.data.resources);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [topicName]);
  function getYouTubeEmbedUrl(url) {
    const match = url.match(/v=([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  return (
    <div>
      <h2>Resources for: {topicName}</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {videos.map((video, index) => {
          const embedUrl = getYouTubeEmbedUrl(video.url); // ✅ Move it here

          return (
            <li key={index} style={{ marginBottom: "2rem" }}>
              <iframe
                src={embedUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                width="560"
                height="315"
                style={{ maxWidth: "100%", borderRadius: "10px" }}
              ></iframe>
              <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                Title:
                {video.title}
              </p>{" "}
              {/* Use video.title as title */}
              <p>
                <span style={{ fontWeight: "bold" }}>description :</span>
                {video.description}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
