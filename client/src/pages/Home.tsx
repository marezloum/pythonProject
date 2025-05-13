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
          <div className="categories-regular">
            {allCategories &&
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
                ))}
          </div>
          {allInteractiveDictionaries &&
            allInteractiveDictionaries.length > 0 && (
              <div className="category-visual">
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
          {allClickableDictionaries && allClickableDictionaries.length > 0 && (
            <div className="clickable-dictionaries">
              {allClickableDictionaries.map((dictionary) => (
                <div className="card" key={dictionary.id}>
                  <Link
                    to="/clickable-visual-dictionary"
                    state={{
                      imageSrc: dictionary.imageSrc,
                      title: dictionary.title,
                      shapes: dictionary.shapes,
                    }}
                  >
                    <img src={dictionary.imageSrc} alt={dictionary.title} />
                    <span>{dictionary.title}</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Home;
