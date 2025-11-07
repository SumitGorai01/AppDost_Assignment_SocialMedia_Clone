import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, FileText, Loader2, X, Save, Trash2, Edit } from "lucide-react";
import api from "../utils/api";

export default function Profile({ currentUser, onProfileUpdate }) {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // 🧩 Post Edit States
  const [editPost, setEditPost] = useState(null);
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/posts/user/${id}`).catch(() => api.get("/posts")),
        ]);
        setProfile(userRes.data);
        const userPosts =
          postsRes.data.filter?.((p) => p.author?._id === id) || postsRes.data;
        setPosts(userPosts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 🧩 Profile Edit Modal Open
  const handleEditOpen = () => {
    setForm({ name: profile.name || "", bio: profile.bio || "" });
    setShowEdit(true);
  };

  // 🧩 Save Profile Update
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("bio", form.bio);
      if (imageFile) formData.append("image", imageFile);

      const res = await api.put(`/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      if (onProfileUpdate) onProfileUpdate(res.data);
      setShowEdit(false);
      setImageFile(null);
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  };

  // 🧩 Open Post Edit Modal
  const openPostEdit = (post) => {
    setEditPost(post);
    setEditText(post.text);
    setEditImage(null);
  };

  // 🧩 Save Post Changes
  const handlePostUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("text", editText);
      if (editImage) formData.append("image", editImage);

      const res = await api.put(`/posts/${editPost._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosts((prev) =>
        prev.map((p) => (p._id === editPost._id ? res.data : p))
      );
      setEditPost(null);
      setEditImage(null);
    } catch (err) {
      console.error("Post update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  // 🗑️ Delete Post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Post delete error:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-blue-600">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );

  if (!profile)
    return (
      <div className="text-center text-gray-500 py-10">
        Could not load profile.
      </div>
    );

  return (
    <motion.div
      className="pt-16 px-4 md:px-8 min-h-screen bg-gradient-to-b from-blue-50 to-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 👤 Profile Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 text-center mb-10">
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 text-white w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-md mb-4 overflow-hidden">
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              profile.name?.[0] || <User className="w-10 h-10" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {profile.email || "No email available"}
          </p>
          <p className="text-gray-600 mt-3">
            {profile.bio || "This user hasn’t written a bio yet."}
          </p>

          {currentUser && currentUser._id === profile._id && (
            <button
              onClick={handleEditOpen}
              className="mt-5 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* 📝 Posts Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="text-blue-600 w-6 h-6" />
          <h3 className="text-2xl font-semibold text-gray-800">
            Posts by {profile.name}
          </h3>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <motion.div
                key={p._id}
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition flex flex-col"
              >
                {/* 🧑 Author Info */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center">
                      {p.author?.name?.[0] || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {p.author?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(p.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* ✏️ Edit/Delete Buttons */}
                  {currentUser?._id === p.author?._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openPostEdit(p)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(p._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 📝 Post Content */}
                <div className="flex-1 p-4 flex flex-col">
                  <p className="text-gray-700 text-sm mb-3">{p.text}</p>
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt="Post"
                      onError={(e) => (e.target.style.display = "none")}
                      className="rounded-xl object-cover w-full max-h-60"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No posts yet from {profile.name}.
          </p>
        )}
      </div>

      {/* 🔹 Edit Post Modal */}
      <AnimatePresence>
        {editPost && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative"
            >
              <button
                onClick={() => setEditPost(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Edit Post
              </h3>

              <form onSubmit={handlePostUpdate} className="space-y-4">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-2"
                />

                {editImage && (
                  <img
                    src={URL.createObjectURL(editImage)}
                    alt="Preview"
                    className="mt-3 w-full rounded-xl object-cover max-h-48"
                  />
                )}

                <button
                  type="submit"
                  disabled={updating}
                  className={`w-full flex justify-center items-center gap-2 py-2 rounded-lg text-white font-semibold ${
                    updating
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <Save className="w-5 h-5" />
                  {updating ? "Updating..." : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Edit Profile Modal */}
      <AnimatePresence>
        {showEdit && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative"
            >
              <button
                onClick={() => setShowEdit(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Edit Profile
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Bio"
                  className="w-full border border-gray-300 rounded-lg p-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-2"
                />

                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full flex justify-center items-center gap-2 py-2 rounded-lg text-white font-semibold ${
                    saving
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <Save className="w-5 h-5" />
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
