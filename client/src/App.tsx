// src/App.tsx
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Provider } from "react-redux";
import store from "./store/store";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import VisualWord from "./pages/VisualWord";
import Category from "./pages/Category";
import InteractiveDictionaryPage from "./pages/InteractiveDictionary";
import AddWord from "./pages/Addword";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/word" element={<VisualWord />} />
          <Route
            path="/interactivedictionary"
            element={<InteractiveDictionaryPage />}
          />
          <Route path="/category" element={<Category />} />
          <Route path="/addword" element={<AddWord />} />
        </Routes>
      </Router>
      <Footer />
    </Provider>
  );
}

export default App;
