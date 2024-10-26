import { useState } from "react";
import style from "../styles/vendorAddStyle.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import {useNavigate} from "react-router-dom";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const AddVendors = () => {
  const [category, setCategory] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.from("#title", {
      y: -100,
      duration: 1,
    });
    gsap.from("#form", {
      y: 20,
      opacity: 0,
      delay: 1,
      duration: 1,
    });
  });

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("vendorName", e.target.vendorName.value);
    formData.append("description", e.target.description.value);
    formData.append("contactNo", e.target.contactNo.value);
    formData.append("location", e.target.location.value);
    formData.append("category", category);

    if (
      category === "Flower Shop" ||
      category === "Lighting Shop" ||
      category === "Designer"
    ) {
      formData.append("priceRange", e.target.priceRange.value);
    }

    if (category === "DJ") {
      formData.append("dayShiftPrice", e.target.dayShiftPrice.value);
      formData.append("nightShiftPrice", e.target.nightShiftPrice.value);
    }

    if (category === "Venue") {
      formData.append("capacity", e.target.capacity.value);
      formData.append("pricePerDay", e.target.pricePerDay.value);
    }

    if (category === "Caters") {
      formData.append("vegFoodPrice", e.target.vegFoodPrice.value);
      formData.append("nonVegFoodPrice", e.target.nonVegFoodPrice.value);
    }

    if (category === "Photographer") {
      formData.append("perDayCharge", e.target.perDayCharge.value);
    }

    if (category === "Makeup Artist") {
      formData.append("perFunctionPrice", e.target.perFunctionPrice.value);
    }

    const vendorImage = e.target.vendorImage.files[0];
    if (vendorImage) {
      formData.append("vendorImage", vendorImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/vendors/addVendor",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if(response.status === 201){
        navigate("/vendors")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={style.main}>
      <h2 id="title">Add Your Shop Now</h2>
      <form id="form" onSubmit={handleSubmitForm}>
        <input
          type="text"
          name="vendorName"
          placeholder="vendor name"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="description"
          required
        />
        <select
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option>Select Category</option>
          <option value="Flower Shop">Flower Shop</option>
          <option value="Lighting Shop">Lighting Shop</option>
          <option value="DJ">DJ</option>
          <option value="Venue">Venue</option>
          <option value="Caters">Caters</option>
          <option value="Photographer">Photographer</option>
          <option value="Makeup Artist">Makeup Artist</option>
          <option value="Designer">Designer</option>
        </select>
        {
          {
            "Flower Shop": (
              <input
                type="text"
                name="priceRange"
                placeholder="price range ex: ₹100 - ₹1000"
                required
              />
            ),
            "Lighting Shop": (
              <input
                type="text"
                name="priceRange"
                placeholder="price range ex: ₹100 - ₹1000"
                required
              />
            ),
            DJ: (
              <>
                <input
                  type="number"
                  name="dayShiftPrice"
                  placeholder="day shift price"
                  required
                />
                <input
                  type="number"
                  name="nightShiftPrice"
                  placeholder="night shift price"
                  required
                />
              </>
            ),
            Venue: (
              <>
                <input
                  type="number"
                  name="capacity"
                  placeholder="capacity"
                  required
                />
                <input
                  type="number"
                  name="pricePerDay"
                  placeholder="price per day"
                  required
                />
              </>
            ),
            Caters: (
              <>
                <input
                  type="number"
                  name="vegFoodPrice"
                  placeholder="veg food price"
                  required
                />
                <input
                  type="number"
                  name="nonVegFoodPrice"
                  placeholder="non veg food price"
                  required
                />
              </>
            ),
            Photographer: (
              <input
                type="number"
                name="perDayCharge"
                placeholder="per day charge"
                required
              />
            ),
            "Makeup Artist": (
              <input
                type="number"
                name="perFunctionPrice"
                placeholder="per function price"
                required
              />
            ),
            Designer: (
              <input
                type="text"
                name="priceRange"
                placeholder="price range ex: ₹100 - ₹1000"
                required
              />
            ),
          }[category]
        }
        <input
          type="number"
          name="contactNo"
          maxLength={1}
          placeholder="contact no"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="location - google map link"
          required
        />
        <label>Select The Background Image</label>
        <input
          type="file"
          accept="image/*"
          name="vendorImage"
          onChange={handleImageChange}
          required
        />

        {imagePreview && (
          <div className={style.image_preview}>
            <img src={imagePreview} alt="Selected" />
          </div>
        )}

        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default AddVendors;
