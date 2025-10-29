import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { NewsProvider } from './hooks/useNews.jsx';
import Header from './components/Layouts/Header.jsx';
import Navigation from './components/Layouts/Navigation.jsx';
import NewsFeed from './components/News/NewsFeed.jsx';
import AdminPanel from './components/Admin/AdminPanel.jsx';
import NewsDetail from './components/News/NewsDetail.jsx';
import FeedbackForm from './components/Feedback/FeedbackForm.jsx'; // Add this import
import './App.css';

// Main content component that handles routing
function MainContent() {
  const location = useLocation();
  const [currentView, setCurrentView] = useState('news');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Hide navigation on detail pages
  const isDetailPage = location.pathname.startsWith('/news/');

  // Render appropriate content based on current view
  const renderContent = () => {
    if (isDetailPage) {
      return (
        <Routes>
          <Route path="/news/:id" element={<NewsDetail />} />
        </Routes>
      );
    }

    switch (currentView) {
      case 'admin':
        return <AdminPanel />;
      case 'feedback':
        return <FeedbackForm />;
      case 'news':
      default:
        return <NewsFeed category={selectedCategory} />;
    }
  };

  return (
    <>
      {!isDetailPage && (
        <Navigation 
          currentView={currentView}
          setCurrentView={setCurrentView}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      
      <main className="main-content">
        {renderContent()}
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <NewsProvider>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/*" element={<MainContent />} />
          </Routes>
        </div>
      </NewsProvider>
    </Router>
  );
}

export default App;