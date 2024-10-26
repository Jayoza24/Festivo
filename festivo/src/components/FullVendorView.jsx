import { useRef, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import style from "../styles/fullVendorStyle.module.css";
import axios from "axios";
import Modal from "react-modal";
import TimeAgo from "../elements/TimeAgo";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import loadingImage from "../assets/loadingImage.png";
import { useDropzone } from "react-dropzone";

gsap.registerPlugin(ScrollTrigger);

const FullVendorView = (props) => {
  const ref = useRef([]);
  const bgImgRef = useRef(null);
  const titleBoxRef = useRef(null);
  const priceRef = useRef(null);
  ref.current = [];

  const { id } = useParams();
  const [vendor, setVendor] = useState("");
  const [vendorImages, setVendorImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [newComment, setNewComment] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const getVendor = useCallback(async () => {
    window.scrollTo(0,0);
    try {
      const res = await axios.get(
        `https://festivo.onrender.com/vendors/getVendor/${id}`
      );
      if (res) {
        setVendor(res.data.data);
        setVendorImages(res.data.data.images.reverse());
        setComments(res.data.data.comments.reverse());
      }
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedImage(file);
    setSelectedImageUrl(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  useEffect(() => {
    if (bgImgRef.current) {
      gsap.fromTo(
        bgImgRef.current,
        { scale: 1.04, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "expo.inOut" }
      );
    }
    if (titleBoxRef.current) {
      gsap.fromTo(
        titleBoxRef.current,
        { y: "10px", opacity: 0 },
        { y: "0px", opacity: 1, duration: 1, delay: 0.5, ease: "power4.inOut" }
      );
    }
    if (priceRef.current) {
      gsap.fromTo(
        priceRef.current,
        { y: "10px", opacity: 0 },
        { y: "0px", opacity: 1, duration: 1, delay: 1, ease: "power4.inOut" }
      );
    }
  }, [vendor]);

  useEffect(() => {
    getVendor();

    ref.current.forEach((el) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: "0%", scale: 0.9 },
          {
            opacity: "100%",
            scale: 1,
            duration: 0.3,
            scrollTrigger: {
              trigger: el,
              start: "top bottom-=100",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  }, [getVendor]);

  useEffect(() => {
    ref.current.forEach((el) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            scrollTrigger: {
              trigger: el,
              start: "top bottom-=100",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [vendorImages, comments]);

  const addtoRefs = (el) => {
    if (el && !ref.current.includes(el)) {
      ref.current.push(el);
    }
  };

  const renderPriceDetails = () => {
    const { category, vendorDetails } = vendor;

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
        prices: [vendorDetails.capacity, `₹${vendorDetails.pricePerDay}`],
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
            <p key={index}>{price}</p>
          ))}
        </div>
      </div>
    );
  };

  const uploadVendorImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await axios.post(
        `https://festivo.onrender.com/vendors/addVendorImages/${id}`,
        formData
      );
      setVendorImages(res.data.vendor.images.reverse());
      selectedImage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPopupOpen(false);
    }
  };

  const addNewComment = async () => {
    if (!newComment) {
      alert("Please enter a comment");
    }

    try {
      const res = await axios.post(
        `https://festivo.onrender.com/vendors/addComment/${id}`,
        { username: props.user, comment: newComment }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleViewMoreClick = () => {
    setIsPopupOpen(true);
  };

  const handleImageClick = (image) => {
    setFullscreenImage(image);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    selectedImage(null);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <div className={style.main}>
      {vendor ? (
        <div className={style.mainContent}>
          <div className={style.topContent}>
            <img
              ref={bgImgRef}
              id="bgImg"
              src={`https://festivo.onrender.com/uploads/vendors/${vendor.bg}`}
              alt="vendor image"
            />
            <div className={style.details} ref={titleBoxRef}>
              <div className={style.left}>
                <h2>{vendor.vendorName}</h2>
                <p>{vendor.category}</p>
              </div>
              <div className={style.right} ref={priceRef}>
                <div className={style.rTop}>{renderPriceDetails()}</div>
                <a href={"tel:+91" + vendor.contactNo}>Contact Us</a>
              </div>
            </div>
          </div>
          <div className={style.locationCard}>
            <div dangerouslySetInnerHTML={{ __html: vendor.location }} />
          </div>
          <div className={style.description}>
            <h4>Description</h4>
            <hr />
            <p>{vendor.description}</p>
          </div>
          <div className={style.vendorImages}>
            {vendorImages.slice(0, 7).map((img, index) => (
              <img
                ref={addtoRefs}
                key={index}
                src={`https://festivo.onrender.com/uploads/vendors/${img}`}
                alt="img"
                onClick={() => handleImageClick(img)}
              />
            ))}
            {
              <button
                className={style.viewMoreCard}
                onClick={handleViewMoreClick}
              >
                View More
              </button>
            }
          </div>

          {isPopupOpen && (
            <Modal
              isOpen={isPopupOpen}
              onRequestClose={closePopup}
              className={style.popup}
              overlayClassName={style.overlay}
              ariaHideApp={false}
            >
              <button onClick={closePopup} style={{ marginBottom: "20px" }}>
                Close
              </button>
              <div className={style.uploadSection}>
                <div {...getRootProps({ className: style.dropzone })}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>
                      {
                        "Drag 'n' drop an image here, or click to select one to Upload yours"
                      }
                    </p>
                  )}
                </div>
                <button
                  className={style.uploadButton}
                  onClick={uploadVendorImage}
                >
                  Upload
                </button>
                {selectedImageUrl && (
                  <div className={style.selectedImage}>
                    <img src={selectedImageUrl} alt="Selected" />
                  </div>
                )}
              </div>
              <div className={style.popupContent}>
                {vendorImages.map((img, index) => (
                  <img
                    key={index}
                    src={`https://festivo.onrender.com/uploads/vendors/${img}`}
                    alt="img"
                    onClick={() => handleImageClick(img)}
                  />
                ))}
              </div>
            </Modal>
          )}

          {fullscreenImage && (
            <div className={style.fullscreenOverlay} onClick={closeFullscreen}>
              <img
                src={`https://festivo.onrender.com/uploads/vendors/${fullscreenImage}`}
                alt="fullscreen"
                className={style.fullscreenImage}
              />
            </div>
          )}

          <div className={style.commentsSection}>
            <h4 style={{ marginBottom: "20px" }}>Comments</h4>
            {comments.length !== 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className={style.comment}
                  ref={addtoRefs}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p>{comment.username}</p>
                    <TimeAgo timestamp={comment.createdAt} />
                  </div>
                  <hr />
                  <p>{comment.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>No Comments</p>
            )}
            <div className={style.addCommentBox}>
              <textarea
                placeholder="Write your comment..."
                rows={4}
                onChange={(e) => {
                  setNewComment(e.target.value);
                }}
              />
              <button onClick={addNewComment}>Add Comment</button>
            </div>
          </div>
        </div>
      ) : (
        <img src={loadingImage} alt="Loading..." id={style.loading} />
      )}
    </div>
  );
};

export default FullVendorView;
