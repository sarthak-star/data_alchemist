import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ManageData from "./screens/ManageData";
import ConfigureRules from "./screens/ConfigureRules";
import FileEditor from "./screens/FileEditor";

function App() {

  return (
    <div>
      <Navbar />

      <div className="bg-gray-800">
        <Routes>
          <Route path="/" element={<Navigate to="/manage" />} />
          <Route path="/manage" element={<ManageData />} />
          <Route path="/manage/:fileType/:fileName" element={<FileEditor />} />
          <Route path="/configure" element={<ConfigureRules />} />
          {/* Optional 404 route */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
