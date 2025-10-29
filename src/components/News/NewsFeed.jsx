// src/components/News/NewsFeed.jsx
import React from 'react';
import { useNews } from '../../hooks/useNews';
import NewsCard from './NewsCard';

const NewsFeed = ({ category }) => {
  const { news, loading } = useNews();

  const filteredNews = category === 'all' 
    ? news 
    : news.filter(item => item.category === category);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading latest news...</p>
      </div>
    );
  }

  return (
    <div className="news-feed">
      <div className="feed-header">
        <h2>
          {category === 'all' ? 'Latest News' : `${category.charAt(0).toUpperCase() + category.slice(1)} News`}
        </h2>
        <span className="news-count">{filteredNews.length} articles</span>
      </div>
      
      <div className="news-grid">
        {filteredNews.map((newsItem, index) => (
          <NewsCard 
            key={newsItem.id} 
            news={newsItem} 
            priority={index < 3}
          />
        ))}
      </div>
      
      {filteredNews.length === 0 && (
        <div className="empty-state">
          <h3>No news found</h3>
          <p>Be the first to publish in this category!</p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;