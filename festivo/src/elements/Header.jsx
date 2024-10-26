import { useState, useEffect } from "react";
import style from "../styles/headerStyle.module.css";
import banner from "../assets/banner.png";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className={`${style.main} ${isVisible ? style.show : style.hide}`}>
      <div className={style.left}>
        <img src={banner} alt="banner" />
      </div>
      <div className={`${style.right} ${isOpen ? style.active : ""}`}>
        <a href="/">Home</a>
        <a href="/vendors">Vendors</a>
        <a href="/planning">Planning</a>
        <button
          onClick={() => {
            navigate("/profile");
          }}
        >
          Hello! {props.name}
        </button>
      </div>
      <button className={style.menuButton} onClick={toggleMenu}>
        ☰
      </button>
    </div>
  );
};

export default Header;
