import { useDispatch, useSelector } from "react-redux";
import "./Header.scss";
import { RootState } from "../store/store";
import { useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { clearUser, setUser } from "../store/userSlice";
import axios from "axios";
import {
  Category as CategoryType,
  setAllCategories,
} from "../store/categoriesSlice";
import {
  InteractiveDictionary,
  setAllInteractiveDictionaries,
} from "../store/interactiveDictionariesSlice";
import {
  ClickableDictionary,
  setAllClickableDictionaries,
} from "../store/clickableDictionariesSlice";

function Header() {
  const { id: userId, user_role } = useSelector(
    (state: RootState) => state.user
  );
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies, _, removeCookie] = useCookies<"userId", CookieValues>([
    "userId",
  ]);

  const dispatch = useDispatch();
  const handleLogout = () => {
    removeCookie("userId");
    dispatch(clearUser());
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const fetchUser = useCallback(
    async (userId: string) => {
      try {
        const response = await axios.post("http://localhost:3008/fetchuser", {
          userId,
        });
        if (response.data.user) {
          dispatch(setUser(response.data.user));
        } else {
          removeCookie("userId");
          dispatch(clearUser());
        }
      } catch (error: any) {
        return null;
      }
    },
    [dispatch, removeCookie]
  );

  useEffect(() => {
    if (!userId) {
      if (cookies.userId) {
        fetchUser(cookies.userId);
      }
    }
    const script = document.createElement("script");

    script.src = "/js/custom.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [userId, cookies.userId, dispatch, fetchUser]);

  const fetchNormalWordsCategories = useCallback(async () => {
    try {
      const response = await axios.get<CategoryType[]>(
        "http://localhost:3008/allcategories"
      );
      dispatch(setAllCategories(response.data));
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [dispatch]);

  const fetchInteractiveDictionaries = useCallback(async () => {
    try {
      const response = await axios.get<InteractiveDictionary[]>(
        "http://localhost:3008/interactivedictionaries"
      );
      dispatch(setAllInteractiveDictionaries(response.data));
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [dispatch]);

  const fetchClickableDictionaries = useCallback(async () => {
    try {
      const response = await axios.get<ClickableDictionary[]>(
        "http://localhost:3008/clickable-dictionaries"
      );
      dispatch(setAllClickableDictionaries(response.data));
    } catch (error) {
      console.error("Error fetching clickable dictionaries", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchNormalWordsCategories();
    fetchInteractiveDictionaries();
    fetchClickableDictionaries(); // Fetch clickable dictionaries
  }, [
    fetchNormalWordsCategories,
    fetchInteractiveDictionaries,
    fetchClickableDictionaries,
  ]);

  return (
    <header>
      <div className="row">
        <div className="logo">
          <Link to="/"><img src="img/logo.svg" alt="" /></Link>
        </div>
        <div className="frame">
          <div className="center">
            <div className="line line-one">
              <div className="line-one-fill"></div>
            </div>
            <div className="menu">
              <ul>
                <li>
                  <Link to="/ask">Форум</Link>
                </li>
                {userId ? (
                  <>
                    <li>
                      <Link to="/profile">Профиль</Link>
                    </li>
                    <li>
                      <a onClick={() => handleLogout()}>Выйти</a>
                    </li>
                    {user_role === "admin" &&
                      location.pathname !== "/addword" && (
                        <li>
                          <Link to="/addword">Добавить слово</Link>
                        </li>
                      )}
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login">Войти</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="line line-two">
              <div className="line-one-fill"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="title">
        <span>Русско-персидский онлайн словарь</span>
        <span>فرهنگ آنلاین روسی به فارسی</span>
      </div>
    </header>
  );
}
export default Header;
