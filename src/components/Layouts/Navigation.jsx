import React from 'react';

const Navigation = ({ currentView, setCurrentView, selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: 'all', name: 'All News', icon: '🌐' },
    { id: 'mental', name: 'Mental & Fitness', icon: '🧠' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'politics', name: 'Politics', icon: '🏛️' },
    { id: 'finance', name: 'Finance & Economy', icon: '💹' },
    { id: 'life', name: 'Life Skills', icon: '🌟' }
  ];

  const views = [
    { id: 'news', name: 'Read News', icon: '📖' },
    { id: 'admin', name: 'Admin Panel', icon: '⚙️' },
    { id: 'feedback', name: 'Feedback', icon: '💬' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-tabs">
          {views.map(view => (
            <button
              key={view.id}
              className={`nav-tab ${currentView === view.id ? 'active' : ''}`}
              onClick={() => setCurrentView(view.id)}
            >
              <span className="tab-icon">{view.icon}</span>
              {view.name}
            </button>
          ))}
        </div>

        {currentView === 'news' && (
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;