import React from "react";
import VerticalMenu from "../components/VerticalMenu";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="search_area-wrapper">
          <img src="/path/to/your/image.jpg" alt="Hero Image" />
          <div className="search_area">
            <div className="selectors">
              <span>Selector 1</span>
              <span>Selector 2</span>
              <span>Selector 3</span>
            </div>
          </div>
        </div>
      </div>
      <div className="categories_wrapper">
        <h2>Categories</h2>
        <p>Explore our categories</p>
        <div className="categories-regular">
          <div className="row">
            <div className="card">
              <a href="/category-link">
                <img src="/path/to/your/image.jpg" alt="Category Image" />
                <span>Category Title</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="team-section">
        <div className="team-section__content">
          <h2>Meet Our Team</h2>
          <p>We have a great team of professionals</p>
        </div>
      </div>
      <VerticalMenu />
    </div>
  );
};

export default Home;