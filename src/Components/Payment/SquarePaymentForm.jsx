import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { endPoint } from "../ForAPIs";
import useAuth from "../useAuth";

const SquarePaymentForm = ({
  amount,
  driverEarning,
  adminCut,
  rideId, 
  customerId,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const {token} = useAuth();
  console.log(rideId)
  const [billing, setBilling] = useState({
    cardholderName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "CA",
    email: "",
    phone: "",
  });

  const cardRef = useRef(null);
  const paymentsRef = useRef(null);

  // Load Square SDK
  useEffect(() => {
    const loadSquareSDK = () => {
      return new Promise((resolve, reject) => {
        if (window.Square) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
        script.id = "square-sdk";
        script.type = "text/javascript";
        script.async = true;
        
        script.onload = () => {
          console.log("Square SDK loaded");
          resolve();
        };
        
        script.onerror = () => {
          reject(new Error("Failed to load Square SDK"));
        };
        
        document.head.appendChild(script);
      });
    };

    const initialize = async () => {
      try {
        await loadSquareSDK();
        
        if (!window.Square) {
          throw new Error("Square SDK not available");
        }

        setSdkLoaded(true);
      } catch (error) {
        console.error("Failed to load Square SDK:", error);
        setErrors(["Failed to load payment system. Please refresh the page."]);
      }
    };

    initialize();
  }, []);

  // Initialize card when SDK is loaded
  useEffect(() => {
    if (!sdkLoaded || !window.Square) return;

    const initializeCard = async () => {
      try {
        const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
        const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
        
        if (!appId || !locationId) {
          throw new Error("Missing Square configuration");
        }

        // Initialize Square payments
        const payments = window.Square.payments(appId, locationId);
        paymentsRef.current = payments;

        // Create and mount the card
        const card = await payments.card({
          style: {
            input: {
              fontSize: "16px",
              color: "#333",
              fontFamily: "Arial, sans-serif",
              fontWeight: "400",
            },
          },
        });

        await card.attach("#card-container");
        cardRef.current = card;

      } catch (error) {
        console.error("Failed to initialize card:", error);
        setErrors(["Failed to initialize payment form. Please refresh."]);
      }
    };

    initializeCard();

    return () => {
      if (cardRef.current) {
        cardRef.current.destroy();
      }
    };
  }, [sdkLoaded]);

  const handleChange = (field) => (e) => {
    setBilling((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cardRef.current) {
      setErrors(["Payment form not ready. Please wait."]);
      return;
    }

    // Validate required fields
    const requiredFields = ['cardholderName', 'addressLine1', 'city', 'province', 'postalCode'];
    const missingFields = requiredFields.filter(field => !billing[field]?.trim());
    
    if (missingFields.length > 0) {
      setErrors(["Please fill in all required fields."]);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      // First, try to tokenize WITHOUT verificationDetails
      let tokenResult;
      
      try {
        // Method 1: Try without verificationDetails
        tokenResult = await cardRef.current.tokenize();
        console.log("Tokenization without verificationDetails:", tokenResult);
      } catch (tokenError) {
        console.log("Tokenization without verificationDetails failed, trying with...");
        
        // Method 2: Try with verificationDetails
        const cleanPostal = billing.postalCode.toUpperCase().replace(/\s/g, '');
        const nameParts = billing.cardholderName.trim().split(/\s+/);
        
        // Create billing contact with all fields as strings
        const billingContact = {
          givenName: String(nameParts[0] || "Customer"),
          familyName: String(nameParts.slice(1).join(" ") || ""),
          addressLines: [billing.addressLine1, billing.addressLine2].filter(Boolean).map(String),
          city: String(billing.city),
          state: String(billing.province),
          postalCode: String(cleanPostal),
          countryCode: String(billing.country || "CA"),
        };

        // Add optional fields only if they exist
        if (billing.email?.trim()) {
          billingContact.email = String(billing.email.trim());
        }
        if (billing.phone?.trim()) {
          billingContact.phone = String(billing.phone.trim());
        }

        const verificationDetails = {
          amount: String(Number(amount).toFixed(2)),
          currencyCode: "CAD",
          intent: "CHARGE",
          billingContact: billingContact,
          customerInitiated: true,
          sellerKeyedIn: false,
        };

        console.log("Attempting with verificationDetails:", verificationDetails);
        
        // Explicitly create a new object to avoid any React proxy issues
        const verificationDetailsPlain = JSON.parse(JSON.stringify(verificationDetails));
        
        tokenResult = await cardRef.current.tokenize({
          verificationDetails: verificationDetailsPlain
        });
      }

      // Check tokenization result
      if (tokenResult.status === "OK") {
        const cleanPostal = billing.postalCode.toUpperCase().replace(/\s/g, '');
        
        // Send to backend
        const res = await axios.post(
  `${endPoint}/payment/process`,
  {
    cardToken: tokenResult.token,
    rideId,                    // REQUIRED
    customerId,                // REQUIRED
    totalAmount: Number(amount),
    driverAmount: Number(driverEarning),
    adminAmount: Number(adminCut),
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);


        onPaymentSuccess(res.data);
      } else {
        console.error("Tokenization failed:", tokenResult.errors);
        throw new Error(tokenResult.errors?.[0]?.message || "Payment processing failed");
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      
      let errorMessage = error.message;
      
      // More user-friendly error messages
      if (error.message.includes("postal")) {
        errorMessage = "Invalid postal code. Please enter a valid Canadian postal code.";
      } else if (error.message.includes("address")) {
        errorMessage = "Please check your address information.";
      } else if (error.message.includes("card") || error.message.includes("token")) {
        errorMessage = "Card information is invalid. Please check your card details.";
      }
      
      setErrors([errorMessage]);
      onPaymentError && onPaymentError(error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h3 className="font-bold text-xl mb-6 text-gray-800">
        Pay ${Number(amount).toFixed(2)} CAD
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Cardholder Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Cardholder Name <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="John Doe"
            value={billing.cardholderName}
            onChange={handleChange("cardholderName")}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Address Line 1 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="123 Main St"
            value={billing.addressLine1}
            onChange={handleChange("addressLine1")}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Address Line 2 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Address Line 2 (optional)</label>
          <input
            placeholder="Apt, Suite, etc."
            value={billing.addressLine2}
            onChange={handleChange("addressLine2")}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Toronto"
            value={billing.city}
            onChange={handleChange("city")}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Province */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Province <span className="text-red-500">*</span>
          </label>
          <select
            value={billing.province}
            onChange={handleChange("province")}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            required
          >
            <option value="">Select Province</option>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NS">Nova Scotia</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Quebec</option>
            <option value="SK">Saskatchewan</option>
            <option value="NT">Northwest Territories</option>
            <option value="NU">Nunavut</option>
            <option value="YT">Yukon</option>
          </select>
        </div>

        {/* Postal Code */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="S4P 1W9"
            value={billing.postalCode}
            onChange={handleChange("postalCode")}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            pattern="[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]"
            title="Canadian postal code format: A1A 1A1"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Email (optional)</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={billing.email}
            onChange={handleChange("email")}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Phone (optional)</label>
          <input
            type="tel"
            placeholder="555-555-5555"
            value={billing.phone}
            onChange={handleChange("phone")}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Card Details */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-700">
            Card Details <span className="text-red-500">*</span>
          </label>
          <div 
            id="card-container" 
            className="border rounded-lg p-4 min-h-[60px] bg-white"
          ></div>
          <p className="text-xs text-gray-500 mt-2">
            Enter your card number, expiration date, and CVV
          </p>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            {errors.map((err, i) => (
              <p key={i} className="text-red-700 text-sm font-medium">{err}</p>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={loading || !cardRef.current}
            className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all ${
              loading || !cardRef.current
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
            }`}
          >
            {loading ? "Processing Payment..." : `Pay $${Number(amount).toFixed(2)}`}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-4 border rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500">
        Powered by Square • PCI-DSS Compliant • 256-bit SSL Encryption
      </div>
      
      {/* Debug info */}
      <div className="mt-4 text-xs text-gray-400">
        <p>SDK Loaded: {sdkLoaded ? "Yes" : "No"}</p>
        <p>Card Ready: {cardRef.current ? "Yes" : "No"}</p>
      </div>
    </div>
  );
};

export default SquarePaymentForm;