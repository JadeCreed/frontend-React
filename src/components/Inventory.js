import React, { useEffect, useState } from "react";
import axios from "axios";

function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("https://django-backend-r668.onrender.com/api/items/")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  return (
    <div>
      <h2>Inventory</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} — Stock: {item.total_stock}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventory;
