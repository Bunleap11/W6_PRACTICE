import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, removeArticle, getCategories, getArticlesByCategory } from "../services/api";

//
// ArticleList component
//
export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles(); // Fetch all articles when component mounts
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCate(); 
  }, []);
  const fetchCate = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  const fetchFilteredArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (selectedCategories.length === 0) {
        const data = await getArticles();
        setArticles(data);
      } else {
        const data = await getArticlesByCategory(selectedCategories);
        setArticles(data);
      }
    } catch (err) {
      setError("Failed to load filtered articles.");
    } finally {
      setIsLoading(false);
    }
  };

  fetchFilteredArticles();
}, [selectedCategories]);

  const toggleCategory = (id) => {
  handleCategory(id);
};


  
  const deleteArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      await removeArticle(id);
      await fetchArticles(); // refresh the list
    } catch (err) {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
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

        
      <div style={{ marginBottom: "1rem",marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id) }

              className="button-tertiary"
              value={category.id}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                border: isSelected ? "2px solid blue" : "1px solid gray",
                backgroundColor: isSelected ? "#cce4ff" : "#f0f0f0",
                cursor: "pointer"
              }}
            >
              {category.name}
            </button>
          );
        })}
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
      <div className="article-author" onClick={() => onArticle(article.journalistsId)}>By <a href="">{article.journalist}</a> </div>
      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button
          className="button-tertiary"
          onClick={() => onDelete(article.id)}
        >
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}
