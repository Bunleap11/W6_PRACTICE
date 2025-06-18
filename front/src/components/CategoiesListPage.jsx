import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, removeArticle, getCategories } from "../services/api";

export default function CategoriesListPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch {
      setError("Failed to load articles.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Failed to load categories.");
    }
  };

  const deleteArticle = async (id) => {
    try {
      await removeArticle(id);
      await fetchArticles();
    } catch {
      setError("Failed to delete article.");
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);
  const handleEdit = (id) => navigate(`/articles/${id}/edit`);
  const handleArticle = (id) => navigate(`/journalists/${id}/articles`);
  const handleCategory = (id) => navigate(`/categories/${id}/articles`);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Category Buttons */}
      <div style={{ marginBottom: "1rem", marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategory(category.id)}
            className="button-tertiary"
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: "1px solid gray",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Articles */}
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
      <div className="article-author" onClick={() => onArticle(article.journalistsId)}>
        By <a href="#">{article.journalist}</a>
      </div>
      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>Edit</button>
        <button className="button-tertiary" onClick={() => onDelete(article.id)}>Delete</button>
        <button className="button-secondary" onClick={() => onView(article.id)}>View</button>
      </div>
    </div>
  );
}
