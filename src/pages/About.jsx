import React from "react";
import { MdLocationOn, MdPeople, MdStars } from "react-icons/md";
import { PageNav } from "../Components/PageNavigation";

function About() {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
           <PageNav/>

      {/* Hero Section */}
      <div className="text-center mb-12 mt-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">About Our Company</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          We provide safe, reliable, and fast ride services in cities across the country.
          Our goal is to make commuting effortless and convenient for everyone.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
          <MdLocationOn className="text-blue-500 w-10 h-10 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-500 text-sm">
            To connect people with reliable transportation while ensuring safety, speed, and comfort.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
          <MdPeople className="text-green-500 w-10 h-10 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
          <p className="text-gray-500 text-sm">
            To become the most trusted transportation service by embracing innovation and customer satisfaction.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
          <MdStars className="text-yellow-500 w-10 h-10 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Our Values</h2>
          <p className="text-gray-500 text-sm">
            Safety, reliability, transparency, and exceptional service guide everything we do.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-6">Meet Our Team</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Our dedicated team works around the clock to ensure you have the best commuting experience.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {["Alice", "Bob", "Charlie", "Diana"].map((name, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                {name[0]}
              </div>
              <p className="text-center font-medium">{name}</p>
              <p className="text-center text-gray-400 text-sm">Team Member</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
