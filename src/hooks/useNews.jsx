// src/hooks/useNews.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getNews, 
  addNews, 
  updateNews, 
  deleteNews,
  uploadImage 
} from '../services/newsService';

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const newsData = await getNews();
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData) => {
    try {
      let imageUrl = newsData.image;

      // ✅ Upload new image to Firebase Storage if selected
      if (newsData.imageFile) {
        imageUrl = await uploadImage(newsData.imageFile);
      }

      const newNews = {
        ...newsData,
        image: imageUrl || '',
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0
      };

      await addNews(newNews);
      await loadNews();
      return true;
    } catch (error) {
      console.error('Error creating news:', error);
      return false;
    }
  };

  const editNews = async (id, updates) => {
    try {
      let imageUrl = updates.image;

      // ✅ Upload new image only if user selects a new one
      if (updates.imageFile) {
        imageUrl = await uploadImage(updates.imageFile);
      }

      const updatedData = {
        ...updates,
        image: imageUrl || ''
      };

      await updateNews(id, updatedData);
      await loadNews();
      return true;
    } catch (error) {
      console.error('Error updating news:', error);
      return false;
    }
  };

  const removeNews = async (id) => {
    try {
      await deleteNews(id);
      await loadNews();
      return true;
    } catch (error) {
      console.error('Error deleting news:', error);
      return false;
    }
  };

  const value = {
    news,
    loading,
    createNews,
    editNews,
    removeNews,
    refreshNews: loadNews
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};
