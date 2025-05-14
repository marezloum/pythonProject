// src/App.tsx
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Provider } from "react-redux";
import store from "./store/store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VisualWord from "./pages/VisualWord";
import Category from "./pages/Category";
import InteractiveDictionaryPage from "./pages/InteractiveDictionary";
import AddWord from "./pages/Addword";
import ClickableVisualDictionary from "./pages/ClickableVisualDictionary";
import ProfilePage from "./pages/ProfilePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/word" element={<VisualWord />} />
          <Route
            path="/interactivedictionary"
            element={<InteractiveDictionaryPage />}
          />
          <Route path="/category" element={<Category />} />
          <Route path="/addword" element={<AddWord />} />
          <Route
            path="/clickable-visual-dictionary"
            element={<ClickableVisualDictionary />}
          />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <Footer />
        {/* Floating Telegram Button */}
        <a
          href="https://t.me/marezloum_bot"
          className="floating-telegram-btn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on Telegram"
        >
          <FontAwesomeIcon icon={faMessage} size="2x" />
        </a>
      </Router>
    </Provider>
  );
}

export default App;
