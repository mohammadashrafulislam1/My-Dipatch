import { useEffect, useState } from "react";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { FaUser, FaCity, FaEnvelope, FaPhone, FaLock, FaImage } from "react-icons/fa";
import axios from "axios";
import { endPoint } from "../../Components/ForAPIs";

const Signup = () => {
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
      alert("Passwords do not match");
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
      const { data } = await axios.post(`${endPoint}/user/signup`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Signup successful!");
      console.log("User:", data);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error signing up");
    }
  };

  return (
    <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
    style={{
      backgroundImage:
        "url('https://sdmntpritalynorth.oaiusercontent.com/files/00000000-97c8-6246-abd3-8718b97fb526/raw?se=2025-08-25T20%3A45%3A36Z&sp=r&sv=2024-08-04&sr=b&scid=0585c349-d60d-58f9-9600-cdf8e72c08cc&skoid=0da8417a-a4c3-4a19-9b05-b82cee9d8868&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-25T19%3A45%3A24Z&ske=2025-08-26T19%3A45%3A24Z&sks=b&skv=2024-08-04&sig=LPSNxvt89P0Rf5o7QRRn2wf8SrIDt47HQSbjnD9R0U4%3D')",
    }}
  >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 my-5">
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
          {[
            { icon: FaUser, name: "name", placeholder: "Full Name", type: "text" },
            { icon: FaCity, name: "city", placeholder: "City", type: "text" },
            { icon: FaEnvelope, name: "email", placeholder: "Email", type: "email" },
            { icon: FaPhone, name: "phone", placeholder: "Phone", type: "tel" },
          ].map(({ icon: Icon, name, placeholder, type }) => (
            <div className="relative" key={name}>
              <Icon className="absolute top-3 left-3 text-gray-400" />
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          ))}

          <div className="relative">
            <FaImage className="absolute top-5 left-3 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full pl-9 pr-4 py-3 h-[55px] file-input border border-gray-300 rounded-xl transition"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <div
              className="absolute top-3 right-3 text-xl text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
            </div>
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <div
              className="absolute top-3 right-3 text-xl text-gray-600 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <IoEyeOffSharp /> : <IoEyeSharp />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-full font-semibold hover:scale-105 transition transform duration-200"
          >
            Sign Up
          </button>

          <div className="text-center mt-3 text-gray-600 text-sm">
            Already have an account? <a href="/login" className="text-blue-500 font-semibold hover:underline">Log In</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
