import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {

  return (
    <Link to={`/item/${product.id}`} className="Link-item"> 
        <div className="olx-card">
      <div className="image-container">
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-image"
        />
        <div className="heart-icon-container"> 
          <FaRegHeart style={{color: 'black', fontSize: '25px'}} ></FaRegHeart>
        </div>
        {product.featured && (
          <div className="featured-badge">FEATURED</div>
        )}
      </div>
      <div className="card-content">
        <div className="pricee">₹ {product.price}</div>
        <div className="titlee" title={product.description}>
          {product.description}
        </div>
        <div className="location-date">
          <span className="location">{product.location}</span>
          <span className="date">
            {product.createdAt &&
              new Date(product.createdAt.seconds * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
    </Link>

  );
};

export default ProductCard;