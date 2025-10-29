// src/services/newsService.js
// Local storage implementation — persistent and clean

// ✅ Fetch all news from localStorage
export const getNews = async () => {
  try {
    const localNews = localStorage.getItem('nairobi-tea-news');
    if (localNews) {
      return JSON.parse(localNews);
    } else {
      return []; // No default or sample news
    }
  } catch (error) {
    console.error('Error loading news:', error);
    return [];
  }
};

// ✅ Add new news item
export const addNews = async (newsItem) => {
  try {
    const currentNews = await getNews();
    const updatedNews = [newsItem, ...currentNews];
    localStorage.setItem('nairobi-tea-news', JSON.stringify(updatedNews));
    return true;
  } catch (error) {
    console.error('Error adding news:', error);
    return false;
  }
};

// ✅ Upload image (convert to Base64 and store permanently)
export const uploadImage = async (imageFile) => {
  if (!imageFile) return '';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result); // Base64 string
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(imageFile);
  });
};

// ✅ Update existing news
export const updateNews = async (id, updates) => {
  try {
    const currentNews = await getNews();
    const updatedNews = currentNews.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem('nairobi-tea-news', JSON.stringify(updatedNews));
    return true;
  } catch (error) {
    console.error('Error updating news:', error);
    return false;
  }
};

// ✅ Delete a news item
export const deleteNews = async (id) => {
  try {
    const currentNews = await getNews();
    const updatedNews = currentNews.filter(item => item.id !== id);
    localStorage.setItem('nairobi-tea-news', JSON.stringify(updatedNews));
    return true;
  } catch (error) {
    console.error('Error deleting news:', error);
    return false;
  }
};
