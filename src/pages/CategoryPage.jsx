import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CategoryPage() {
  const { name } = useParams(); // category name from URL
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategoryPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
      const filtered = res.data.filter((p) => p.category === name);
      setPosts(filtered);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryPosts();
  }, [name]);

  if (loading) return <p style={{ padding: 30 }}>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>{name} Posts</h1>
      <p style={{ color: "var(--muted)" }}>
        Found {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>

      {posts.length === 0 ? (
        <p>No posts found in this category.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              display: "flex",
              gap: 20,
              borderBottom: "1px solid var(--border)",
              paddingBottom: 15,
              marginBottom: 20,
            }}
          >
            {post.thumbnail && (
              <img
                src={post.thumbnail}
                alt=""
                style={{
                  width: 160,
                  height: 120,
                  borderRadius: 6,
                  objectFit: "cover",
                }}
              />
            )}

            <div>
              <Link
                to={`/post/${post._id}`}
                style={{ textDecoration: "none", color: "var(--text)" }}
              >
                <h3 style={{ margin: 0 }}>{post.title}</h3>
              </Link>

              <p style={{ marginTop: 8, color: "var(--muted)" }}>
                {post.content.substring(0, 140)}...
              </p>

              <Link to={`/post/${post._id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CategoryPage;
