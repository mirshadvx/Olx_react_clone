import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../product/ProductCard";
import { db } from "../../config/firebase";
import { collection, getDocs, query, limit, startAfter } from "firebase/firestore";
import Arrow from "../../assets/Arrow";
import "./Banner.css";
import { Logs } from "lucide-react";

function Banner() {
  const [ads, setAds] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [More, setMore] = useState(true);

  const fetchData = async (isInitialLoad = false) => {
    try {
      setLoading(true);
      const productsCollection = collection(db, "products");

      const queryConstraints = isInitialLoad
        ? [limit(4)]
        : [startAfter(lastDoc), limit(4)];
      const dataQuery = query(productsCollection, ...queryConstraints);

      const querySnapshot = await getDocs(dataQuery);

      if (!querySnapshot.empty) {
        const fetchedAds = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(fetchedAds);
        

        setAds((prevAds) => (isInitialLoad ? fetchedAds : [...prevAds, ...fetchedAds]));

        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setMore(false);
      }
    } catch (error) {
      console.error("fetching error ===", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  const load_more = () => {
    if (!loading && More) {
      fetchData();
    }
  };


  return (
    <div className="bannerParentDiv">
      <div className="bannerChildDiv">
        <div className="menuBar">
          <div className="categoryMenu flex">
            <span>ALL CATEGORIES</span>
            <Arrow></Arrow> 
          </div>
          <div className="otherQuickOptions">
            <span>Cars</span>
            <span>MotorCycles</span>
            <span>Mobile Phones</span>
            <span>For Sale:Houses & Apartments</span>
            <span>Scooters</span>
            <span>Commercial & Other Vechicles</span>
            <span>For Rent: House & Apartments</span>
          </div>
        </div>
        <div className="fresh-recommentation">
            <div className="heading">
                <span>Fresh recommendations</span>
            </div>
            <div className="card">
              {ads.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              
            </div>

        </div>
            <div className='load-div'>
                <div className="load-button">
            {loading ? (
              <span>Loading...</span>
            ) : More ? (
              <span onClick={load_more}>Load more</span>
            ) : (
              <span>No more products</span>
            )}
                </div>
            </div>        
      </div>
    </div>
  );
}

export default Banner;