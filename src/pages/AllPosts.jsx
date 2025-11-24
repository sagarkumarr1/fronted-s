import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await 
      setPosts(res.data); axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading)
    return (
      <div style={{ padding: 30 }}>
        <h3>Loading posts...</h3>
      </div>
    );

  return (
    <div style={{ padding: 30 }}>
      <h2>All Posts</h2>

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              marginBottom: 20,
              borderRadius: 8,
              background: "var(--card-bg)",
            }}
          >
            {/* CLICKABLE TITLE */}
            <Link
              to={`/post/${post.slug}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <h3>{post.title}</h3>
            </Link>

            {/* IMAGE */}
            {post.thumbnail && (
              <img
                src={post.thumbnail}
                width="200"
                style={{ marginBottom: 10, borderRadius: 6 }}
              />
            )}

            {/* CONTENT PREVIEW */}
            <p style={{ marginTop: 8 }}>
              {post.content.substring(0, 120)}...
            </p>

            {/* READ MORE BUTTON */}
            <Link to={`/post/${post.slug}`}>
              <button style={{ marginTop: 10 }}>Read More</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default AllPosts;
