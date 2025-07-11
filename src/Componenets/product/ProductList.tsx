import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByCategoryId,
} from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import type {
  Product,
  ProductResponse,
  Category,
} from "../../interfaces/interfaces";
import type { AxiosResponse } from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const initialFormState: Omit<Product, "id"> = {
  productName: "",
  productDescription: "",
  price: 0,
  stockQuantity: 0,
  sku: "",
  imageUrl: "",
  isActive: true,
  categoryId: 0,
  createdDate: new Date().toISOString(),
  updatedDate: null,
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<Product, "id">>(initialFormState);
  const [editId, setEditId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = () => {
    setLoading(true);
    // Check for categoryId in search params
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      getProductsByCategoryId(Number(categoryId))
        .then((response: AxiosResponse<ProductResponse>) => {
          setProducts(response.data.items);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch products by category");
          setLoading(false);
        });
    } else {
      getAllProducts()
        .then((response: AxiosResponse<ProductResponse>) => {
          setProducts(response.data.items);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch products");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchProducts();
    // Fetch categories for dropdown
    getAllCategories()
      .then((response) => setCategories(response.data))
      .catch(() => setCategories([]));
  }, []);

  const handleShowModal = () => {
    setForm({
      ...initialFormState,
      createdDate: new Date().toISOString(),
      updatedDate: null,
    });
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
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId === null) {
        await createProduct({
          ...form,
          createdDate: new Date().toISOString(),
          updatedDate: null,
        });
      } else {
        await updateProduct(editId, {
          ...form,
          updatedDate: new Date().toISOString(),
        });
      }
      fetchProducts();
      handleCloseModal();
    } catch {
      setError("Failed to save product");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const { data } = await getProductById(id);
      setForm({
        productName: data.productName,
        productDescription: data.productDescription,
        price: data.price,
        stockQuantity: data.stockQuantity,
        sku: data.sku,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        categoryId: data.categoryId,
        createdDate: data.createdDate,
        updatedDate: data.updatedDate ?? null,
      });
      setEditId(id);
      setShowModal(true);
    } catch {
      setError("Failed to fetch product for edit");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch {
      setError("Failed to delete product");
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Product List</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Button variant="primary" onClick={handleShowModal}>
          Add Product
        </Button>
        <div>
          <Button
            variant="primary"
            className="me-2"
            onClick={() => navigate("/category-list")}
          >
            Go to Category List
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
            <th>Price</th>
            <th>Stock</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((prod, idx) => (
              <tr key={prod.id}>
                <td>{idx + 1}</td>
                <td>{prod.productName}</td>
                <td>{prod.productDescription}</td>
                <td>{prod.price}</td>
                <td>{prod.stockQuantity}</td>
                <td>{prod.sku}</td>
                <td>
                  {categories.find((cat) => cat.id === prod.categoryId)?.categoryName || "-"}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(prod.id)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(prod.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">No Products Found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId === null ? "Add Product" : "Edit Product"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={form.productName}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="productDescription"
                value={form.productDescription}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={form.price}
                onChange={handleFormChange}
                required
                min={0}
                step={0.01}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleFormChange}
                required
                min={0}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>SKU</Form.Label>
              <Form.Control
                type="text"
                name="sku"
                value={form.sku}
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
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="categoryId"
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: Number(e.target.value) })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </Form.Select>
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

export default ProductList;
