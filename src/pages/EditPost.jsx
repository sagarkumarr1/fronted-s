import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [data, setData] = useState({
    title: "",
    content: "",
  });

  const [oldImage, setOldImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`import.meta.env.VITE_API_URL/api/posts/${id}`);
      setData({
        title: res.data.title,
        content: res.data.content,
      });
      setOldImage(res.data.thumbnail);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const uploadImage = async () => {
    if (!newImage) return oldImage;

    const formData = new FormData();
    formData.append("image", newImage);

    const res = await axios.post(
      "import.meta.env.VITE_API_URL/api/upload",
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageUrl = await uploadImage();

      const updatedPost = {
        ...data,
        thumbnail: imageUrl,
      };

      await axios.put(
        `import.meta.env.VITE_API_URL/api/posts/${id}`,
        updatedPost,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Post updated successfully");
      navigate(`/post/${id}`);

    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Edit Post</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
        /><br />

        <textarea
          name="content"
          rows={6}
          value={data.content}
          onChange={handleChange}
        /><br />

        {/* Old image preview */}
        {oldImage && (
          <div>
            <p>Current Image:</p>
            <img src={oldImage} width="200" />
          </div>
        )}

        <p>Upload New Image (optional):</p>
        <input
          type="file"
          onChange={(e) => setNewImage(e.target.files[0])}
        /><br />

        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

export default EditPost;
