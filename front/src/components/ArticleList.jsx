// ArticleList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, removeArticle, getCategories } from "../services/api";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Failed to load categories.");
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticles();
      setArticles(data);
    } catch {
      setError("Failed to load articles.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    try {
      await removeArticle(id);
      fetchArticles(); // Refresh articles after deletion
    } catch {
      setError("Failed to delete article.");
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);
  const handleEdit = (id) => navigate(`/articles/${id}/edit`);
  const handleArticle = (id) => navigate(`/journalists/${id}/articles`);

  // Navigate to category articles page on category select
  const handleCategory = (id) => {
    if (id) {
      navigate(`/categories/${id}/articles`);
    } else {
      navigate("/articles"); // Show all articles
    }
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="category-select">Filter by Category: </label>
        <select
          id="category-select"
          onChange={(e) => handleCategory(e.target.value)}
          defaultValue=""
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={deleteArticle}
            onArticle={handleArticle}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete, onArticle }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author" onClick={() => onArticle(article.journalistsId)} style={{ cursor: "pointer" }}>
        By <a href="#">{article.journalistName}</a>
      </div>
      <div className="article-category">Category: {article.categoryName}</div>
      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button className="button-tertiary" onClick={() => onDelete(article.id)}>
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}
