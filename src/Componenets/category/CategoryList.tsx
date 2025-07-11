import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../../api/categoryApi";
import type { Category } from "../../interfaces/interfaces";
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

const initialFormState: Omit<Category, "id"> = {
  categoryName: "",
  categoryDescription: "",
  imageUrl: "",
  isActive: true,
  createdDate: new Date().toISOString(),
  updatedDate: null,
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<Category, "id">>(initialFormState);
  const [editId, setEditId] = useState<number | null>(null);
  const navigate = useNavigate();
  const fetchCategories = () => {
    setLoading(true);
    getAllCategories()
      .then((response: AxiosResponse<Category[]>) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch categories");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleShowModal = () => {
    setForm(initialFormState);
    setEditId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(initialFormState);
    setEditId(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && e.target instanceof HTMLInputElement
          ? e.target.checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId === null) {
        await createCategory(form);
      } else {
        await updateCategory(editId, form);
      }
      fetchCategories();
      handleCloseModal();
    } catch {
      setError("Failed to save category");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const { data } = await getCategoryById(id);
      setForm({
        categoryName: data.categoryName,
        categoryDescription: data.categoryDescription,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        createdDate: data.createdDate,
        updatedDate: data.updatedDate,
      });
      setEditId(id);
      setShowModal(true);
    } catch {
      setError("Failed to fetch category for edit");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch {
      setError("Failed to delete category");
    }
  };

  const handleViewProducts = async (id: number) => {
    navigate(`/product-list?categoryId=${id}`);
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Category List</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Button variant="primary" onClick={handleShowModal}>
          Add Category
        </Button>
        <div>
          <Button
            variant="primary"
            className="me-2"
            onClick={() => navigate("/product-list")}
          >
            Go to Product List
          </Button>

          <Button variant="primary" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, idx) => (
            <tr key={cat.id}>
              <td>{idx + 1}</td>
              <td>{cat.categoryName}</td>
              <td>{cat.categoryDescription}</td>


              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(cat.id)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(cat.id)}
                  className="me-2"
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewProducts(cat.id)}
                >
                  View Products
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId === null ? "Add Category" : "Edit Category"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="categoryName"
                value={form.categoryName}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="categoryDescription"
                value={form.categoryDescription}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={form.isActive}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editId === null ? "Add" : "Update"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
