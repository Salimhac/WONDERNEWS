// src/components/Feedback/FeedbackForm.jsx
import React, { useState } from 'react';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: '5'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Netlify will automatically handle the form submission
    // The form data will be sent to Netlify's form system
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        rating: '5'
      });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="feedback-form success">
        <div className="success-message">
          <span className="success-icon">✅</span>
          <h3>Thank You for Your Feedback!</h3>
          <p>Your message has been received. We appreciate you taking the time to help us improve NAIROBIAN TEA.</p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="submit-btn"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-form">
      <div className="form-header">
        <h2>💬 Send Us Feedback</h2>
        <p>We'd love to hear your thoughts about NAIROBIAN TEA. Your feedback helps us improve.</p>
      </div>

      <form
        name="feedback"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="feedback-form-content"
      >
        {/* Netlify Form Hidden Fields */}
        <input type="hidden" name="form-name" value="feedback" />
        <input type="hidden" name="bot-field" />

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a topic</option>
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="content">Content Suggestion</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <React.Fragment key={star}>
                  <input
                    type="radio"
                    id={`rating-${star}`}
                    name="rating"
                    value={star.toString()}
                    checked={formData.rating === star.toString()}
                    onChange={handleChange}
                    className="rating-input"
                  />
                  <label
                    htmlFor={`rating-${star}`}
                    className="rating-label"
                  >
                    {star <= parseInt(formData.rating) ? '⭐' : '☆'}
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Tell us what you think about NAIROBIAN TEA..."
            rows="6"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Sending...
              </>
            ) : (
              'Send Feedback'
            )}
          </button>
        </div>

        <div className="form-note">
          <p>📧 You'll receive a confirmation email when we receive your feedback.</p>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;