import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Eye, Users, FileText, TrendingUp, Settings } from 'lucide-react';

const AdminPanel = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [articles, setArticles] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingArticle, setEditingArticle] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Mock data for demonstration
  const mockStats = {
    articles: { total: 15, published: 12, drafts: 3, byCategory: { 'cybersecurity': 6, 'ai-security': 4, 'best-practices': 5 } },
    subscribers: { total: 342, active: 338, recent: 23 }
  };

  const mockArticles = [
    {
      id: 1,
      title: "Zero Trust Architecture Implementation",
      excerpt: "Complete guide to implementing Zero Trust security models...",
      category: "cybersecurity",
      author: "John Doe",
      published: true,
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      id: 2,
      title: "AI Model Security Best Practices",
      excerpt: "Protecting AI models against adversarial attacks...",
      category: "ai-security",
      author: "Jane Smith",
      published: false,
      created_at: "2025-01-14T15:30:00Z"
    }
  ];

  const mockSubscribers = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      subscribed_at: "2025-01-10T12:00:00Z",
      is_active: true
    },
    {
      id: 2,
      name: "Bob Wilson",
      email: "bob@example.com",
      subscribed_at: "2025-01-08T09:30:00Z",
      is_active: true
    }
  ];

  useEffect(() => {
    if (currentView === 'dashboard') {
      setStats(mockStats);
    } else if (currentView === 'articles') {
      setArticles(mockArticles);
    } else if (currentView === 'subscribers') {
      setSubscribers(mockSubscribers);
    }
  }, [currentView]);

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <Icon className={`h-8 w-8 text-${color}-600`} />
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Articles"
              value={stats.articles.total}
              subtitle={`${stats.articles.published} published`}
              icon={FileText}
              color="blue"
            />
            <StatCard
              title="Total Subscribers"
              value={stats.subscribers.total}
              subtitle={`${stats.subscribers.recent} this month`}
              icon={Users}
              color="green"
            />
            <StatCard
              title="Published Articles"
              value={stats.articles.published}
              subtitle={`${stats.articles.drafts} drafts`}
              icon={Eye}
              color="purple"
            />
            <StatCard
              title="Active Subscribers"
              value={stats.subscribers.active}
              subtitle="High engagement"
              icon={TrendingUp}
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Articles by Category</h3>
              <div className="space-y-3">
                {Object.entries(stats.articles.byCategory).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="capitalize">{category.replace('-', ' ')}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCurrentView('articles');
                    setShowForm(true);
                  }}
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  New Article
                </button>
                <button
                  onClick={() => setCurrentView('subscribers')}
                  className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Users size={20} />
                  View Subscribers
                </button>
                <button
                  onClick={() => setCurrentView('articles')}
                  className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={20} />
                  Manage Articles
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const ArticleForm = ({ article, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: article?.title || '',
      excerpt: article?.excerpt || '',
      content: article?.content || '',
      category: article?.category || 'cybersecurity',
      author: article?.author || '',
      slug: article?.slug || '',
      published: article?.published || false,
      featured: article?.featured || false
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (e) => {
      const title = e.target.value;
      setFormData({
        ...formData,
        title,
        slug: generateSlug(title)
      });
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">
          {article ? 'Edit Article' : 'Create New Article'}
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cybersecurity">Cybersecurity</option>
                <option value="ai-security">AI Security</option>
                <option value="best-practices">Best Practices</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your article content here... (Markdown supported)"
              required
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="mr-2"
              />
              Published
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              Featured
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {article ? 'Update' : 'Create'} Article
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ArticlesView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Article
        </button>
      </div>

      {showForm ? (
        <ArticleForm
          article={editingArticle}
          onSave={(data) => {
            console.log('Saving article:', data);
            setShowForm(false);
            setEditingArticle(null);
            // Here you would call the API to save the article
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingArticle(null);
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{article.excerpt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {article.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingArticle(article);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this article?')) {
                            console.log('Deleting article:', article.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const SubscribersView = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Subscribers</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribed Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subscriber.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subscriber.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subscriber.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subscriber.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(subscriber.subscribed_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to remove this subscriber?')) {
                        console.log('Removing subscriber:', subscriber.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">🔒 CyberSec Admin</h2>
      </div>
      
      <nav className="space-y-2">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
            currentView === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          <TrendingUp size={20} />
          Dashboard
        </button>
        <button
          onClick={() => setCurrentView('articles')}
          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
            currentView === 'articles' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          <FileText size={20} />
          Articles
        </button>
        <button
          onClick={() => setCurrentView('subscribers')}
          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
            currentView === 'subscribers' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          <Users size={20} />
          Subscribers
        </button>
        <button
          onClick={() => setCurrentView('settings')}
          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
            currentView === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          <Settings size={20} />
          Settings
        </button>
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'articles' && <ArticlesView />}
        {currentView === 'subscribers' && <SubscribersView />}
        {currentView === 'settings' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
