import { Card, Button } from "react-bootstrap";
import type { Post } from "../../interfaces/interfaces";

interface PostCardProps {
  post: Post;
  index: number;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const PostCard = ({ post, index, onEdit, onDelete }: PostCardProps) => {
  return (
    <Card
      className="mb-4 p-3 h-100 d-flex flex-column"
      style={{ backgroundColor: "#1e789b", color: "white" }}
    >
      <p>{index + 1}.</p>
      <Card.Body className="d-flex flex-column flex-grow-1">
        <Card.Title className="fw-semibold">Title: {post.title}</Card.Title>
        <Card.Text className="mb-4">
          <strong>News:</strong> {post.body}
        </Card.Text>

        {/* Push buttons to bottom */}
        <div className="mt-auto d-flex gap-2">
          <Button variant="success" onClick={() => onEdit(post)}>
            EDIT
          </Button>
          <Button variant="danger" onClick={() => onDelete(post)}>
            DELETE
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostCard;