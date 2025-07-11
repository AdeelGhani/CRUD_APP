import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the CRUD App</h1>
      <p>This is a simple React application to manage posts.</p>
      <button
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
        onClick={() => navigate("/post-list")}
      >
        Go to Post List
      </button>
      <button
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
        onClick={() => navigate("/post-list")}
      >
        Go to Product List
      </button>
      <button
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
        onClick={() => navigate("/category-list")}
      >
        Go to Category List
      </button>
    </div>
  );
};

export default Home;
