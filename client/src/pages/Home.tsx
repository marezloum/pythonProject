import { useState } from "react";
import FilterComponent from "../components/FilterComponent";
import SearchComponent from "../components/SearchComponent";
import "./Home.scss"; // Import the SASS styles
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Carousel from "../components/Carousel";
import { title } from "process";
import { start } from "repl";

function Home() {
  const [showSearch, setShowSearch] = useState(true);

  const allCategories = useSelector(
    (state: RootState) => state.categories.allCategories
  );

  const allInteractiveDictionaries = useSelector(
    (state: RootState) =>
      state.interactiveDictionaries.allInteractiveDictionaries
  );

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleShowFilter = () => {
    setShowSearch(false);
  };

  return (
    <main>
      <div className="container">
        <div className="hero">
          <div className="title">
            <span>Русско-персидский онлайн словарь</span>
            <span>فرهنگ آنلاین روسی به فارسی</span>
          </div>
          <div className="search_area-wrapper">
            <img src="./img/hero-image.svg" alt="" srcSet="" />
            <div className="search_area">
              <div className="selectors">
                <span onClick={() => handleShowSearch()}>search</span>
                <span onClick={() => handleShowFilter()}>filter</span>
              </div>
              <div className="search_filter">
                <SearchComponent show={showSearch} />
                <FilterComponent show={!showSearch} />
              </div>
            </div>
          </div>
          <div className="categories_wrapper">
            <div className="categories-regular">
              {allCategories &&
                allCategories.length > 0 &&
                allCategories
                  .filter((_, index) => index < 4)
                  .map((category) => (
                    <div
                      className="card"
                      key={`regular-category-${category.id}`}
                    >
                      <Link
                        to="/category"
                        state={{
                          categoryId: category.id,
                        }}
                      >
                        <img
                          src={
                            category.image
                              ? "/img/" + category.image
                              : "/img/regular-category-placeholder.png"
                          }
                          alt={category.name}
                        />
                        <span>{category.name}</span>
                      </Link>
                    </div>
                  ))}
            </div>
            {allInteractiveDictionaries &&
              allInteractiveDictionaries.length > 0 && (
                <div className="category-visual">
                  <Carousel items={allInteractiveDictionaries} />
                </div>
              )}

            <div className="categories-regular">
              {allCategories &&
                allCategories.length > 4 &&
                allCategories
                  .filter((_, index) => index >= 4 && index < 8)
                  .map((category) => (
                    <div
                      className="card"
                      key={`regular-category-${category.id}`}
                    >
                      <Link
                        to="/category"
                        state={{
                          categoryId: category.id,
                        }}
                      >
                        <img
                          src={
                            category.image
                              ? "/img/" + category.image
                              : "/img/regular-category-placeholder.png"
                          }
                          alt={category.name}
                        />
                        <span>{category.name}</span>
                      </Link>
                    </div>
                  ))}
            </div>
            <div className="category-visual">
              <div className="card">
                <Link
                  to="/clickable-visual-dictionary"
                  state={{
                    imageSrc: "/img/grocery-store.jpg",
                    title: "Овощи и фрукты",
                    shapes: [
                      {
                        title: "Тыква",
                        top: 12,
                        left: 15,
                        width: 16,
                        height: 10,
                      },
                      {
                        title: "Зеленый лук",
                        top: 11,
                        left: 30,
                        width: 9,
                        height: 11,
                      },
                      {
                        title: "Ананас",
                        top: 9,
                        left: 63,
                        width: 12,
                        height: 13,
                      },
                      {
                        title: "Огурец",
                        top: 11,
                        left: 75,
                        width: 9,
                        height: 11,
                      },
                      {
                        title: "Красный перец",
                        top: 24,
                        left: 15,
                        width: 14,
                        height: 8,
                      },
                      {
                        title: "Белокочанная капуста",
                        top: 23,
                        left: 35,
                        width: 10,
                        height: 9,
                      },
                      {
                        title: "Огурец1",
                        hidden: true,
                        top: 22,
                        left: 45,
                        width: 9,
                        height: 10,
                      },
                      {
                        title: "Огурец2",
                        hidden: true,
                        top: 24,
                        left: 54,
                        width: 8,
                        height: 8,
                      },
                      {
                        title: "Фасоль",
                        top: 47,
                        left: 14,
                        width: 15,
                        height: 9,
                      },
                      {
                        title: "Лук красный",
                        top: 47,
                        left: 28,
                        width: 15,
                        height: 9,
                      },
                      {
                        title: "Банан",
                        top: 45,
                        left: 42,
                        width: 15,
                        height: 11,
                      },
                      {
                        title: "Чеснок",
                        top: 46,
                        left: 57,
                        width: 15,
                        height: 10,
                      },
                      {
                        title: "Морковь",
                        top: 46,
                        left: 71,
                        width: 15,
                        height: 10,
                      },
                      {
                        title: "Огурец",
                        top: 55,
                        left: 12,
                        width: 15,
                        height: 8,
                      },
                      {
                        title: "Яблоко",
                        top: 55,
                        left: 27,
                        width: 15,
                        height: 8,
                      },
                      {
                        title: "Лимон",
                        top: 55,
                        left: 42,
                        width: 15,
                        height: 8,
                      },
                      {
                        title: "Баклажан",
                        top: 55,
                        left: 58,
                        width: 15,
                        height: 8,
                      },
                      {
                        title: "Апельсин",
                        top: 55,
                        left: 73,
                        width: 15,
                        height: 8,
                      },
                      {
                        title: "Лимон",
                        top: 62,
                        left: 8,
                        width: 17,
                        height: 11,
                      },
                      {
                        title: "Перец",
                        top: 62,
                        left: 25,
                        width: 17,
                        height: 11,
                      },
                      {
                        title: "Лук",
                        top: 62,
                        left: 41,
                        width: 17,
                        height: 11,
                      },
                      {
                        title: "Авокадо",
                        top: 62,
                        left: 58,
                        width: 17,
                        height: 11,
                      },
                      {
                        title: "Помидор",
                        top: 62,
                        left: 75,
                        width: 17,
                        height: 11,
                      },
                    ],
                  }}
                >
                  <img src="/img/grocery-store.jpg" alt="visual dictionary" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
