import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import AllPosts from "./pages/AllPosts";
import SinglePost from "./pages/SinglePost";
import EditPost from "./pages/EditPost";
import Navbar from "./components/Navbar";
import CategoryPage from "./pages/CategoryPage";
import "./styles.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<AllPosts />} />
        <Route path="/post/:slug" element={<SinglePost />} />
        <Route path="/category/:name" element={<CategoryPage />} />

        {/* ADMIN ONLY ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-post"
          element={
            <ProtectedRoute adminOnly={true}>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <EditPost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
