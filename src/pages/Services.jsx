import React from "react";
import { MdDirectionsCar, MdDeliveryDining, MdSupportAgent } from "react-icons/md";
import { PageNav } from "../Components/PageNavigation";

function Services() {
  const services = [
    {
      title: "Ride Service",
      description: "Safe, fast, and reliable rides whenever you need them.",
      icon: <MdDirectionsCar className="w-10 h-10 text-blue-500 mb-4" />,
    },
    {
      title: "Delivery Service",
      description: "Deliver packages and food quickly across the city.",
      icon: <MdDeliveryDining className="w-10 h-10 text-green-500 mb-4" />,
    },
    {
      title: "Customer Support",
      description: "24/7 support to help you with any queries or issues.",
      icon: <MdSupportAgent className="w-10 h-10 text-yellow-500 mb-4" />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
            <PageNav/>

      {/* Header */}
      <div className="text-center mb-12 mt-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          We provide a range of services to make commuting, delivery, and customer support seamless and efficient.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center"
          >
            {service.icon}
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="text-gray-500 text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
