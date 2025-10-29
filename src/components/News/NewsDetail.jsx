// src/components/News/NewsDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { news, editNews } = useNews();
  const [newsItem, setNewsItem] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const categoryIcons = {
    mental: '🧠',
    sports: '⚽',
    politics: '🏛️',
    finance: '💹',
    life: '🌟'
  };

  useEffect(() => {
    // Find the news item
    const foundNews = news.find(item => item.id === id);
    if (foundNews) {
      setNewsItem(foundNews);
      setLikeCount(foundNews.likes || 0);
      setIsLiked(false); // Reset like state for demo

      // ✅ Increment views only once per session
      incrementViews(foundNews);
    }
  }, [id, news]);

  const incrementViews = async (newsData) => {
    try {
      const viewedKey = `viewed_${newsData.id}`;
      if (sessionStorage.getItem(viewedKey)) return; // ✅ Prevent duplicate increments
      sessionStorage.setItem(viewedKey, 'true');

      await editNews(newsData.id, {
        views: (newsData.views || 0) + 1
      });
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const handleLike = async () => {
  const likedKey = `liked_${newsItem.id}`;

  // Prevent multiple likes per session
  if (sessionStorage.getItem(likedKey)) {
    alert('You’ve already liked this article ❤️');
    return;
  }

  const newLikeCount = likeCount + 1;
  setLikeCount(newLikeCount);
  setIsLiked(true);
  sessionStorage.setItem(likedKey, 'true'); // mark liked

  try {
    await editNews(newsItem.id, {
      likes: newLikeCount
    });
  } catch (error) {
    console.error('Error updating likes:', error);
    setLikeCount(likeCount);
    setIsLiked(false);
    sessionStorage.removeItem(likedKey);
  }
};


  const handleShare = async () => {
    const shareData = {
      title: newsItem.title,
      text: newsItem.content.substring(0, 100) + '...',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard! 📋');
      } else {
        prompt('Copy this link to share:', shareData.url);
      }
    } catch (error) {
      console.log('Share cancelled:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!newsItem) {
    return (
      <div className="news-detail">
        <div className="container">
          <button onClick={() => navigate('/')} className="back-btn">
            ← Back to News
          </button>
          <div className="not-found">
            <h1>Article Not Found</h1>
            <p>The news article you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/')} className="action-btn">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail">
      <div className="container">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to All News
        </button>
        
        <article className="news-article">
          <header className="news-header">
            <div className="news-category-badge">
              {categoryIcons[newsItem.category]} {newsItem.category.charAt(0).toUpperCase() + newsItem.category.slice(1)}
            </div>
            
            <h1 className="news-title">{newsItem.title}</h1>
            
            <div className="news-meta-large">
              <div className="author-section">
                <span className="author-avatar">👤</span>
                <div>
                  <strong>By {newsItem.author}</strong>
                  <span className="publish-date">
                    Published on {formatDate(newsItem.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="stats-section">
                <span className="stat">👁️ {newsItem.views || 0} views</span>
                <span className="stat">⏱️ {newsItem.readTime || '2 min'} read</span>
                <span className="stat">❤️ {likeCount} likes</span>
              </div>
            </div>
          </header>

          {newsItem.image && newsItem.image.startsWith('data:') && (
            <div className="news-hero-image">
              <img 
                src={newsItem.image} 
                alt={newsItem.title}
                className="hero-image"
              />
            </div>
          )}

          <div className="news-content-full">
            <div className="content-body">
              {newsItem.content.split('\n').map((paragraph, index) => (
                <p key={index} className="news-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <footer className="news-footer">
            <div className="article-actions">
              <button 
                className={`action-btn large like-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                {isLiked ? '💖' : '🤍'} Like ({likeCount})
              </button>
              
              <button 
                className="action-btn large share-btn"
                onClick={handleShare}
              >
                📤 Share Article
              </button>
            </div>
            
            <div className="related-topics">
              <h3>Related Topics</h3>
              <div className="topic-tags">
                <span className="topic-tag">#{newsItem.category}</span>
                <span className="topic-tag">#NairobiNews</span>
                <span className="topic-tag">#Kenya</span>
                <span className="topic-tag">#Latest</span>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
