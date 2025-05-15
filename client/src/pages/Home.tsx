import { useState } from "react";
import FilterComponent from "../components/FilterComponent";
import SearchComponent from "../components/SearchComponent";
import "./Home.scss"; // Import the SASS styles
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Carousel from "../components/Carousel";

function Home() {
  const [showSearch, setShowSearch] = useState(true);

  const allCategories = useSelector(
    (state: RootState) => state.categories.allCategories
  );

  const allInteractiveDictionaries = useSelector(
    (state: RootState) =>
      state.interactiveDictionaries.allInteractiveDictionaries
  );

  const allClickableDictionaries = useSelector(
    (state: RootState) => state.clickableDictionaries.allClickableDictionaries
  );

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleShowFilter = () => {
    setShowSearch(false);
  };
  return (
    <main>
      <div className="container home">
        <div className="hero">
          <div className="search_area-wrapper">
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
        </div>
        <div className="categories_wrapper">
          <h2>Лексико-иллюстративный словарь</h2>
          <p>
            Откройте каждое слово — с подробным объяснением, переводом и
            наглядной иллюстрацией.
          </p>
          <div className="categories-regular">
            {allCategories && allCategories.length > 0 && (
              <>
                <div className="row">
                  <div
                    className="card"
                    key={`regular-category-${allCategories[0].id}`}
                  >
                    <Link
                      to="/category"
                      state={{
                        categoryId: allCategories[0].id,
                      }}
                    >
                      <img
                        src={
                          allCategories[0].image
                            ? "/img/" + allCategories[0].image
                            : "/img/regular-category-placeholder.png"
                        }
                        alt={allCategories[0].name}
                      />
                      <span>{allCategories[0].name}</span>
                    </Link>
                  </div>
                  <div className="double-card">
                    <div
                      className="card"
                      key={`regular-category-${allCategories[1].id}`}
                    >
                      <Link
                        to="/category"
                        state={{
                          categoryId: allCategories[1].id,
                        }}
                      >
                        <img
                          src={
                            allCategories[1].image
                              ? "/img/" + allCategories[1].image
                              : "/img/regular-category-placeholder.png"
                          }
                          alt={allCategories[1].name}
                        />
                        <span>{allCategories[1].name}</span>
                      </Link>
                    </div>
                    <div
                      className="card"
                      key={`regular-category-${allCategories[2].id}`}
                    >
                      <Link
                        to="/category"
                        state={{
                          categoryId: allCategories[2].id,
                        }}
                      >
                        <img
                          src={
                            allCategories[2].image
                              ? "/img/" + allCategories[2].image
                              : "/img/regular-category-placeholder.png"
                          }
                          alt={allCategories[2].name}
                        />
                        <span>{allCategories[2].name}</span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="double-card">
                    <div
                      className="card"
                      key={`regular-category-${allCategories[3].id}`}
                    >
                      <Link
                        to="/category"
                        state={{
                          categoryId: allCategories[3].id,
                        }}
                      >
                        <img
                          src={
                            allCategories[3].image
                              ? "/img/" + allCategories[3].image
                              : "/img/regular-category-placeholder.png"
                          }
                          alt={allCategories[3].name}
                        />
                        <span>{allCategories[3].name}</span>
                      </Link>
                    </div>
                    <div
                      className="card"
                      key={`regular-category-${allCategories[4].id}`}
                    >
                      <Link
                        to="/category"
                        state={{
                          categoryId: allCategories[4].id,
                        }}
                      >
                        <img
                          src={
                            allCategories[4].image
                              ? "/img/" + allCategories[4].image
                              : "/img/regular-category-placeholder.png"
                          }
                          alt={allCategories[4].name}
                        />
                        <span>{allCategories[4].name}</span>
                      </Link>
                    </div>
                  </div>
                  <div
                    className="card"
                    key={`regular-category-${allCategories[5].id}`}
                  >
                    <Link
                      to="/category"
                      state={{
                        categoryId: allCategories[5].id,
                      }}
                    >
                      <img
                        src={
                          allCategories[5].image
                            ? "/img/" + allCategories[5].image
                            : "/img/regular-category-placeholder.png"
                        }
                        alt={allCategories[5].name}
                      />
                      <span>{allCategories[5].name}</span>
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* {allCategories &&
              allCategories.length > 0 &&
              allCategories
                .filter((_, index) => index < 4)
                .map((category) => (
                  <div className="card" key={`regular-category-${category.id}`}>
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
                ))} */}
          </div>

          {allClickableDictionaries && allClickableDictionaries.length > 0 && (
            <div className="clickable-dictionaries">
              {allClickableDictionaries.map((dictionary) => (
                <div className="card" key={dictionary.id}>
                  <img src={dictionary.imageSrc} alt={dictionary.title} />
                  <div>
                    <h2>Ономасиологический словарь (интерактивная картинка)</h2>
                    <p>
                      Кликайте на части изображения — и узнайте, как это
                      называется на русском и персидском.
                    </p>
                    <Link
                      to="/clickable-visual-dictionary"
                      state={{
                        imageSrc: dictionary.imageSrc,
                        title: dictionary.title,
                        shapes: dictionary.shapes,
                      }}
                    >
                      <button>открыть</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          {allInteractiveDictionaries &&
            allInteractiveDictionaries.length > 0 && (
              <div className="category-visual">
                <h2>Ассоциативно-визуальный словарь</h2>
                <p>Исследуйте тему: список слов связан с изображением. Нажимайте — и увидите соответствие.</p>
                <Carousel items={allInteractiveDictionaries} />
              </div>
            )}

          {/* <div className="categories-regular">
            {allCategories &&
              allCategories.length > 4 &&
              allCategories
                .filter((_, index) => index >= 4 && index < 8)
                .map((category) => (
                  <div className="card" key={`regular-category-${category.id}`}>
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
          </div> */}
        </div>
        <div className="team-section">
          <img
            src="/img/team.png"
            alt="Team illustration"
            className="team-section__img"
          />
          <div className="team-section__content">
            <h2>Мы</h2>
            <p>
              команда лингвистов с сердцем и мышлением разработчиков.
              Мы знаем, как устроен язык, и умеем превращать лингвистические идеи в современные цифровые решения.
              Впервые проекты создаются не просто айтишниками — а теми, кто сам дышит языком, понимает потребности студентов и учёных.
              Мы объединяем лингвистику, дизайн и технологии, чтобы сделать обучение языкам глубоким, наглядным и по-настоящему удобным.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
