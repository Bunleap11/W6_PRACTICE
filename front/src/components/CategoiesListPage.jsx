// CategoryArticlesPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getArticlesByCategory,
  getCategories,
  removeArticle,
} from "../services/api";

// Reuse ArticleCard (you can import it or define it here)
function ArticleCard({ article, onView, onEdit, onDelete, onArticle }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div
        className="article-author"
        onClick={() => onArticle(article.journalistsId)}
        style={{ cursor: "pointer" }}
      >
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

export default function CategoryArticlesPage() {
  const { id } = useParams(); // category id from URL
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch categories for dropdown
  useEffect(() => {
    async function fetchCats() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("Failed to load categories.");
      }
    }
    fetchCats();
  }, []);

  // Fetch articles for selected category
  useEffect(() => {
    async function fetchArticles() {
      setIsLoading(true);
      setError("");
      try {
        const data = await getArticlesByCategory([id]);
        setArticles(data);
        console.log(data);
      } catch {
        setError("Failed to load articles for this category.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchArticles();
  }, [id]);

  const deleteArticle = async (articleId) => {
    try {
      await removeArticle(articleId);
      // refresh articles after deletion
      const data = await getArticlesByCategory([id]);
      setArticles(data);
    } catch {
      setError("Failed to delete article.");
    }
  };

  // Handlers same as your ArticleList page
  const handleView = (id) => navigate(`/articles/${id}`);
  const handleEdit = (id) => navigate(`/articles/${id}/edit`);
  const handleArticle = (id) => navigate(`/journalists/${id}/articles`);

  // When category changes, navigate to that category's articles page
  const handleCategory = (categoryId) => {
    if (categoryId) {
      navigate(`/categories/${categoryId}/articles`);
    } else {
      navigate("/articles"); // back to all articles
    }
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Category filter dropdown */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="category-select">Filter by Category: </label>
        <select
          id="category-select"
          value={id}
          onChange={(e) => handleCategory(e.target.value)}
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
        {articles.length === 0 ? (
          <p>No articles found in this category.</p>
        ) : (
          articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={deleteArticle}
              onArticle={handleArticle}
            />
          ))
        )}
      </div>
    </>
  );
}
