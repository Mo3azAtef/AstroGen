import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryItemsPage from "./pages/CategoryItemsPage";
import ArticlePage from "./pages/ArticlePage";
import ChatbotPage from "./pages/ChatbotPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categoryName" element={<CategoryItemsPage />} />
          <Route path="/article/:articleId" element={<ArticlePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;