import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/products/${id}`).then(() => {
      setProducts(products.filter((product) => product.id !== id));
    });
  };

  const handleUpdate = (id) => {
    const newPrice = prompt("Enter new price:");
    const newStock = prompt("Enter new stock:");
    if (newPrice && newStock) {
      axios
        .put(`http://localhost:5000/products/${id}`, {
          ...products.find((p) => p.id === id),
          price: parseFloat(newPrice),
          stock: parseInt(newStock),
        })
        .then(() => {
          setProducts(
            products.map((p) =>
              p.id === id ? { ...p, price: newPrice, stock: newStock } : p
            )
          );
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Product Management Portal</h1>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="border p-2 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-2"
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
          >
            <option value="">All Stores</option>
            {Array.from(new Set(products.map((p) => p.store_name))).map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Store</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((p) => p.product_name.toLowerCase().includes(search.toLowerCase()))
              .filter((p) => (storeFilter ? p.store_name === storeFilter : true))
              .map((product) => (
                <tr key={product.id} className="text-center">
                  <td className="border p-2">{product.store_name}</td>
                  <td className="border p-2">{product.product_name}</td>
                  <td className="border p-2">${product.price}</td>
                  <td className="border p-2">{product.stock}</td>
                  <td className="border p-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleUpdate(product.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
