import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/pages/HomePage.jsx";
import ProductDetail from "./components/pages/ProductDetail.jsx";
import './App.css'
import RegisterPage from "./components/pages/RegisterPage.jsx";
import LoginPage from "./components/pages/LoginPage.jsx";
import PrivateRoute from "./components/modules/PrivateRoute.jsx";
import {AuthProvider} from "./components/context/AuthContext.jsx";
import ProfilePage from "./components/pages/ProfilePage.jsx";
import ManageBooksPage from "./components/pages/ManageBooksPage.jsx";
import CreateBookPage from "./components/pages/CreateBookPage.jsx";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books/:id" element={<ProductDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/books/create" element={<CreateBookPage/>}/>

            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/books/:id" element={<ProductDetail />} />
              <Route path="/manage-books" element={<ManageBooksPage />} />
            </Route>

            {/*<Route element={<AdminRoute />}>*/}
            {/*  <Route path="/admin" element={<AdminPanel />} />*/}
            {/*</Route>*/}
          </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;