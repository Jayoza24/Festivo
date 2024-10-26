import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import style from "../styles/vendorByCategory.module.css";
import VendorCard from "../elements/VendorCard";
import axios from "axios";
import designerBanner from "../assets/Designer_Banner.png";

const VendorByCategory = () => {
  const { category } = useParams();
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [suggestedImages, setSuggestedImages] = useState([]);

  useEffect(() => {
    getData();
    window.scrollTo(0,0);
  }, [category]);

  const getData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/vendors/${category}&0`
      );
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedImage(file);
    setSelectedImageUrl(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const suggestDress = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/get_similar_images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuggestedImages(response.data);
    } catch (error) {
      console.error("Error suggesting dress:", error);
    }
  };

  return (
    <div className={style.main}>
      <div className={style.header}>
        {category == "Designer" ? (
          <img id={style.banner} src={designerBanner} alt="banner" />
        ) : (
          <h2>{category}</h2>
        )}
      </div>

      {category === "Designer" && (
        <div className={style.suggestion}>
          <div {...getRootProps({ className: style.dropzone })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>{"Drag 'n' drop an image here, or click to select one"}</p>
            )}
          </div>
          <button className={style.suggestBtn} onClick={suggestDress}>
            Suggest Dress
          </button>
          {selectedImageUrl && (
            <div className={style.selectedImage}>
              <h3>Selected Image</h3>
              <img src={selectedImageUrl} alt="Selected" />
            </div>
          )}
          {suggestedImages.length > 0 && (
            <div className={style.suggestedImages}>
              <h3>Suggested Dresses</h3>
              <div className={style.imageGrid}>
                {suggestedImages.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`suggested-dress-${index}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div className={style.cards}>
        {data.length !== 0 ? (
          data.map((vendor) => (
            <VendorCard key={vendor._id} vendorData={vendor} />
          ))
        ) : (
          <p>No Data</p>
        )}
      </div>
    </div>
  );
};

export default VendorByCategory;
