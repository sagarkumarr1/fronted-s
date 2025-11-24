// frontend/src/pages/SinglePost.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "/fallback.jpg";

function SinglePost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [recommended, setRecommended] = useState([]);   // ⭐ New
  const [prevNext, setPrevNext] = useState({ prev: null, next: null });
  const [loading, setLoading] = useState(true);

  // AI Summary states
  const [aiSummary, setAiSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  /* -------------------------------------------------------
        Fetch SINGLE POST
  ------------------------------------------------------- */
  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`import.meta.env.VITE_API_URL/api/posts/slug/${slug}`);
      setPost(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load post");
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
        Fetch Recommended Posts (Smart AI Based)
  ------------------------------------------------------- */
  const fetchRecommended = async (slugParam) => {
    try {
      const res = await axios.get(
        `import.meta.env.VITE_API_URL/api/posts/recommend/${slugParam}`
      );
      setRecommended(res.data);
    } catch (err) {
      console.error("Recommended Error:", err);
    }
  };

  /* -------------------------------------------------------
        Prev / Next + Trigger recommended fetch
  ------------------------------------------------------- */
  const fetchAux = async () => {
    try {
      const r = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
      const posts = r.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const index = posts.findIndex((p) => p.slug === slug);

      setPrevNext({
        prev: index > 0 ? posts[index - 1] : null,
        next: index < posts.length - 1 ? posts[index + 1] : null,
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* -------------------------------------------------------
        Load on page change
  ------------------------------------------------------- */
  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchAux();
      fetchRecommended(slug);     // ⭐ Trigger recommended
    }
  }, [post]);

  /* -------------------------------------------------------
      AI Summary
  ------------------------------------------------------- */
  const generateSummary = async () => {
    try {
      setLoadingSummary(true);

      const res = await axios.post("import.meta.env.VITE_API_URL/api/ai/summary", {
        text: post.content,
      });

      setAiSummary(res.data.summary);
      setLoadingSummary(false);
    } catch (err) {
      toast.error("AI Summary failed");
      setLoadingSummary(false);
    }
  };

  /* -------------------------------------------------------
        Delete Post (Admin Only)
  ------------------------------------------------------- */
  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    try {
      await axios.delete(`import.meta.env.VITE_API_URL/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Post deleted");
      navigate("/posts");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  /* -------------------------------------------------------
        RENDER UI
  ------------------------------------------------------- */
  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;
  if (!post) return <div style={{ padding: 30 }}>Post not found</div>;

  const goToEdit = () => navigate(`/edit-post/${post._id}`);
  const formattedDate = new Date(post.createdAt).toLocaleString();

  return (
    <div style={{ padding: 24 }}>
      {/* Banner */}
      <div className="single-banner">
        <img
          src={post.thumbnail || FALLBACK_IMAGE}
          alt={post.title}
          className="single-banner-img"
        />
      </div>

      {/* Header */}
      <div className="single-header">
        <div>
          <h1>{post.title}</h1>
          <p className="single-meta">
            By <strong>{post.author?.username}</strong> • {formattedDate} •{" "}
            {post.views || 0} views
          </p>
        </div>

        <div className="single-actions">
          {token && user?.role === "admin" && (
            <>
              <button onClick={goToEdit}>Edit</button>
              <button
                onClick={handleDelete}
                style={{ background: "red", color: "white", marginLeft: 10 }}
              >
                Delete
              </button>
            </>
          )}

          <Link to="/posts">
            <button>Back to Posts</button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="single-content">
        <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>
      </div>

      {/* AI Summary Button */}
      <button onClick={generateSummary} style={{ marginBottom: 20 }}>
        {loadingSummary ? "Generating..." : "Generate AI Summary"}
      </button>

      {/* AI Summary Box */}
      {aiSummary && (
        <div
          style={{
            background: "var(--card-bg)",
            padding: 16,
            borderRadius: 10,
            marginBottom: 30,
          }}
        >
          <h3>AI Summary</h3>
          <p>{aiSummary}</p>
        </div>
      )}

      {/* Prev/Next */}
      <div className="single-nav">
        {prevNext.prev ? (
          <Link to={`/post/${prevNext.prev.slug}`}>
            <button>&larr; {prevNext.prev.title.substring(0, 50)}...</button>
          </Link>
        ) : (
          <span />
        )}

        {prevNext.next ? (
          <Link to={`/post/${prevNext.next.slug}`}>
            <button>{prevNext.next.title.substring(0, 50)}... &rarr;</button>
          </Link>
        ) : (
          <span />
        )}
      </div>

      {/* ⭐ Recommended Section */}
      <h2>Recommended for You</h2>

      <div className="related-grid">
        {recommended.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No recommendations found.</p>
        ) : (
          recommended.map((r) => (
            <Link key={r._id} to={`/post/${r.slug}`} className="related-card">
              <img
                src={r.thumbnail || FALLBACK_IMAGE}
                className="related-thumb"
                alt=""
              />
              <div className="related-info">
                <h4>{r.title}</h4>
                <p>{r.category}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default SinglePost;
