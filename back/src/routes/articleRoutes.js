import { Router } from "express";
import { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle, getArticlesByJournalistId, getAllCategory, getArticlesByCategoryId } from "../controllers/articleController.js";

const articleRouter = Router();
articleRouter.get("/", getAllArticles);
articleRouter.get("/categories", getAllCategory);
articleRouter.get("/:id", getArticleById);
articleRouter.post("/", createArticle);
articleRouter.put("/:id", updateArticle);
articleRouter.delete("/:id", deleteArticle);
articleRouter.get("/journalists/:id/articles", getArticlesByJournalistId); 
articleRouter.get("/categories/:id/articles", getArticlesByCategoryId);
export default articleRouter;
