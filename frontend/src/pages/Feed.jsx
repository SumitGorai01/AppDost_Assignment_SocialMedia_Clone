import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Edit3,
  Trash2,
  Send,
  Image as ImageIcon,
  Save,
  X,
  UserCircle2,
} from "lucide-react";
import api from "../utils/api";

function Post({ post, onLike, onDelete, onEdit, currentUser }) {
  const isOwner =
    currentUser &&
    (currentUser._id === post.author._id ||
      currentUser.id === post.author._id);

  const liked =
    currentUser &&
    post.likes &&
    post.likes.includes(currentUser._id || currentUser.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-md p-4 mb-4 transition hover:shadow-lg"
    >
      {/* Post content same as before */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
            {post.author.name[0]}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-800">
                {post.author.name}
              </h4>
              <span className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-3 text-gray-700">
            <p className="whitespace-pre-line">{post.text}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="rounded-xl mt-3 w-full object-cover max-h-96"
              />
            )}
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <button
              onClick={() => onLike(post._id)}
              className={`flex items-center gap-1 transition ${
                liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  liked ? "fill-red-500" : "stroke-current"
                }`}
              />
              <span>{liked ? "Unlike" : "Like"}</span>
              <span className="text-xs ml-1">
                ({post.likes?.length || 0})
              </span>
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => onEdit(post)}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(post._id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const load = async () => {
    const res = await api.get("/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const createPost = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (imageFile) formData.append("image", imageFile);

      if (editing) {
        const res = await api.put(`/posts/${editing._id}`, { text });
        setPosts((prev) =>
          prev.map((p) => (p._id === res.data._id ? res.data : p))
        );
        setEditing(null);
      } else {
        const res = await api.post("/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setPosts((prev) => [res.data, ...prev]);
      }
      setText("");
      setImageFile(null);
      setImagePreview(null);
    } catch (e) {
      setErr(e.response?.data?.message || "Could not create post");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data.post : p))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (post) => {
    setEditing(post);
    setText(post.text);
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 px-4" id="create-post-form">
      {user ? (
        <motion.form
          layout
          onSubmit={createPost}
          className="bg-white rounded-2xl shadow-md p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <UserCircle2 className="w-10 h-10 text-gray-400" />
            <div className="flex-1">
              <textarea
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="w-full resize-none border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />

              {/* IMAGE PREVIEW SECTION */}
              {imagePreview && (
                <div className="mt-3 border rounded-xl p-3 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <span className="text-sm text-gray-700 truncate max-w-[150px]">
                      {imageFile?.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-blue-600 transition">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm">Add image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-2">
                  {editing ? (
                    <>
                      <button
                        type="submit"
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(null);
                          setText("");
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      <Send className="w-4 h-4" /> Post
                    </button>
                  )}
                </div>
              </div>
              {err && <div className="text-red-500 text-sm mt-2">{err}</div>}
            </div>
          </div>
        </motion.form>
      ) : (
        <div className="text-center text-gray-500 py-8">
          Please{" "}
          <a href="/login" className="text-blue-600 underline">
            login
          </a>{" "}
          to create posts.
        </div>
      )}

      {/* POSTS LIST */}
      <section className="space-y-4">
        {posts.map((p) => (
          <Post
            key={p._id}
            post={p}
            onLike={handleLike}
            onDelete={handleDelete}
            onEdit={handleEdit}
            currentUser={user}
          />
        ))}
      </section>
    </div>
  );
}
