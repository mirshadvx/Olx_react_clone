import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./Show_item.css";
import Footer from "../../components/Footer/Footer";


const Show_item = () => {
  const { id } = useParams();  
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap.data());
        

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          setError("No files");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    if(id){
     fetchProductData();}
     
    }, [id]);

  const handleImageChange = (index) => {
    setCurrentImage(index);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Not available";
    
    const date = timestamp.seconds 
      ? new Date(timestamp.seconds * 1000) 
      : new Date(timestamp);
    
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error">{error}</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="error">No product found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="product-details-container">
      
        {product.images && product.images.length > 0 && (
          <div className="image-section">
            <img
              src={product.images[currentImage]}
              className="main-image"
            />
            <div className="thumbnail-section">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className={`thumbnail ${index === currentImage ? "active" : ""}`}
                  onClick={() => handleImageChange(index)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="details-section">
          <h1 className="price">₹{product.price}</h1>
          <h2 className="title">{product.title}</h2>
          <p className="location">{product.location}</p>
          <p className="date">
            Created At: {formatTimestamp(product.createdAt)}
          </p>
          <div className="seller-info">

            <div className="seller-details">
              <h3>{product.sellername || 'Not available'}</h3>
                <p>Phone: {product.phone   || 'Not available'}</p>
            </div>
          </div>
        </div>

        <div className="description-section">
          <h4>Description</h4>
          <p>{product.description || 'No description provided'}</p>
          <h4>Details</h4>
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Featured:</strong> {product.featured ? "Yes" : "No"}
          </p>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Show_item;

