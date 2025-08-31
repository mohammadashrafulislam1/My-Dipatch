import { useState } from "react";
import {
  BiSupport,
} from "react-icons/bi";
import {
  FaCarSide,
  FaBriefcase,
} from "react-icons/fa";
import {
  FiSettings,
} from "react-icons/fi";
import RideRequestForm from "../../Components/RideRequestForm";
import useAuth from "../../Components/useAuth";
import { PageNav } from "../../Components/PageNavigation";

const LandingPage = () => {
  const { user, logout, loading } = useAuth();
  console.log(user)
  const [midwayStops, setMidwayStops] = useState([""]);
  const [showAll, setShowAll] = useState(false);

  const orderHistory = [
    { name: "Ashraful Islam", address: "Osler st – S4P 1W9", status: "In progress" },
    { name: "Jhon Snow", address: "Rose st – S3P 1W9", status: "Completed" },
    { name: "Katriena Saw", address: "14th ave – S5P 1T9", status: "Completed" },
    { name: "Tom Gray", address: "Broadway – S4T 0H9", status: "Completed" },
    { name: "Jane F.", address: "Victoria Ave – S4N 0P4", status: "Completed" },
  ];

  const visibleOrders = showAll ? orderHistory : orderHistory.slice(0, 3);


  
  return (
    <div className="overflow-x-hidden md:pb-0 pb-12">
      <PageNav/>


{/* Top Hero section */}
<div className="bg-[#f8f8f8] mx-auto w-full md:flex items-center lg:px-16 px-4 py-4 lg:py-12 relative ">
        <div className="bg-[#f8f8f8] overflow-hidden md:h-[504px]">
          {/* === Background Shapes Behind the Form === */}
  <img
    src="https://i.ibb.co/0yDtbMGz/Chat-GPT-Image-Jul-4-2025-11-46-42-PM.png" // abstract blob
    alt="abstract blob"
    className="absolute md:block hidden right-[-140px] top-[-280px] w-[73%] opacity-25"
  />
  <img
    src="https://i.ibb.co/6JBWTb0w/Chat-GPT-Image-Jul-4-2025-11-46-22-PM.png" // grid/map style
    alt="grid background"
    className="absolute md:block hidden right-[-6px] opacity-75 top-[-30px] w-[50%]"
  />
       </div>
  {/* Left Column */}
  <div className="lg:w-[40%] w-full md:mt-0 mt-10 md:mb-0 mb-10 !z-10">
          <h1 className="text-4xl md:text-3xl lg:text-7xl poppins-semibold text-blue-900 leading-tight mb-4">
            Book Errands <br /> Instantly
          </h1>
          <p className="text-2xl poppins-medium text-black mb-6">
            Pickup • Drop-off • Midway Stops <br />
            — On-Demand
          </p>

        </div>
      
        {/* Right Column (Form) */}
        <div className="bg-white w-full rounded-2xl shadow-md p-6 md:p-8 ml-auto md:w-[40%] !z-10"
        style={{
            marginBottom: `-${150 - midwayStops.length * 30}px`, // increase bottom margin as stops grow
          }}>
      <h2 className="text-4xl font-bold poppins-semibold text-blue-900 mb-6 ">Book an Errand</h2>

      <RideRequestForm />
    </div>
      </div>

{/* account and activity */}
{user ? (
        // Logged-in user view
        <div className="flex flex-col lg:flex-row md:mt-20 mt-44 mb-8 w-[90%] mx-auto gap-8 rounded-2xl border border-2 p-6">
          {/* Your Location */}
          <div className="w-full lg:w-1/3 bg-white">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Location</h3>
            <div className="w-full rounded-xl overflow-hidden">
              <iframe
                title="Regina Map"
                width="100%"
                height="220"
                className="rounded-xl"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d45523.89642954821!2d-104.67554336896333!3d50.44521053608486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x531c1e64b52f3f3f%3A0x6a0ef84f87355f51!2sRegina%2C%20SK!5e0!3m2!1sen!2sca!4v1720364567890!5m2!1sen!2sca"
              ></iframe>
            </div>
            <p className="text-sm text-gray-500 mt-2">2248 Osler Street, Regina SK</p>
          </div>

          {/* Order History */}
          <div className="w-full lg:w-1/3 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order History</h2>
            {visibleOrders.map((order, index) => (
              <div
                key={index}
                className="bg-gray-50 border rounded-xl p-4 flex items-center justify-between mb-3 transition hover:shadow"
              >
                <div>
                  <p className="font-medium text-gray-800">{order.name}</p>
                  <p className="text-sm text-gray-500">{order.address}</p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}

            {orderHistory.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 hover:underline text-sm mt-2"
              >
                {showAll ? "See Less" : "See More"}
              </button>
            )}
          </div>

          {/* Ride Summary */}
          <div className="w-full lg:w-1/3 bg-white">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Ride Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-xl p-4 shadow-sm hover:bg-blue-100 transition">
                <p className="text-sm text-gray-500">Total Rides</p>
                <p className="text-2xl font-bold text-blue-600">84</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 shadow-sm hover:bg-green-100 transition">
                <p className="text-sm text-gray-500">Total Distance</p>
                <p className="text-2xl font-bold text-green-600">215 km</p>
              </div>
              <div className="bg-gray-100 rounded-xl p-4 shadow-sm hover:bg-gray-200 transition">
                <p className="text-sm text-gray-500">Last Ride</p>
                <p className="text-xl font-bold text-gray-700">Aug 2, 2025</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 shadow-sm hover:bg-green-100 transition">
                <p className="text-sm text-gray-500">Total Cancelled</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Not logged-in view
<div className="mt-20 flex flex-col items-center text-center gap-8 w-[90%] mx-auto">
  {/* Map Preview */}
  <div className="w-full lg:w-3/4 h-64 rounded-2xl overflow-hidden shadow-lg relative">
    <iframe
      title="Preview Map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d45523.89642954821!2d-104.67554336896333!3d50.44521053608486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x531c1e64b52f3f3f%3A0x6a0ef84f87355f51!2sRegina%2C%20SK!5e0!3m2!1sen!2sca!4v1720364567890!5m2!1sen!2sca"
      className="w-full h-full filter blur-sm scale-105"
      loading="lazy"
    ></iframe>
    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/60 to-transparent flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold text-gray-800">Track Rides Instantly</h2>
      <p className="text-gray-600 mt-2">See where your driver is in real-time</p>
    </div>
  </div>

  {/* Teaser Stats */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-3/4">
    <div className="bg-blue-50 p-4 rounded-xl shadow hover:bg-blue-100 transition">
      <p className="text-sm text-gray-500">Rides Today</p>
      <p className="text-2xl font-bold text-blue-600">5,482</p>
    </div>
    <div className="bg-green-50 p-4 rounded-xl shadow hover:bg-green-100 transition">
      <p className="text-sm text-gray-500">Cities Covered</p>
      <p className="text-2xl font-bold text-green-600">30</p>
    </div>
    <div className="bg-yellow-50 p-4 rounded-xl shadow hover:bg-yellow-100 transition">
      <p className="text-sm text-gray-500">Drivers Online</p>
      <p className="text-2xl font-bold text-yellow-600">1,024</p>
    </div>
    <div className="bg-red-50 p-4 rounded-xl shadow hover:bg-red-100 transition">
      <p className="text-sm text-gray-500">Avg Arrival</p>
      <p className="text-2xl font-bold text-red-600">5 min</p>
    </div>
  </div>

  {/* Features */}
  <div className="flex flex-col md:flex-row gap-6 w-full lg:w-3/4 mt-6">
    <div className="flex-1 bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="font-semibold text-gray-800 mb-2">Fast Rides</h3>
      <p className="text-gray-500 text-sm">Get a ride in minutes, anywhere in your city.</p>
    </div>
    <div className="flex-1 bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="font-semibold text-gray-800 mb-2">Safe Drivers</h3>
      <p className="text-gray-500 text-sm">All drivers are verified and rated by users.</p>
    </div>
    <div className="flex-1 bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="font-semibold text-gray-800 mb-2">Track Your Trip</h3>
      <p className="text-gray-500 text-sm">Know your driver’s location in real-time.</p>
    </div>
  </div>

  {/* CTA Buttons */}
  <div className="mt-6 flex flex-col sm:flex-row gap-4">
    <button
      onClick={() => navigate("/signup")}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
    >
      Join Now
    </button>
    <button
      onClick={() => navigate("/features")}
      className="bg-white border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
    >
      Explore App
    </button>
  </div>
</div>

      )}

{/* Why Choose Us Section */}
<div className="bg-white py-16 px-6 lg:px-20 text-center">
  <h2 className="text-4xl font-bold text-blue-900 mb-6">Why Choose Us?</h2>
  <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
    We’re committed to making your errand experience fast, safe, and hassle-free. Here’s why thousands trust us every day.
  </p>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
    {/* Feature 1 */}
    <div className="p-6 border rounded-xl hover:shadow-lg transition">
      <div className="text-5xl flex items-center justify-center text-orange-500 mb-4">
        <FaCarSide />
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Fast & Reliable</h4>
      <p className="text-sm text-gray-600">
        Our drivers are trained to ensure on-time pickups and deliveries, every time.
      </p>
    </div>

    {/* Feature 2 */}
    <div className="p-6 border rounded-xl hover:shadow-lg transition">
      <div className="text-5xl flex items-center justify-center text-blue-600 mb-4">
        <FiSettings />
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Real-time Tracking</h4>
      <p className="text-sm text-gray-600">
        Know where your items are at all times with our integrated live tracking.
      </p>
    </div>

    {/* Feature 3 */}
    <div className="p-6 border rounded-xl hover:shadow-lg transition">
      <div className="text-5xl flex items-center justify-center text-green-600 mb-4">
        <BiSupport />
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">24/7 Support</h4>
      <p className="text-sm text-gray-600">
        Questions or issues? Our support team is always ready to help you.
      </p>
    </div>

    {/* Feature 4 */}
    <div className="p-6 border rounded-xl hover:shadow-lg transition">
      <div className="text-5xl flex items-center justify-center text-purple-500 mb-4">
        <FaBriefcase />
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Affordable Pricing</h4>
      <p className="text-sm text-gray-600">
        Enjoy competitive rates without compromising service quality.
      </p>
    </div>
  </div>
</div>

{/* Support Section */}
<div className="bg-gray-50 py-16 px-6 lg:px-20 text-center">
  <h2 className="text-4xl font-bold text-blue-900 mb-4">We're Here to Help</h2>
  <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
    Questions? Concerns? Our support team is available 24/7 to assist you with anything.
  </p>

<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
  <div className="p-6 border rounded-xl bg-white">
    <h4 className="text-lg font-semibold text-gray-800 mb-2">Live Chat</h4>
    <p className="text-sm text-gray-600">Get instant help inside the app or website via live chat.</p>
  </div>
  <div className="p-6 border rounded-xl bg-white">
    <h4 className="text-lg font-semibold text-gray-800 mb-2">Email Support</h4>
    <p className="text-sm text-gray-600">Reach out anytime: <span className="text-blue-600">support@yourapp.com</span></p>
  </div>
  <div className="p-6 border rounded-xl bg-white">
    <h4 className="text-lg font-semibold text-gray-800 mb-2">Help Center</h4>
    <p className="text-sm text-gray-600">Visit our <span className="text-blue-600 underline cursor-pointer" onClick={() => navigate("/dashboard/support")}>FAQ & Help Center</span> for step-by-step guides.</p>
  </div>
</div>
</div>

{/* How It Works Section */}
<div className="bg-white py-16 px-6 lg:px-20 text-center">
  <h2 className="text-4xl font-bold text-blue-900 mb-6">How It Works</h2>
  <div className="grid md:grid-cols-4 gap-8 mt-8">
    {[
      { step: "1", title: "Book Your Task", desc: "Enter pickup, drop-off & stops." },
      { step: "2", title: "Get a Quote", desc: "Instant pricing based on your trip." },
      { step: "3", title: "Track in Real-Time", desc: "Live updates at your fingertips." },
      { step: "4", title: "Delivered Safely", desc: "Timely and secure delivery." }
    ].map(({ step, title, desc }) => (
      <div key={step} className="p-6 border rounded-xl hover:shadow-lg transition">
        <div className="text-3xl font-bold text-orange-500 mb-2">{step}</div>
        <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600 mt-2">{desc}</p>
      </div>
    ))}
  </div>
</div>



{/* Customers Say Section */}
<div className="bg-gray-50 py-16 px-6 lg:px-20 text-center">
  <h2 className="text-4xl font-bold text-blue-900 mb-6">What Our Customers Say</h2>
  <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
    Real feedback from people who rely on our services every day.
  </p>

  <div className="grid md:grid-cols-3 gap-8">
    {[
      {
        name: "Sarah J.",
        feedback: "The booking process is seamless, and my items always arrive on time.",
        avatar: "https://i.pravatar.cc/150?img=32"
      },
      {
        name: "James T.",
        feedback: "I love the live tracking. It's super reliable and gives me peace of mind.",
        avatar: "https://i.pravatar.cc/150?img=12"
      },
      {
        name: "Angela M.",
        feedback: "Affordable, efficient, and the support team is incredibly responsive!",
        avatar: "https://i.pravatar.cc/150?img=52"
      }
    ].map((testimonial, idx) => (
      <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full mx-auto mb-4"
        />
        <p className="text-gray-600 text-sm mb-4">"{testimonial.feedback}"</p>
        <p className="font-semibold text-gray-900">{testimonial.name}</p>
      </div>
    ))}
  </div>
</div>

{/* Ready to Book Section */}
<div className="bg-blue-900 text-white text-center py-16 px-6 lg:px-20">
  <h2 className="text-4xl font-bold mb-4">Ready to Book Your First Errand?</h2>
  <p className="text-lg mb-8">Get started in seconds. Safe, fast & reliable services await!</p>
  <button
    onClick={() => {
        window.scrollTo(0, 0); // scrolls to top
      }}
    className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-xl text-lg font-semibold"
  >
    Book Now
  </button>
</div>

{/* FAQs Section */}
<div className="bg-gray-100 py-16 px-6 lg:px-20">
  <h2 className="text-4xl font-bold text-blue-900 text-center mb-10">Frequently Asked Questions</h2>
  <div className="max-w-3xl mx-auto space-y-6">
    {[
      {
        q: "How do I track my delivery?",
        a: "Once you book, you’ll get a link to track your delivery in real-time."
      },
      {
        q: "Can I cancel my errand?",
        a: "Yes, you can cancel anytime before the pickup starts, without fees."
      },
      {
        q: "Are my items insured?",
        a: "Yes, we cover all deliveries with standard insurance policies."
      }
    ].map((faq, idx) => (
      <div key={idx}>
        <h4 className="text-lg font-semibold text-gray-800">{faq.q}</h4>
        <p className="text-sm text-gray-600 mt-1">{faq.a}</p>
      </div>
    ))}
  </div>
</div>

{/* Become a Rider Section */}
<div className="bg-white py-16 px-6 lg:px-20 text-center">
  <h2 className="text-4xl font-bold text-blue-900 mb-4">Become a Rider</h2>
  <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
    Join our growing fleet and earn on your schedule. Flexible hours, great support, and daily payouts.
  </p>

  <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
    <div className="p-6 border rounded-xl hover:shadow-md transition">
      <h4 className="text-lg font-semibold mb-2 text-blue-700">Flexible Scheduling</h4>
      <p className="text-sm text-gray-600">Work when you want — part-time, full-time, or just weekends.</p>
    </div>
    <div className="p-6 border rounded-xl hover:shadow-md transition">
      <h4 className="text-lg font-semibold mb-2 text-blue-700">Instant Payouts</h4>
      <p className="text-sm text-gray-600">Get paid directly to your account at the end of each shift.</p>
    </div>
    <div className="p-6 border rounded-xl hover:shadow-md transition">
      <h4 className="text-lg font-semibold mb-2 text-blue-700">Full App Support</h4>
      <p className="text-sm text-gray-600">Track tasks, earnings, and routes with our easy-to-use Rider app.</p>
    </div>
  </div>

  <button
  onClick={() => window.open("https://my-dipatch-driver.vercel.app/", "_blank")}
  className="mt-10 bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-xl text-lg font-semibold"
>
  Join as a Rider
</button>

</div>

{/* footer Section */}
<footer className="bg-blue-900 text-white pt-12 pb-6 px-6 md:px-20">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
    {/* Brand & Description */}
    <div>
    <img
          src="https://i.ibb.co/TxC947Cw/thumbnail-Image-2025-07-09-at-2-10-AM-removebg-preview.png"
          alt="Logo"
          className="w-24 object-contain filter brightness-0 invert"
        />
      <p className="text-gray-400 text-sm">
      Book a driver. We pick up. We deliver. You relax. Fast, reliable delivery and errands made easy.
      </p>
    </div>

    {/* Navigation */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Company</h3>
      <ul className="space-y-2 text-gray-400 text-sm">
        <li><a href="/about" className="hover:text-white">About Us</a></li>
        <li><a href="/careers" className="hover:text-white">Careers</a></li>
        <li><a href="/drivers" className="hover:text-white">Become a Rider</a></li>
        <li><a href="/support" className="hover:text-white">Support</a></li>
      </ul>
    </div>

    {/* Resources */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Resources</h3>
      <ul className="space-y-2 text-gray-400 text-sm">
        <li><a href="/help" className="hover:text-white">Help Center</a></li>
        <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
        <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
        <li><a href="/safety" className="hover:text-white">Safety Guidelines</a></li>
      </ul>
    </div>

    {/* App Download */}
    {/* <div>
      <h3 className="text-lg font-semibold mb-4">Get the App</h3>
      <div className="flex flex-col gap-3">
        <a href="#" className="w-32">
          <img src="/appstore.png" alt="Download on App Store" />
        </a>
        <a href="#" className="w-32">
          <img src="/playstore.png" alt="Get it on Google Play" />
        </a>
      </div>
    </div> */}
  </div>

  <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
    <p>© {new Date().getFullYear()} LocalRun. All rights reserved.</p>
    <div className="flex gap-4 mt-4 md:mt-0">
      <a href="#" className="hover:text-white">Facebook</a>
      <a href="#" className="hover:text-white">Twitter</a>
      <a href="#" className="hover:text-white">Instagram</a>
    </div>
  </div>
</footer>


    </div>
  );
};

export default LandingPage;
