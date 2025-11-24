import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "import.meta.env.VITE_API_URL/api/auth/register",
        data
      );

      toast.success("Registration Successful");

      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
