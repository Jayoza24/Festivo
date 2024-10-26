import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../styles/planStyle.module.css";
import bgImg from "../assets/weddingImg.webp";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VendorCard from "../elements/VendorCard";
import emptyExpanse from "../assets/empty.png";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Planning = () => {
  const [user, setUser] = useState("");
  const [uid, setUid] = useState("");
  const [isExist, setExist] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [vendors, setVendors] = useState({});
  const [vendorDetails, setVendorDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
  }, []);

  useGSAP(() => {});

  const checkLogin = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser(parsedUserInfo.username);
      setUid(parsedUserInfo._id);
      getBudget(parsedUserInfo._id);
      getVendors(parsedUserInfo._id);
    } else {
      navigate("/login");
    }
  };

  const getBudget = async (uid) => {
    try {
      const res = await axios.get(`https://festivo.onrender.com/budget/${uid}`);
      if (res.data !== null) {
        setRemainingBudget(res.data.remainingBudget || 0);
        setExpenses(res.data.expenses || []);
        setExist(true);
      } else {
        setExist(false);
      }
    } catch (error) {
      console.error("Error fetching the budget:", error);
    }
  };

  const getVendors = async (uid) => {
    try {
      const res = await axios.get(
        `https://festivo.onrender.com/vendors/getVendorByPrice/${uid}`
      );
      if (res.data.status === 200) {
        setVendors(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const getVendorDetails = async (expenses) => {
    const promises = expenses.map(async (expense) => {
      const res = await axios.get(
        `https://festivo.onrender.com/vendors/getVendor/${expense.vid}`
      );
      return { ...res.data.data, expenseId: expense._id };
    });

    const results = await Promise.all(promises);
    const detailsMap = {};
    results.forEach((vendor) => {
      detailsMap[vendor.expenseId] = vendor;
    });
    setVendorDetails(detailsMap);
  };

  useEffect(() => {
    if (expenses.length > 0) {
      getVendorDetails(expenses);
    }
  }, [expenses]);

  const setBudget = async (budget) => {
    const res = await axios.post(`https://festivo.onrender.com/budget/${uid}`, {
      budget,
      remainingBudget: budget,
    });
    if (res.status === 200) {
      location.reload();
    }
  };

  const expenseCategories = new Set(
    expenses.map((expense) => expense.category)
  );

  const clearExpanses = async (uid) => {
    if (confirm("are you sure?")) {
      await axios
        .delete(`https://festivo.onrender.com/budget/${uid}/expenses`)
        .then(location.reload())
        .catch((err) => console.log(err.message));
    }
  };

  const resetBudget = async (uid) => {
    if (confirm("are you sure?")) {
      await axios
        .delete(`https://festivo.onrender.com/budget/${uid}/reset`)
        .then(location.reload())
        .catch((err) => console.log(err.message));
    }
  };

  return (
    <div className={style.mainPlan}>
      {!isExist ? (
        <div className={style.noPlan}>
          <img src={bgImg} alt="Wedding Background" />
          <div className={style.texts}>
            <h1>Have a plan</h1>
            <h1>Start planning your memorable event</h1>
            <div
              className={style.btnPlan}
              onClick={() => {
                const amount = prompt("enter your budget");
                if (amount != null) {
                  setBudget(parseFloat(amount));
                }
              }}
            >
              <span>START NOW</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={style.mainContent}>
          <div className={style.header}>
            <div className={style.left}>
              <h4>Welcome, {user}</h4>
            </div>
            <div className={style.right}>
              <h4>Remaining Budget: {remainingBudget}</h4>
              <button
                onClick={() => {
                  clearExpanses(uid);
                }}
              >
                Clear Expanses
              </button>
              <button
                onClick={() => {
                  resetBudget(uid);
                }}
              >
                Reset Budget
              </button>
            </div>
          </div>
          {expenses.length !== 0 ? (
            <div className={style.expanseList}>
              {expenses.map((expense) => (
                <>
                  {vendorDetails[expense._id] ? (
                    <VendorCard
                      key={vendorDetails[expense._id]._id}
                      vendorData={vendorDetails[expense._id]}
                    />
                  ) : (
                    <p>Loading vendor...</p>
                  )}
                </>
              ))}
            </div>
          ) : (
            <center>
              <img src={emptyExpanse} id={style.emptyImg} alt="Nothing Set" />
              <h4>
                Nothing is set !!
                <br />
                Start Planning now by clicking suggested vendros 🥳
              </h4>
            </center>
          )}
          <div className={style.vendorList}>
            {Object.keys(vendors).map(
              (category) =>
                !expenseCategories.has(category) && (
                  <div key={category} className={style.categorySection}>
                    <h3>{category}</h3>
                    <div className={style.vendorCards}>
                      {vendors[category].map((vendor) => (
                        <VendorCard
                          key={vendor._id}
                          vendorData={vendor}
                          fromPlanning={"planning"}
                          uid={uid}
                        />
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Planning;
