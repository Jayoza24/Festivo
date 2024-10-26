import { useRef, useEffect } from "react";
import style from "../styles/vendorCard.module.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const extractPrice = (vendorDetails, category) => {
  switch (category) {
    case "Flower Shop":
    case "Lighting Shop":
    case "Designer":
      return vendorDetails.priceRange[0];

    case "DJ":
      return vendorDetails.dayShiftPrice;

    case "Venue":
      return vendorDetails.pricePerDay;

    case "Caters":
      return (
        (parseFloat(vendorDetails.vegFoodPrice) +
          parseFloat(vendorDetails.nonVegFoodPrice)) /
        2
      );

    case "Photographer":
      return vendorDetails.perDayCharge;

    case "Makeup Artist":
      return vendorDetails.perFunctionPrice;

    default:
      return null;
  }
};

gsap.registerPlugin(ScrollTrigger);

const VendorCard = (props) => {
  const navigate = useNavigate();

  const ref = useRef([]);
  ref.current = [];

  useEffect(() => {
    ref.current.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: "0%", scale: 0.9 },
        {
          opacity: "100%",
          scale: 1,
          duration: 0.1,
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=50",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  const addtoRefs = (el) => {
    if (el && !ref.current.includes(el)) {
      ref.current.push(el);
    }
  };

  const renderPriceDetails = () => {
    const { category, vendorDetails } = props.vendorData;

    const priceDetailsMap = {
      "Flower Shop": { label: "Range", prices: [vendorDetails.priceRange] },
      "Lighting Shop": { label: "Range", prices: [vendorDetails.priceRange] },
      Photographer: {
        label: "Per Day Price",
        prices: [vendorDetails.perDayCharge],
      },
      "Makeup Artist": {
        label: "Per Function Price",
        prices: [vendorDetails.perFunctionPrice],
      },
      Designer: { label: "Range", prices: [vendorDetails.priceRange] },
      DJ: {
        label: ["Day", "Night"],
        prices: [vendorDetails.dayShiftPrice, vendorDetails.nightShiftPrice],
      },
      Venue: {
        label: ["Capacity", "Price Per Day"],
        prices: [vendorDetails.capacity, vendorDetails.pricePerDay],
      },
      Caters: {
        label: ["Veg", "Non Veg"],
        prices: [vendorDetails.vegFoodPrice, vendorDetails.nonVegFoodPrice],
      },
    };

    const { label, prices } = priceDetailsMap[category] || {
      label: [],
      prices: [],
    };

    return (
      <div className={style.prices}>
        <div className={style.priceDetails}>
          {Array.isArray(label) ? (
            label.map((l) => <span key={l}>{l}</span>)
          ) : (
            <span>{label}</span>
          )}
        </div>
        <div className={style.price}>
          {prices.map((price, index) => (
            <p key={index}>
              {label[index] === "Capacity" ? price : `₹${price}`}
            </p>
          ))}
        </div>
      </div>
    );
  };

  const addToPlan = async (uid, vid, category) => {
    const price = extractPrice(props.vendorData.vendorDetails, category);
    await axios
      .post(`https://festivo.onrender.com/budget/${uid}/expenses`, {
        vid,
        category,
        price,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div
      className={style.card}
      ref={addtoRefs}
      onClick={() =>
        props.fromPlanning
          ? (addToPlan(
              props.uid,
              props.vendorData._id,
              props.vendorData.category
            ),
            location.reload())
          : navigate(`/vendor/${props.vendorData._id}`)
      }
    >
      <div className={style.img}>
        <img
          className={style.bg}
          src={`https://festivo.onrender.com/uploads/vendors/${props.vendorData.bg}`}
          alt="Vendor Image"
        />
      </div>
      <div className={style.content}>
        <div className={style.name}>
          <p id={style.vName}>{props.vendorData.vendorName}</p>
          <p>{props.vendorData.category}</p>
        </div>
        {renderPriceDetails()}
      </div>
    </div>
  );
};

export default VendorCard;
