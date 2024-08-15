import Register from "./pages/Register";
import Login from "./pages/Login"
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthProvider";
import Dashboard from "./pages/Dashboard";
function App() {


  return (
    
  <AuthProvider>
    <main className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </main>
  </AuthProvider>
  )
}

export default App;
