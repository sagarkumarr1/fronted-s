import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
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
        "import.meta.env.VITE_API_URL/api/auth/login",
        data
      );

      toast.success("Login Successful");

      // SAVE TOKEN (your original code)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);

      /* ⭐ NEW & REQUIRED FIX ⭐  
         Save FULL user object so navbar can detect admin/user
      */
      localStorage.setItem("user", JSON.stringify(res.data.user));

      /* ⭐ REDIRECT LOGIC
         If admin → dashboard
         If normal user → home
      */
      if (res.data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      toast.error(err.response?.data || "Invalid credentials");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        
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

        <button type="submit">Login</button>

      </form>
    </div>
  );
}

export default Login;
