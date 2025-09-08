import React from "react";
import { MdLocationOn, MdPeople, MdStars, MdDirectionsCar, MdRestaurant, MdDeliveryDining } from "react-icons/md";
import { PageNav } from "../Components/PageNavigation";
import Footer from "../Components/Footer";

function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <PageNav/>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">We reimagine the way the world moves</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Connecting people with reliable transportation and delivery services to make everyday life easier.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
              Learn more
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition">
              Join our team
            </button>
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Mission & Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <MdLocationOn className="text-blue-600 text-3xl" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To connect people with reliable transportation while ensuring safety, speed, and comfort for all.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <MdPeople className="text-green-600 text-3xl" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the most trusted transportation service by embracing innovation and customer satisfaction.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-100 p-4 rounded-full">
                  <MdStars className="text-yellow-600 text-3xl" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Values</h3>
              <p className="text-gray-600">
                Safety, reliability, transparency, and exceptional service guide everything we do.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Everyone Section */}
      <div className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">For Everyone</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Our platform is designed to serve all members of the community, creating opportunities and connecting people.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <MdDirectionsCar className="text-blue-600 text-2xl" />
                </div>
                <h3 className="font-semibold">For Riders</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Get where you need to go quickly and safely with reliable transportation at your fingertips.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <MdDeliveryDining className="text-green-600 text-2xl" />
                </div>
                <h3 className="font-semibold">For Drivers</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Earn money on your schedule with flexible opportunities that work around your life.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <MdRestaurant className="text-yellow-600 text-2xl" />
                </div>
                <h3 className="font-semibold">For Restaurants</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Reach new customers and grow your business with our delivery network.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <MdPeople className="text-purple-600 text-2xl" />
                </div>
                <h3 className="font-semibold">For Communities</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Creating economic opportunities and reducing congestion in cities worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Leadership Team</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Our dedicated team works around the clock to ensure you have the best experience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Sarah Johnson", role: "CEO & Founder" },
              { name: "Michael Chen", role: "CTO" },
              { name: "Jessica Williams", role: "Head of Operations" },
              { name: "David Rodriguez", role: "Head of Safety" }
            ].map((person, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
                  {person.name[0]}
                </div>
                <h3 className="font-semibold text-lg">{person.name}</h3>
                <p className="text-gray-600">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">50M+</p>
              <p className="text-blue-100">Active Riders</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">5M+</p>
              <p className="text-blue-100">Driver Partners</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">100+</p>
              <p className="text-blue-100">Cities Worldwide</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">1B+</p>
              <p className="text-blue-100">Deliveries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
     <Footer/>
    </div>
  );
}

export default About;