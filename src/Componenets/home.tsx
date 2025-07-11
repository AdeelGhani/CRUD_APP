import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the CRUD App</h1>
      <p>This is a simple React application.</p>

      <Button
        variant="primary"
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
        onClick={() => navigate("/product-list")}
        className="me-2"
      >
        Go to Product List
      </Button>
      <Button
        variant="primary"
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
        onClick={() => navigate("/category-list")}
      >
        Go to Category List
      </Button>
    </div>
  );
};

export default Home;
