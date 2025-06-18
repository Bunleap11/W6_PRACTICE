import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticlesByJournalistId } from "../services/api";

export default function ArticleListByJournalist() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    fetchArticles();
  }, [id]); // Re-fetch if ID changes

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticlesByJournalistId(id); 
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onView={handleView}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author" >
        By {article.journalistName}
      </div>
      <div className="article-actions">
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}
