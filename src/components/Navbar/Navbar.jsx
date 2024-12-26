import React, { useState, useEffect, useContext, Suspense } from "react";
import "./Navbar.css";
import drop_arrow from "/drop_arrow.svg";
import SellButton from "../../assets/SellButton";
import SellButtonPlus from "../../assets/SellButtonPlus";

import { auth } from "../../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from '../../App'
import { toast } from "react-toastify";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const Login = React.lazy(() => import(/* webpackChunkName: "loginChunkFile" */ "../../components/Login/Login"));

// import Login from "../../components/Login/Login"

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [Products, setProduct] = useState([])
  const [search_input, setSearch_input] = useState("")
  const [recommendation, setRecomme] = useState([])

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      const limitedQuery = query(productsCollection);
      const querySnapshot = await getDocs(limitedQuery);
      const fetchedAds = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProduct(fetchedAds);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []); 

  const search_nav = (inp) => {
    const sea_text = inp.target.value.toLowerCase();
    setSearch_input(sea_text)

    if(sea_text.trim() === ""){
      setRecomme([]);
      return;
    }
    const filteredData = Products.filter((pro) => {
      return pro.title.toLowerCase().includes(sea_text)
    });

    setRecomme(filteredData);

  };

  useEffect(()=>{
    // console.log(recommendation);
    
  },[recommendation])

  const { LoginStatus ,login , logout, Hello } = useContext(AuthContext);
  // console.log(LoginStatus);
  
  const navigate = useNavigate()
  const hadnavigate = () =>{
    if(user){
      navigate("/sell")
    }else{
      return null;
    }
  
  }

  const goHome = () => {
    navigate("/")
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });
    return () => unsubscribe();
  }, []);

  // console.log(user);
  

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast("Logout successfully!")
      setUser(null); 
    } catch (err) {
      toast("Failed to log out. Please try again.")
    }
  };

  return (
    <>
      <div className="navbar">
        <div onClick={goHome} className="logo">
          <div className="logo-img-div">
            <img
              src="https://logos-world.net/wp-content/uploads/2022/04/OLX-Symbol.png"
              alt="OLX Logo"
            />
          </div>
        </div>

        <div className="search">
          <div className="first-search">
            <div className="location-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/000/search--v1.png"
                alt="Location Icon"
              />
            </div>
            <input type="text" className="location-input" placeholder="India" />
            <div className="dropdown-icon">
              <img
                style={{ width: "24px", height: "24px", marginRight: "10px" }}
                src={drop_arrow}
                alt="Dropdown Icon"
              />
            </div>
          </div>

          <div className="search-div">
            <input
              type="text"
              className="second-search"
              placeholder="Find Cars, Mobile Phones, and more..."
              value={search_input}
              onChange={(e) => search_nav(e)}
            />
            <div className="recommendation_list">
              {recommendation.map((item) => (
                <div onClick={()=> navigate(`item/${item.id}`)} key={item.id} className="recommendation-item">
                  {item.title} 
                </div>
              ))}
            </div>
            <div className="search-2">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/search--v1.png"
                alt="Search Icon"
              />
            </div>
          </div>
        </div>

        <div className="lan-drop-down">
          <button className="language-button">ENGLISH</button>
          <img
            style={{ width: "24px", height: "24px", marginLeft: "4px" }}
            src={drop_arrow}
            alt="Dropdown Icon"
          />
        </div>
        <div className="login-sell">
          {user ? (
            <>
              <button className="login-button" onClick={handleLogout}>
                <span style={{ textDecoration: "underline" }}>Logout</span>
              </button>
            </>
          ) : (
            <button className="login-button" onClick={openModal}>
              <span style={{ textDecoration: "underline" }}>Login</span>
            </button>
          )}
          <div className="sellMenu">
            <SellButton></SellButton>
            <div className="sellMenuContent">
              <SellButtonPlus></SellButtonPlus>
              <span onClick={hadnavigate}>SELL</span>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {isModalOpen && <Login isOpen={isModalOpen} onClose={closeModal} />}
      </Suspense>
      {/* {isModalOpen && <Login isOpen={isModalOpen} onClose={closeModal} />} */}
    </>
  );
};

export default Navbar;


