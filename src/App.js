import Inventory from "./components/Inventory";
import Allocation from "./components/Allocation";
import AllocationMap from "./components/AllocationMap";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Management</h1>
      <Inventory />
      <hr />
      <Allocation />
    </div>
  );
}

export default App;
