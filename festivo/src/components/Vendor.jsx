import { useEffect, useState } from "react";
import VendorCard from "../elements/VendorCard";
import style from "../styles/vendors.module.css";
import axios from "axios";
import vendorImage from "../assets/vendorImage.jpg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import venueVideo from "../assets/venueShort.mp4";
import catersVideo from "../assets/catersShort.mp4";
import PhotographerVideo from "../assets/photograpyShort.mp4";
import line from "../assets/line.png";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Vendor = () => {
  const [venues, setVenues] = useState([]);
  const [caters, setCaters] = useState([]);
  const [photographer, setPhotographer] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllVendors(["Venue", "Caters", "Photographer"]);
  }, []);

  useGSAP(() => {
    gsap.from("#poster", {
      opacity: 0,
      duration: 1,
      delay: 0.2,
    });
    gsap.to("#searchBar", {
      bottom: "85%",
      position: "fixed",
      width: "80%",
      background: "#F4F3EE",
      scrollTrigger: {
        start: "0%",
        end: "30%",
        scrub: 1,
      },
    });
    gsap.from("#venueVideo", {
      opacity: 0,
      marginLeft: "-30%",
      scrollTrigger: {
        start: "5%",
        end: "15%",
        scrub: 1,
      },
    });
    gsap.from("#catersVideo", {
      opacity: 0,
      marginLeft: "30%",
      scrollTrigger: {
        start: "25%",
        end: "40%",
        scrub: 1,
      },
    });
    gsap.from("#photoVideo", {
      opacity: 0,
      marginLeft: "-30%",
      scrollTrigger: {
        start: "50%",
        end: "65%",
        scrub: 1,
      },
    });
  });

  const getAllVendors = (category) => {
    category.map(async (cat) => {
      await axios
        .get(`http://localhost:5000/vendors/${cat}&${4}`)
        .then((res) => {
          if (cat === "Venue") {
            setVenues(res.data.data);
          }
          if (cat === "Caters") {
            setCaters(res.data.data);
          }
          if (cat === "Photographer") {
            setPhotographer(res.data.data);
          }
        })
        .catch((err) => console.log(err));
    });
  };

  const findVendor = async (name) => {
    await axios
      .get(`http://localhost:5000/vendors/getByName/${name}`)
      .then((res) => navigate(`/vendor/${res.data.data._id}`))
      .catch((err) => console.log(err));
  };

  return (
    <div className={style.main}>
      <div className={style.top} id="poster">
        <img src={vendorImage} alt="background image" />
        <div className={style.searchBar} id="searchBar">
          <input
            type="text"
            name="search"
            placeholder="Search here..."
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                findVendor(event.target.value);
              }
            }}
          ></input>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
      <div className={style.venuePart}>
        <div className={style.left}>
          <h1 onClick={() => navigate("/vendors/Venue")}>Venues</h1>
          <video
            id="venueVideo"
            autoPlay
            muted
            loop
            disablePictureInPicture
            controlsList="nodownload"
          >
            <source src={venueVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={style.right}>
          {venues.length !== 0 ? (
            venues.map((vendor) => {
              return (
                <VendorCard key={vendor._id} vendorData={vendor} onClick />
              );
            })
          ) : (
            <p>No Data</p>
          )}
        </div>
      </div>
      <img src={line} className={style.line} />
      <div className={style.catersPart}>
        <div className={style.left}>
          <h1 onClick={() => navigate("/vendors/Caters")}>Caters</h1>
          <video
            id="catersVideo"
            autoPlay
            muted
            loop
            disablePictureInPicture
            controlsList="nodownload"
          >
            <source src={catersVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={style.right}>
          {caters.length !== 0 ? (
            caters.map((vendor) => {
              return (
                <VendorCard key={vendor._id} vendorData={vendor} onClick />
              );
            })
          ) : (
            <p>No Data</p>
          )}
        </div>
      </div>
      <img src={line} className={style.line} />
      <div className={style.photoPart}>
        <div className={style.left}>
          <h1 onClick={() => navigate("/vendors/Photographer")}>
            Photographers
          </h1>
          <video
            id="photoVideo"
            autoPlay
            muted
            loop
            disablePictureInPicture
            controlsList="nodownload"
          >
            <source src={PhotographerVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={style.right}>
          {photographer.length !== 0 ? (
            photographer.map((vendor) => {
              return (
                <VendorCard key={vendor._id} vendorData={vendor} onClick />
              );
            })
          ) : (
            <p>No Data</p>
          )}
        </div>
      </div>
      <div className={style.others}>
        <div
          className={style.otherCard}
          onClick={() => navigate("/vendors/Lighting Shop")}
        >
          <p>Lighting Shop</p>
        </div>
        <div
          className={style.otherCard}
          onClick={() => navigate("/vendors/Flower Shop")}
        >
          <p>Flowers Shop</p>
        </div>
        <div
          className={style.otherCard}
          onClick={() => navigate("/vendors/Makeup Artist")}
        >
          <p>Make-Up Artists</p>
        </div>
        <div
          className={style.otherCard}
          onClick={() => navigate("/vendors/Designer")}
        >
          <p>Designers</p>
        </div>
        <div
          className={style.otherCard}
          onClick={() => navigate("/vendors/DJ")}
        >
          <p>DJ</p>
        </div>
      </div>
    </div>
  );
};

export default Vendor;
