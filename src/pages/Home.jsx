// frontend/src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import "../styles.css";

const PAGE_SIZE = 6;

function Home() {
  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/trending`);
      const data = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // Fetch trending posts
  const fetchTrending = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/trending`);
      setTrending(res.data);
    } catch (err) {
      console.error("Error fetching trending:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchTrending();
  }, []);

  // Build category list
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    posts.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [posts]);

  // Search + category filter
  const filtered = posts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" || post.category === category;

    return matchSearch && matchCategory;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="home-page">
      
      {/* HERO SLIDER */}
      {posts.length > 0 && <HeroSlider posts={posts.slice(0, 5)} />}

      <div className="home-layout">
        
        {/* LEFT CONTENT */}
        <div style={{ flex: 3 }}>
          
          {/* Search + Category */}
          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 6,
                border: "1px solid var(--border)"
              }}
            />

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              style={{
                padding: 10,
                borderRadius: 6,
                border: "1px solid var(--border)"
              }}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* POSTS LIST */}
          {paginated.length === 0 ? (
            <p>No posts found</p>
          ) : (
            paginated.map((post) => (
              <div key={post._id} className="post-item">
                
                {post.thumbnail && (
                  <img
                    src={post.thumbnail}
                    alt=""
                    style={{
                      width: 140,
                      height: 100,
                      borderRadius: 6,
                      objectFit: "cover"
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <Link
                    to={`/post/${post.slug}`}
                    style={{ textDecoration: "none", color: "var(--text)" }}
                  >
                    <h3 style={{ margin: 0 }}>{post.title}</h3>
                  </Link>

                  <p style={{ marginTop: 8, color: "var(--muted)" }}>
                    {post.content.substring(0, 150)}...
                  </p>

                  <Link to={`/post/${post.slug}`}>
                    <button style={{ marginTop: 8 }}>Read More</button>
                  </Link>
                </div>
              </div>
            ))
          )}

          {/* PAGINATION */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <div>
              <button disabled={page === 1} onClick={() => goToPage(page - 1)}>
                Prev
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
                style={{ marginLeft: 8 }}
              >
                Next
              </button>
            </div>

            <div>
              Page {page} of {totalPages}
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  style={{ marginLeft: 6 }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ flex: 1 }}>
          
          {/* TRENDING */}
          <div
            style={{
              background: "var(--card-bg)",
              padding: 14,
              borderRadius: 8,
              marginBottom: 20
            }}
          >
            <h3>🔥 Trending</h3>

            {trending.map((post) => (
              <div key={post._id} style={{ marginBottom: 8 }}>
                <Link
                  to={`/post/${post.slug}`}
                  style={{ textDecoration: "none", color: "var(--text)" }}
                >
                  ➤ {post.title}
                </Link>
              </div>
            ))}
          </div>

          {/* CATEGORIES */}
          <div
            style={{
              background: "var(--card-bg)",
              padding: 14,
              borderRadius: 8
            }}
          >
            <h3>📂 Categories</h3>
            {categories.map((c) => (
              <button
                key={c}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 8,
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  marginBottom: 6
                }}
              >
                {c}
              </button>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;
