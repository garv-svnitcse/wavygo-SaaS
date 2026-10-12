
import { Routes, Route, Navigate } from "react-router-dom";
import AddVehicle from "./pages/AddVehicle.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vehicles/add" replace />} />
      <Route path="/vehicles/add" element={<AddVehicle />} />
    </Routes>
  );
}
