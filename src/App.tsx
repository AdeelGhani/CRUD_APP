import "./App.css";
import CategoryList from "./Componenets/category/CategoryList";
import Home from "./Componenets/home";
// import PostList from "./Componenets/posts/postlist";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      {/* <div className="bg-dark text-white min-vh-100"> */}
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/post-list" element={<PostList />} /> */}
            <Route path="/category-list" element={<CategoryList />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
