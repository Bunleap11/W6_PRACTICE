//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//
import { pool } from "../utils/database.js"

// Get all articles
export async function getArticles() {
    // TODO
    const [rows] = await pool.query("SELECT * FROM articles");
    return rows;
}

// Get one article by ID
export async function getArticleById(id) {
    // TODO
    const [rows] = await pool.query(`
        SELECT articles.*, journalists.name as journalistName FROM articles 
        JOIN journalists ON articles.journalistsId = journalists.id
        WHERE articles.id = ?
    `, [id]);
    return rows[0];
}

// Create a new article
export async function createArticle(article) {
    // TODO
    const [result] = await pool.query("INSERT INTO articles (title, content, journalist, category) VALUES (?, ?, ?, ?)", [article.title, article.content, article.journalist, article.category]);
    return { id: result.insertId, ...article };
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    // TODO
    const [result] = await pool.query("UPDATE articles SET title = ?, content = ?, journalist = ?, category = ? WHERE id = ?", [updatedData.title, updatedData.content, updatedData.journalist, updatedData.category, id]);
    if (result.affectedRows === 0) {
        return null;
    }
    return { id, ...updatedData };  
}

// Delete an article by ID
export async function deleteArticle(id) {
    // TODO
    const [result] = await pool.query("DELETE FROM articles WHERE id = ?", [id]);
    return result.affectedRows > 0; 
}
export async function getArticlesWithJournalist() {
    const [rows] = await pool.query(`
        SELECT articles.*,journalists.name as journalistName FROM articles
        JOIN journalists ON articles.journalistsId = journalists.id
    `);
    return rows[0];
}
export async function getArticleByJournalistName(name){
    const [rows] = await pool.query(`
        SELECT articles.*, journalists.name as journalistName FROM articles
        JOIN journalists ON articles.journalistsId = journalists.id
        WHERE journalists.name = ?
    `, [name]);
    return rows;
}
export async function getAllCategory() {
    // TODO
      console.log("getAllCategory")
    const [rows] = await pool.query("SELECT * FROM categories");
    return rows;
}
export async function getArticlesByCategoryId(id) {
    const [rows] = await pool.query(`
        SELECT articles.*, categories.name as categoryName FROM articles
        JOIN categories ON articles.categoryId = categories.id
        WHERE categories.id = ?
    `, [id]);
    return rows;
}



