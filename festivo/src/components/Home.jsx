import "../styles/homeStyle.css";
import bgVideo from "../assets/videoBG.mp4";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../fonts/BracellaDemoRegular.ttf";
import down_arrow from "../assets/down_arrow.png";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const SectionCard = ({ title, text, imgSrc, imgId, reverse }) => {
  return (
    <div className={`sectionCard ${reverse ? "reverse" : ""}`}>
      <div className="sectionCardLeft">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="sectionCardRight">
        <img id={imgId} src={imgSrc} alt={title} />
      </div>
    </div>
  );
};

const Home = () => {
  useGSAP(() => {
    gsap.from("#topCard", {
      duration: 1,
      padding: "10px",
      delay: 1.5,
    });
    gsap.from("#bgVideo", {
      duration: 1,
      opacity: 0,
      scale: "2",
      ease: "power4.inOut",
      delay: 0.2,
    });
    gsap.from("#txt1", {
      duration: 1,
      marginLeft: "-300px",
      delay: 1.5,
    });
    gsap.from("#txt2", {
      duration: 1,
      marginLeft: "-300px",
      delay: 2,
    });
    gsap.from("#txt3", {
      duration: 1,
      marginLeft: "-300px",
      delay: 2.5,
    });
    gsap.to("#txt4", {
      duration: 2,
      opacity: "100%",
      delay: 3.5,
    });
    gsap.from(".scrollBtn", {
      bottom: "-20",
      opacity: 0,
      duration: 1,
      delay: 3.5,
      ease: "power2.inOut",
    });
    gsap.from("#vImg", {
      paddingLeft: "50%",
      opacity: 0,
      scrollTrigger: {
        start: "10%",
        end: "40%",
        scrub: 1,
      },
    });
    gsap.from("#eImg", {
      paddingRight: "50%",
      opacity: 0,
      scrollTrigger: {
        start: "30%",
        end: "70%",
        scrub: 1,
      },
    });
  });

  return (
    <div className="main">
      <div className="topContent">
        <div id="topCard">
          <h1 id="txt1">Make</h1>
          <h1 id="txt2">Your</h1>
          <h1 id="txt3">Event</h1>
          <h1 id="txt4">Special</h1>
        </div>
        <video
          id="bgVideo"
          autoPlay
          muted
          loop
          disablePictureInPicture
          controlsList="nodownload"
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="scrollBtn">
          <span>SCROLL DOWN</span>
          <img src={down_arrow} alt="Scroll Down" />
        </div>
      </div>
      <SectionCard
        title="Find Your Perfect Event Venue"
        text={`Choosing the right venue is crucial for the success of any event.
          Our platform offers a wide range of venues, from elegant banquet
          halls to charming outdoor spaces, suitable for weddings, corporate
          gatherings, parties, and more. Each venue is meticulously curated to
          ensure it meets our high standards of quality, ambiance, and
          service. We provide you with the best options, ensuring that every
          detail aligns with your vision and needs. With detailed
          descriptions, photos, and user reviews, you can easily find the
          perfect setting. Let us help you create unforgettable memories by
          selecting the ideal venue for your special occasion.`}
        imgSrc="https://images.pexels.com/photos/2291462/pexels-photo-2291462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        imgId="vImg"
      />
      <SectionCard
        title="Capture Unforgettable Moments"
        text={`Every event is an opportunity to create unforgettable memories that
          last a lifetime. Whether it's a wedding, birthday celebration, or
          corporate gathering, we understand the importance of capturing those
          special moments. Our platform not only helps you find the perfect
          venue but also provides access to photographers, videographers, and
          entertainment options that will elevate your experience. With our
          curated services, you can focus on enjoying the moment while we
          ensure every detail is beautifully captured. Let us help you make
          your event truly memorable, turning fleeting moments into cherished
          memories that you and your guests will treasure forever.`}
        imgSrc="https://images.pexels.com/photos/915174/pexels-photo-915174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        imgId="eImg"
        reverse={true}
      />
    </div>
  );
};

export default Home;
