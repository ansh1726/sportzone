import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios.js";
import toast from "react-hot-toast";

const categories = [
  "Cricket", "Football", "Basketball", "Tennis",
  "Badminton", "Swimming", "Running", "Fitness", "Other",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "Cricket",
  featured: false,
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/products?limit=100");
      setProducts(res.data.products);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImages([]);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      featured: product.featured,
    });
    setImages([]);
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append("featured", form.featured);
      images.forEach((img) => formData.append("images", img));

      if (editingProduct) {
        await axiosInstance.put(`/admin/products/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } else {
        await axiosInstance.post("/admin/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created successfully!");
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/admin/products/${productId}`);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "text-red-400";
    if (stock < 10) return "text-yellow-400";
    return "text-green-400";
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory ? p.category === filterCategory : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-100">Manage Products</h1>
          <p className="text-sm text-gray-500">{products.length} total products</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          + Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 bg-gray-900 border border-gray-800 text-gray-300 text-sm placeholder-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-gray-400 text-sm rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_90px_100px_70px_80px_100px] gap-3 px-4 py-3 bg-gray-950 text-xs text-gray-600 font-medium uppercase tracking-wide">
            <span>Image</span>
            <span>Product</span>
            <span>Price</span>
            <span>Category</span>
            <span>Stock</span>
            <span>Featured</span>
            <span>Actions</span>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No products found</div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-[60px_1fr_90px_100px_70px_80px_100px] gap-3 px-4 py-3 border-t border-gray-800 items-center"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">🏅</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{product.name}</p>
                  <p className="text-xs text-gray-600 truncate max-w-[200px]">{product.description}</p>
                </div>
                <span className="text-sm font-medium text-gray-300">₹{product.price.toLocaleString()}</span>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-md w-fit">{product.category}</span>
                <span className={`text-sm font-medium ${getStockColor(product.stock)}`}>{product.stock}</span>
                <span className={`text-xs px-2 py-1 rounded-full w-fit ${product.featured ? "bg-orange-500/20 text-orange-400" : "bg-gray-800 text-gray-500"}`}>
                  {product.featured ? "Yes" : "No"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-100">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-300 text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Product Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Pro Cricket Bat"
                  required
                  className="w-full bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Short product description..."
                  required
                  rows={2}
                  className="w-full bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleFormChange}
                    placeholder="1499"
                    required
                    min="0"
                    className="w-full bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleFormChange}
                    placeholder="50"
                    required
                    min="0"
                    className="w-full bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Product Images</label>
                <div className="border border-dashed border-gray-700 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <p className="text-2xl mb-1">📷</p>
                    <p className="text-xs text-gray-500">Click to upload images</p>
                    <p className="text-xs text-gray-600 mt-1">JPG, PNG, WEBP up to 5MB</p>
                  </label>
                  {images.length > 0 && (
                    <p className="text-xs text-orange-400 mt-2">{images.length} image(s) selected</p>
                  )}
                  {editingProduct?.images?.length > 0 && images.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">{editingProduct.images.length} existing image(s)</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={form.featured}
                  onChange={handleFormChange}
                  className="w-4 h-4 accent-orange-500"
                />
                <label htmlFor="featured" className="text-sm text-gray-400 cursor-pointer">
                  Mark as Featured (shows on Home page)
                </label>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-800 text-gray-400 text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;