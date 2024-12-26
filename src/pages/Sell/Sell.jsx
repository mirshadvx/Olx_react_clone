import React, { useEffect, useState } from "react";
import { ImagePlus, CheckCircle2 } from "lucide-react";
import { auth, db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";
import "./Sell.css";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, Bounce } from "react-toastify";

const Sell = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  const { register, handleSubmit, formState : {errors}, reset } = useForm();

  useEffect(()=>{
    if(!user) {
    navigate("/")
  }
  })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    brand: "",
    price: "",
    location: "",
    sellerName: "",
    phoneNumber: "",
    category: "",
    showPhoneNumber: false,
    featured: false,
  });

  // const handleChange = (e) => {
  //   const { id, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [id]: type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    // console.log(images.length);
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
    toast.warn('Only JPG and PNG files are allowed.!', {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    return;
    }
    
    if (file && images.length < 2) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "nniuemx0");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/olx-clone/image/upload", 
          uploadData
        );
        const imageUrl = response.data.secure_url;
        setImages((prev) => [...prev, imageUrl]);
        // console.log(images.length);
      } catch (error) {
        toast.error("Failed to upload image");
      }
    }else{
      toast.info('accept only two images')
    }
    // console.log(images.length);
  };

  const handlesubmit = async (data) => {
    
    if (images.length === 0) {
      toast.info("Please upload at least one image");
      return;
     }

    // console.log(data);
    

    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...data,
        images,
        createdAt: new Date(),
      });

      setImages([]);
      reset();
      toast.success('Ad posted successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          });
      navigate("/")
    } catch (error) {
      console.error("Error adding document:", error);
      toast.warn("Failed to post ad. Please try again.");
    }
  };

  return (
    <div className="sell-container">
      <nav className="sell-nav">
        <div className="nav-logo">
          <Link to={"/"}>
            <FaArrowLeftLong style={{color: 'black', fontSize: '28px'}} />
          </Link>
          
        </div>
      </nav>

      <form className="sell-form" onSubmit={handleSubmit(handlesubmit)}>
        <h1>POST YOUR AD</h1>

        <div className="form-section">
          <h4>Include Some Details</h4>
          <div className="first-form-div">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Add a title"
                {...register("title", {
              required: {
                value: true,
                message: "title is required"
              }
            })}
              />
            {errors.title && (
            <span className="hook-error">{errors.title.message}</span>
          )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="5"
                placeholder="Describe your item"
                {...register("description",{required:{
                  value: true,
                  message: "description required"
                }})}
              ></textarea>
              {errors.description && <span className="hook-error">{errors.description.message}</span>}
            </div>
          </div>

          <div className="first-form-div">
            <div className="form-group">
              <label htmlFor="brand">Brand (Optional)</label>
              <input
                id="brand"
                type="text"
                placeholder="Add brand name"
                {...register("brand")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                placeholder="Enter price"
                {...register("price", {
                  required: {
                    value: true,
                    message: "Price is required",
                  },
                  min: {
                    value: 1,
                    message: "Entered negative value",
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Price must be a valid number",
                  },
                })}
              />
              {errors.price && <span className="hook-error">{errors.price.message}</span>}

            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Upload Images</h4>
          <div className="image-field">
            {[1, 2].map((index) => (
              <div key={index} className="form-group">
                <label htmlFor={`images-${index}`}>
                  <div className="image-upload-btn">
                    <ImagePlus size={24} />
                    <span>Upload Image {index}</span>
                  </div>
                  <input
                    id={`images-${index}`}
                    type="file"
                    accept="image/*"
                    style={{display: "none"}}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            ))}
          </div>
          
          {images.length > 0 && (
            <div className="uploaded-images">
              {images.map((img, idx) => (
                <img key={idx} 
                  src={img} 
                  alt={`Uploaded ${idx + 1}`} 
                  className="thumbnail" />
              ))}
            </div>
          )}
        </div>

        <div className="second-div">
          <div className="form-section section-1">
            <h4>Your Ads Location</h4>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="Enter location"
                {...register("location",{
                  required:{
                    value: true,
                    message : "location required"
                  }
                })}
              />{errors.location && <span className="hook-error">{errors.location.message}</span>}
            </div>
          </div>

          <div className="form-section section-2">
            <h4>Your Contact Information</h4>
            <div className="form-group">
              <label htmlFor="sellerName">Your Name</label>
              <input
                id="sellerName"
                type="text"
                placeholder="Enter your name"
                {...register("sellername",{
                  required:{
                    value: true,
                    message: "seller name required"
                  },
                  pattern:{
                    value: /^[A-Za-z\s]+$/,
                    message: "correct the name field"
                  }
                })}
              />{errors.sellername && <span className="hook-error">{errors.sellername.message}</span>}
            </div>
          </div>
        </div>

        <div className="last-div">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
              {...register("phone",{
                required:{
                  value: true,
                  message: "Phone number required"
                },  
                pattern:{
                  value: /^\d{10}$/,
                  message: "Phone number must be contain 10 digits",
                },
              })}
              />{errors.phone && <span className="hook-error">{errors.phone.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select {...register("category",{
                required:{
                  value: true,
                  message: "category required"
                }
              })} >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Books">Books</option>
                <option value="vehicle">Vehicle</option>
                <option value="vehicle">Bike</option>
                <option value="vehicle">Car</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <span className="hook-error">{errors.category.message}</span>}
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="featured">
                <input
                  type="checkbox"
                  {...register("featured")} 
                />
                Mark as Featured
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Post now
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sell;