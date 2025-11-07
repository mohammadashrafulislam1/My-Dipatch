import { useState } from "react";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { FaUser, FaCity, FaEnvelope, FaPhone, FaLock, FaImage } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Components/useAuth";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const Signup = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    const [firstName, ...lastNameParts] = formData.name.trim().split(" ");
    const lastName = lastNameParts.join(" ");

    const formPayload = new FormData();
    formPayload.append("firstName", firstName);
    formPayload.append("lastName", lastName);
    formPayload.append("email", formData.email);
    formPayload.append("phone", formData.phone);
    formPayload.append("city", formData.city);
    formPayload.append("password", formData.password);
    formPayload.append("role", formData.role);
    if (profileImage) formPayload.append("profileImage", profileImage);

    try {
      await signup(formPayload);
      toast.success("Signup successful! 🎉 Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Signup error:", err.response?.data?.error || err.message);
      toast.error(err.response?.data?.error || "Error signing up ❌");
    }
  };

  // === Google Autocomplete handlers ===
  const onLoad = (auto) => {
    window.cityAuto = auto;
    auto.setTypes(["(cities)"]); // Restrict to cities only
  };

  const onPlaceChanged = () => {
    const place = window.cityAuto?.getPlace();
    if (place?.address_components) {
      const cityComponent = place.address_components.find((c) =>
        c.types.includes("locality") || c.types.includes("administrative_area_level_1")
      );
      const cityName = cityComponent
        ? cityComponent.long_name
        : place.formatted_address;
      setFormData((prev) => ({ ...prev, city: cityName }));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 relative"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dnwmtd4p1/image/upload/v1756262884/localRun/Assets/Gemini_Generated_Image_geij8qgeij8qgeij_iqy1tr.png')",
      }}
    >
      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 my-5 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-3xl z-10">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="text-center mb-6">
          <img
            src="https://i.ibb.co/TxC947Cw/thumbnail-Image-2025-07-09-at-2-10-AM-removebg-preview.png"
            alt="Logo"
            className="w-[100px] mx-auto mb-3"
          />
          <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Join our ride-sharing platform and start your journey!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ✅ City Autocomplete Input */}
          <div className="relative">
            <FaCity className="absolute top-3 left-3 text-gray-400" />
            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              libraries={["places"]}
            >
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Autocomplete>
            </LoadScript>
          </div>

          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone Input */}
          <div className="relative">
            <FaPhone className="absolute top-3 left-3 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Profile Image */}
          <div className="relative">
            <FaImage className="absolute top-5 left-3 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full pl-9 pr-4 py-3 h-[55px] file-input border border-gray-300 rounded-xl transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              className="absolute top-3 right-3 text-xl text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              className="absolute top-3 right-3 text-xl text-gray-600 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <IoEyeOffSharp /> : <IoEyeSharp />}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-full font-semibold hover:scale-105 transition transform duration-200 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {/* Login Link */}
          <div className="text-center mt-3 text-gray-600 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 font-semibold hover:underline">
              Log In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
