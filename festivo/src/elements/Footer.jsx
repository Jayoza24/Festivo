import style from "../styles/FooterStyle.module.css";

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerContent}>
        <span>Festivo - Organise Your Event 👻</span>
        <p>
          {`Festivo
             a best online platform that connect with users 
             whom wants to organise event on their own.
             You find best venues for location, best caterers according your 
             test, best photographers for your stanning pictures and Don't worry 
             about the invitation provide us information we forms you invitation 
             card and send whomever you want.`}
        </p>
      </div>
      <div className={style.footerLinks}>
        <div className={style.navigtions}>
          <a href="/">Home</a>
          <a href="/vendors">Vendors</a>
          <a href="/planning">Plan</a>
          <a href="/profile">Profile</a>
        </div>
        <div className={style.traverse}>
          <div className={style.forVenue}>
            <span>For Venue</span>
            <a href="/vendors/Venue">Venue</a>
            <a href="/vendors/Caters">Caterers</a>
            <a href="/vendors/Photographer">Photographer</a>
          </div>
          <div className={style.forDecore}>
            <span>For Decoration</span>
            <a href="/vendors/Lighting%20Shop">Lighting Shop</a>
            <a href="/vendors/Flower%20Shop">Flower Shop</a>
            <a href="/vendors/DJ">DJ</a>
          </div>
          <div className={style.forFasion}>
            <span>For Makeover</span>
            <a href="/vendors/Designer">Designer</a>
            <a href="/vendors/Makeup%20Artist">Makeup Artist</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
