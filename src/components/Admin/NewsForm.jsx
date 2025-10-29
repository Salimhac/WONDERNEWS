// src/components/Admin/NewsForm.jsx
import React, { useState, useEffect } from "react";
import { useNews } from "../../hooks/useNews";
import { v4 as uuidv4 } from "uuid";

const CLOUD_NAME = "ddofrdneb"; // e.g. "ramadhan123"
const UPLOAD_PRESET = "unsigned_upload"; // same as the one you created

const NewsForm = ({ editingNews, onCancelEdit }) => {
  const { createNews, editNews } = useNews();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "mental",
    author: "Admin",
    image: "",
    imageFile: null,
    readTime: "2 min",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingNews) {
      setFormData({
        title: editingNews.title,
        content: editingNews.content,
        category: editingNews.category,
        author: editingNews.author,
        image: editingNews.image,
        imageFile: null,
        readTime: editingNews.readTime || "2 min",
      });
    }
  }, [editingNews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file),
      }));
    }
  };

  // Upload image to Cloudinary (FAST + FREE)
  const uploadImageToCloudinary = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("public_id", `news/${uuidv4()}`); // unique file name

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (!data.secure_url) throw new Error("Cloudinary upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;

      if (formData.imageFile) {
        imageUrl = await uploadImageToCloudinary(formData.imageFile);
      }

      const dataToSubmit = { ...formData, image: imageUrl, imageFile: null };

      const success = editingNews
        ? await editNews(editingNews.id, dataToSubmit)
        : await createNews(dataToSubmit);

      if (success) {
        setFormData({
          title: "",
          content: "",
          category: "mental",
          author: "Admin",
          image: "",
          imageFile: null,
          readTime: "2 min",
        });
        if (editingNews) onCancelEdit();
      }
    } catch (error) {
      console.error("Error submitting news:", error);
      alert("❌ Failed to publish news. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "mental", label: "🧠 Mental & Fitness" },
    { value: "sports", label: "⚽ Sports" },
    { value: "politics", label: "🏛️ Politics" },
    { value: "finance", label: "💹 Finance & Economy" },
    { value: "life", label: "🌟 Life Skills" },
  ];

  return (
    <div className="news-form-container">
      <h3>{editingNews ? "✏️ Edit News" : "📝 Create New News"}</h3>

      <form onSubmit={handleSubmit} className="news-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            News Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter compelling news title..."
            required
          />
        </div>

        {/* Content */}
        <div className="form-group">
          <label htmlFor="content" className="form-label">
            News Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Write your news content here..."
            rows="6"
            required
          />
        </div>

        {/* Category, Author, Read Time */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="author" className="form-label">
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="form-input"
              placeholder="Author name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="readTime" className="form-label">
              Read Time
            </label>
            <input
              type="text"
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., 2 min"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label htmlFor="image" className="form-label">
            News Image
          </label>
          <div className="file-upload">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <div className="upload-content">
              {formData.image ? (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" className="preview-image" />
                  <span>📷 Image selected</span>
                </div>
              ) : (
                <>
                  <span className="upload-icon">📁</span>
                  <p>Click to upload an image</p>
                  <small>Supports JPG, PNG, GIF</small>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          {editingNews && (
            <button type="button" onClick={onCancelEdit} className="cancel-btn" disabled={isSubmitting}>
              ❌ Cancel
            </button>
          )}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "⏳ Publishing..." : editingNews ? "💾 Update News" : "🚀 Publish News"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
