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
import Ask from "./pages/Ask";
import VerticalMenu from "./components/VerticalMenu";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <VerticalMenu />
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
          <Route path="/ask" element={<Ask />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
