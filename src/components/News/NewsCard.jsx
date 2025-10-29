// src/components/News/NewsCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';

const NewsCard = ({ news, priority }) => {
  const navigate = useNavigate();
  const { editNews } = useNews();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(news.likes || 0);
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryIcons = {
    mental: '🧠',
    sports: '⚽',
    politics: '🏛️',
    finance: '💹',
    life: '🌟',
  };

  useEffect(() => {
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    if (likedNews.includes(news.id)) setIsLiked(true);
  }, [news.id]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const handleLike = () => {
    if (isLiked) return alert('You already liked this post!');
    const newCount = likeCount + 1;
    setLikeCount(newCount);
    setIsLiked(true);
    const likedNews = JSON.parse(localStorage.getItem('likedNews') || '[]');
    likedNews.push(news.id);
    localStorage.setItem('likedNews', JSON.stringify(likedNews));
  };

  const handleShare = async () => {
    const shareData = {
      title: news.title,
      text: news.content.substring(0, 100) + '...',
      url: `${window.location.origin}/news/${news.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
        );
        const shareBtn = document.querySelector(
          `[data-news-id="${news.id}"] .share-btn`
        );
        if (shareBtn) {
          const original = shareBtn.textContent;
          shareBtn.textContent = '✅ Copied!';
          setTimeout(() => (shareBtn.textContent = original), 2000);
        }
      } else {
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareData.title
        )}&url=${encodeURIComponent(shareData.url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log('Share failed:', error);
        prompt('Copy this link to share:', shareData.url);
      }
    }
  };

  const handleReadMore = () => navigate(`/news/${news.id}`);

  const handleCardClick = async () => {
    try {
      const viewedKey = `viewed_${news.id}`;
      if (sessionStorage.getItem(viewedKey)) return;
      sessionStorage.setItem(viewedKey, 'true');
      await editNews(news.id, { views: (news.views || 0) + 1 });
    } catch (err) {
      console.error('Error updating views:', err);
    }
  };

  const getExcerpt = () =>
    isExpanded
      ? news.content
      : news.content.length > 120
      ? news.content.substring(0, 120) + '...'
      : news.content;

  // ✅ Handle Cloudinary images (https://res.cloudinary.com/...)
  const imageSrc =
    news.image && news.image.startsWith('http')
      ? news.image // Cloudinary or external image URL
      : null;

  return (
    <article
      className={`news-card ${priority ? 'priority' : ''}`}
      data-news-id={news.id}
      onClick={handleCardClick}
    >
      <div className="news-image-container">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={news.title}
            className="news-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}

        <div
          className="news-image-placeholder"
          style={{ display: imageSrc ? 'none' : 'block' }}
        >
          <span className="placeholder-icon">
            {categoryIcons[news.category] || '📰'}
          </span>
        </div>

        <div className="news-category-badge">
          {categoryIcons[news.category] || '📰'}{' '}
          {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
        </div>
      </div>

      <div className="news-content">
        <h3 className="news-title">{news.title}</h3>
        <p className="news-excerpt">{getExcerpt()}</p>

        <div className="news-meta">
          <div className="meta-left">
            <span className="news-author">By {news.author}</span>
            <span className="news-date">{formatDate(news.createdAt)}</span>
          </div>
          <div className="meta-right">
            <span className="news-views">👁️ {news.views || 0}</span>
            <span className="news-read-time">{news.readTime || '2 min'}</span>
          </div>
        </div>

        <div className="news-actions">
          <button
            className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            aria-label={isLiked ? 'Unlike this news' : 'Like this news'}
            disabled={isLiked}
          >
            {isLiked ? '💖' : '🤍'} {likeCount}
          </button>

          <button
            className="action-btn share-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            aria-label="Share this news"
          >
            📤 Share
          </button>

          <button
            className="action-btn read-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleReadMore();
            }}
            aria-label="Read full article"
          >
            Read More →
          </button>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
