import React, { useEffect, useState } from "react";
import "./Carousel.scss";
import { InteractiveDictionary } from "../store/interactiveDictionariesSlice";
import { Link } from "react-router-dom";

const items = [
  {
    icon: "face",
    copy: "01. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: "pets",
    copy: "02. Sed do eiusmod tempor incididunt ut labore.",
  },
  {
    icon: "stars",
    copy: "03. Consectetur adipiscing elit.",
  },
  {
    icon: "invert_colors",
    copy: "04. Ut enim ad minim veniam, quis nostrud exercitation.",
  },
  {
    icon: "psychology",
    copy: "05. Llamco nisi ut aliquip ex ea commodo consequat.",
  },
  {
    icon: "brightness_7",
    copy: "06. Misi ut aliquip ex ea commodo consequat.",
  },
];

const Card = React.memo((props: any) => {
  return (
    <div className="card">
      <Link to="/interactivedictionary" state={{ dictionary: props.item }}>
        <img src={"/img/" + props.item.image} alt={props.item.name} />
        <p>{props.item.name}</p>
      </Link>
    </div>
  );
});

function Carousel({ items = [] }: { items: InteractiveDictionary[] }) {
  const [moveClass, setMoveClass] = useState("");
  const [carouselItems, setCarouselItems] = useState(items);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--num",
      carouselItems.length.toString()
    );
  }, [carouselItems]);

  const handleAnimationEnd = () => {
    if (moveClass === "prev") {
      shiftNext([...carouselItems]);
    } else if (moveClass === "next") {
      shiftPrev([...carouselItems]);
    }
    setMoveClass("");
  };

  const shiftPrev = (copy: any) => {
    let lastcard = copy.pop();
    copy.splice(0, 0, lastcard);
    setCarouselItems(copy);
  };

  const shiftNext = (copy: any) => {
    let firstcard = copy.shift();
    copy.splice(copy.length, 0, firstcard);
    setCarouselItems(copy);
  };

  return (
    <div className="carouselwrapper module-wrapper">
      <div className="ui">
        <button onClick={() => setMoveClass("next")} className="prev">
          <span className="material-icons">chevron_left</span>
        </button>
        <button onClick={() => setMoveClass("prev")} className="next">
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
      <div
        onAnimationEnd={handleAnimationEnd}
        className={`${moveClass} carousel`}
      >
        {carouselItems.map((t, index) => (
          <Card key={t.name + index} item={t} />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
