import Slider from "react-slick";
import { Link } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FALLBACK_IMAGE = "/fallback.jpg";

function HeroSlider({ posts }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div style={{ marginBottom: 30 }}>
      <Slider {...settings}>
        {posts.map((p) => (
          <div key={p._id}>
            <div
              style={{
                position: "relative",
                height: 300,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <img
                src={p.thumbnail || FALLBACK_IMAGE}   // ⭐ Always show something
                alt={p.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(70%)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  color: "white",
                }}
              >
                <h2>{p.title}</h2>

                {/* ⭐ FIXED — open by slug, but fallback to ID if missing */}
                <Link to={`/post/${p.slug || p._id}`}>
                  <button>Read More</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HeroSlider;
