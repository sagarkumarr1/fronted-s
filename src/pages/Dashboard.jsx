import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const username = localStorage.getItem("username"); // saved during login

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Count unique categories
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  // Latest posts (take first 5)
  const latest = posts.slice(0, 5);

  return (
    <div style={{ padding: 30 }}>

      {/* HEADER */}
      <h1>Dashboard</h1>
      <p style={{ color: "var(--muted)" }}>
        Welcome{username ? `, ${username}` : ""} 👋  
      </p>

      {/* TOP CARDS */}
      <div style={{
        display: "flex",
        gap: 20,
        marginTop: 25,
        marginBottom: 30,
      }}>

        <div style={cardStyle}>
          <h2>{posts.length}</h2>
          <p>Total Posts</p>
        </div>

        <div style={cardStyle}>
          <h2>{categories.length}</h2>
          <p>Total Categories</p>
        </div>

        <div style={cardStyle}>
          <h2>+ New</h2>
          <Link to="/create-post">
            <button style={{ marginTop: 8 }}>Create Post</button>
          </Link>
        </div>

      </div>

      {/* LATEST POSTS */}
      <div style={{ marginTop: 20 }}>
        <h2>Latest Posts</h2>

        {latest.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          latest.map((post) => (
            <div
              key={post._id}
              style={{
                padding: 12,
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt=""
                  style={{
                    width: 80,
                    height: 60,
                    borderRadius: 6,
                    objectFit: "cover",
                  }}
                />
              )}

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{post.title}</h3>
                <p style={{ margin: 0, color: "var(--muted)" }}>
                  {post.category}
                </p>
              </div>

              <Link to={`/post/${post.slug}`}>
  <button>View</button>
</Link>

            </div>
          ))
        )}
      </div>

      {/* MANAGE POSTS BUTTON */}
      <div style={{ marginTop: 30 }}>
        <Link to="/posts">
          <button>Manage All Posts</button>
        </Link>
      </div>

    </div>
  );
}

const cardStyle = {
  flex: 1,
  background: "var(--card-bg)",
  padding: 20,
  borderRadius: 10,
  textAlign: "center",
  border: "1px solid var(--border)",
};

export default Dashboard;
