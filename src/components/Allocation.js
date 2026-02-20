import React, { useEffect, useState } from "react";
import axios from "axios";
import AllocationMap from "./AllocationMap";
import barangays from "../data/barangays";

function Allocation() {
  const [allocations, setAllocations] = useState([]);
  const [items, setItems] = useState([]);
  const [flyToBrgy, setFlyToBrgy] = useState(null);

  const [newAllocation, setNewAllocation] = useState({
    barangay: "",
    allocated_quantity: 0,
    item: 1
  });

  // Fetch allocations
  const fetchAllocations = () => {
    axios
      .get("http://127.0.0.1:8000/api/allocations/")
      .then((res) => setAllocations(res.data))
      .catch((err) => console.error(err));
  };

  // Fetch items
  const fetchItems = () => {
    axios
      .get("http://127.0.0.1:8000/api/items/")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAllocations();
    fetchItems();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewAllocation({
      ...newAllocation,
      [name]: name === "allocated_quantity" ? Number(value) : value
    });
  };

  // Add allocation
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newAllocation.barangay || newAllocation.allocated_quantity <= 0) {
      alert("Please enter valid barangay and quantity");
      return;
    }

    const itemStock =
      items.find((i) => i.id === Number(newAllocation.item))?.total_stock || 0;

    if (newAllocation.allocated_quantity > itemStock) {
      alert("Allocated quantity exceeds available stock!");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/allocations/", newAllocation)
      .then((res) => {
        // ADD instantly to state
        setAllocations((prev) => [...prev, res.data]);

        // Fly to new marker
        setFlyToBrgy(res.data.barangay);

        // Reset form
        setNewAllocation({
          barangay: "",
          allocated_quantity: 0,
          item: 1
        });

        fetchItems();
      })
      .catch((err) => console.error(err));
  };

  // Distribute allocation
  const distribute = (id) => {
    axios
      .post(`http://127.0.0.1:8000/api/allocations/${id}/distribute/`)
      .then(() => {
        // Update instantly
        setAllocations((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, distributed: true } : a
          )
        );

        fetchItems();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Create Allocation</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select
          name="barangay"
          value={newAllocation.barangay}
          onChange={handleChange}
          required
        >
          <option value="">Select Barangay</option>
          {barangays.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="allocated_quantity"
          value={newAllocation.allocated_quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />

        <button type="submit">Add</button>
      </form>

      <h2>Allocations</h2>

      <table border="1" cellPadding="8" style={{ marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Barangay</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((alloc) => (
            <tr key={alloc.id}>
              <td>{alloc.barangay}</td>
              <td>{alloc.allocated_quantity}</td>
              <td>{alloc.distributed ? "Done" : "Pending"}</td>
              <td>
                {!alloc.distributed && (
                  <button onClick={() => distribute(alloc.id)}>
                    Distribute
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Map</h2>
      <AllocationMap allocations={allocations} flyToBrgy={flyToBrgy} />
    </div>
  );
}

export default Allocation;