import './App.css';

// Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Hooks
import { useAuth } from './hooks/useAuth';

// Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EditProfile from './pages/EditProfile/EditProfile';
import Profile from './pages/Profile/Profile';

function App() {

  const {auth, loading} = useAuth();

  if (loading) {
    return <h1>Carregando...</h1>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={auth ? <Home /> : <Navigate to="/login"/> } />
            <Route path="/profile" element={auth ? <EditProfile /> : <Navigate to="/login"/> } />
            <Route path="/users/:id" element={auth ? <Profile /> : <Navigate to="/login"/> } />
            <Route path="/login" element={!auth ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!auth ? <Register /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
