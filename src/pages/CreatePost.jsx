// frontend/src/pages/CreatePost.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [data, setData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  // Handle input
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Upload image
  const uploadImage = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("image", image);

    const res = await axios.post(
      "import.meta.env.VITE_API_URL/api/upload",
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data.imageUrl;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageUrl = await uploadImage();

      // AUTO GENERATE SLUG HERE
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const postData = {
        ...data,
        slug,
        thumbnail: imageUrl,
      };

      await axios.post("import.meta.env.VITE_API_URL/api/posts", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post created successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data || "Failed to create post");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="category"
          placeholder="Category (ex: Tech, Travel)"
          onChange={handleChange}
          required
        />
        <br />

        <textarea
          name="content"
          placeholder="Write your content..."
          rows={6}
          onChange={handleChange}
          required
        />
        <br />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <br />

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
