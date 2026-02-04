import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { endPoint } from "../ForAPIs";
import useAuth from "../useAuth";
import toast, { Toaster } from "react-hot-toast";

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
  const {token, user} = useAuth();
const [useSavedAddress, setUseSavedAddress] = useState(false);
const [savedCards, setSavedCards] = useState([]);
const [selectedCard, setSelectedCard] = useState(null);
const [saveCardForLater, setSaveCardForLater] = useState(true);
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

  console.log("user", user)
  console.log("savedCards", savedCards)
  console.log("selectedCard", selectedCard)
  const cardRef = useRef(null);
  const paymentsRef = useRef(null);
useEffect(() => {
  if (!user) return;

  const billingAddress = user.billingAddress;

  // ⛔ Don't run effect if billingAddress is undefined yet
  if (billingAddress === undefined) return;

  if (billingAddress?.addressLine1) {
    setBilling(prev => ({
      ...prev,
      ...billingAddress,
      email: user.email || "",
      phone: user.phone || "",
      cardholderName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        billingAddress.cardholderName ||
        "Customer",
    }));
    setUseSavedAddress(true);
  } else {
    setUseSavedAddress(false);
  }
}, [user]);

useEffect(() => {
  console.log(user)
    if(!user){return};
      setSavedCards(user?.savedCards || []);
}, [token]);


  const saveBillingAddress = async () => {
  await axios.put(
    `${endPoint}/user/billing-address`,
    {
      cardholderName: billing.cardholderName,
      addressLine1: billing.addressLine1,
      addressLine2: billing.addressLine2,
      city: billing.city,
      province: billing.province,
      postalCode: billing.postalCode,
      country: billing.country,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

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
  if (!sdkLoaded || !window.Square || selectedCard) return;

  const initializeCard = async () => {
    try {
      const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
      const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

      const payments = window.Square.payments(appId, locationId);
      paymentsRef.current = payments;

      const card = await payments.card({
        style: {
          input: { fontSize: "16px", color: "#333", fontFamily: "Arial, sans-serif" },
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
    if (cardRef.current) cardRef.current.destroy();
  };
}, [sdkLoaded, selectedCard]);


  const handleChange = (field) => (e) => {
    setBilling((prev) => ({ ...prev, [field]: e.target.value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // 💳 PAY USING SAVED CARD
  if (selectedCard) {
    try {
      setLoading(true);

      const res = await axios.post(
        `${endPoint}/wallet/pay-with-saved-card`,
        {
          cardId: selectedCard.squareCardId,
          rideId,
          totalAmount: Number(amount),
          driverAmount: Number(driverEarning),
          adminAmount: Number(adminCut),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    console.error("Saved card payment success:", res);
      
      onPaymentSuccess(res.data);
      return;
    } catch (err) {
    console.error("Saved card payment failed:", err);
      setErrors(["Saved card payment failed"]);
      onPaymentError && onPaymentError(err);
      setLoading(false);
      return;
    }
  }

  if (!cardRef.current) {
    setErrors(["Payment form not ready. Please wait."]);
    return;
  }

  const requiredFields = useSavedAddress
    ? []
    : ["cardholderName", "addressLine1", "city", "province", "postalCode"];

  const missingFields = requiredFields.filter(
    (field) => !billing[field]?.trim()
  );

  if (missingFields.length > 0) {
    setErrors(["Please fill in all required fields."]);
    return;
  }

  setLoading(true);
  setErrors([]);

  try {
    let tokenResult;

    // 🔹 Try tokenizing without verification first
    try {
      tokenResult = await cardRef.current.tokenize();
    } catch {
      // 🔹 Retry with verificationDetails if needed
      const billingInfo = useSavedAddress
        ? {
            ...user.billingAddress,
            email: user.email,
            phone: user.phone,
            cardholderName:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              "Customer",
          }
        : billing;

      const verificationDetails = {
        amount: String(Number(amount).toFixed(2)),
        currencyCode: "CAD",
        intent: "CHARGE",
        billingContact: {
          givenName: billingInfo.cardholderName.split(" ")[0] || "Customer",
          familyName:
            billingInfo.cardholderName.split(" ").slice(1).join(" ") || "",
          addressLines: [
            billingInfo.addressLine1,
            billingInfo.addressLine2,
          ].filter(Boolean),
          city: billingInfo.city,
          state: billingInfo.province,
          postalCode: billingInfo.postalCode.toUpperCase().replace(/\s/g, ""),
          countryCode: billingInfo.country || "CA",
          email: billingInfo.email,
          phone: billingInfo.phone,
        },
        customerInitiated: true,
        sellerKeyedIn: false,
      };

      tokenResult = await cardRef.current.tokenize({
        verificationDetails: JSON.parse(JSON.stringify(verificationDetails)),
      });
    }

    if (tokenResult.status !== "OK") {
      throw new Error(
        tokenResult.errors?.[0]?.message || "Payment processing failed"
      );
    }

    const nonce = tokenResult.token;

    // 💾 Save billing address if user entered new one
    if (!useSavedAddress) {
      await saveBillingAddress();
    }

    let paymentResponse;

    // ===============================
    // 🟢 SAVE CARD + PAY FLOW
    // ===============================
    if (saveCardForLater) {
      // 1️⃣ Save card using nonce
      const saveRes = await axios.post(
        `${endPoint}/wallet/save-card`,
        { cardToken: nonce },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedCardId = saveRes.data.card.id;

      // 2️⃣ Pay using saved card ID (NOT nonce)
      paymentResponse = await axios.post(
        `${endPoint}/wallet/pay-with-saved-card`,
        {
          cardId: savedCardId,
          rideId,
          totalAmount: Number(amount),
          driverAmount: Number(driverEarning),
          adminAmount: Number(adminCut),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    // ===============================
    // 🔵 ONE-TIME PAYMENT FLOW
    // ===============================
    else {
      paymentResponse = await axios.post(
        `${endPoint}/payment/process`,
        {
          cardToken: nonce,
          rideId,
          customerId,
          totalAmount: Number(amount),
          driverAmount: Number(driverEarning),
          adminAmount: Number(adminCut),
          billingAddress: { ...billing },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    onPaymentSuccess(paymentResponse.data);
  } catch (error) {
    console.error("Payment error:", error);

    let errorMessage = error.message;

    if (errorMessage.includes("postal")) {
      errorMessage =
        "Invalid postal code. Please enter a valid Canadian postal code.";
    } else if (errorMessage.includes("address")) {
      errorMessage = "Please check your address information.";
    } else if (
      errorMessage.includes("card") ||
      errorMessage.includes("token")
    ) {
      errorMessage =
        "Card session expired. Please re-enter your card details.";
    }

    setErrors([errorMessage]);
    onPaymentError && onPaymentError(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white">
      <h3 className="font-bold text-xl mb-6 text-gray-800">
        Pay ${Number(amount).toFixed(2)} CAD
      </h3>
{useSavedAddress && (
  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
    <h4 className="font-semibold text-gray-800 mb-2">Billing Address</h4>
    <p className="text-sm text-gray-700">
      {billing.cardholderName}<br />
      {billing.addressLine1}{billing.addressLine2 && `, ${billing.addressLine2}`}<br />
      {billing.city}, {billing.province} {billing.postalCode}<br />
      {billing.country}
    </p>

    <div className="mt-3 flex gap-3">
      {/* Change Address */}
      <button
        type="button"
        onClick={() => setUseSavedAddress(false)}
        className="text-sm text-orange-600 font-medium hover:underline"
      >
        Change billing address
      </button>

      {/* Use This Address */}
      <button
        type="button"
        onClick={() => {
          if (user.billingAddress) {
            setBilling(prev => ({
              ...prev,
              ...user.billingAddress,
              email: user.email || "",
              phone: user.phone || "",
              cardholderName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Customer",
            }));
            setUseSavedAddress(true);
          }
        }}
        className="text-sm text-green-600 font-medium hover:underline"
      >
        Use this address
      </button>
    </div>
  </div>
)}

      <form onSubmit={handleSubmit}>
        {!useSavedAddress && (
  <>
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
</>)}
        {/* Card Details */}
        <div className="mb-6">
          {!selectedCard && (
  <div className="mb-6">
    <label className="block text-sm font-medium mb-3 text-gray-700">
      Card Details <span className="text-red-500">*</span>
    </label>
    <div id="card-container" className="border rounded-lg p-4 min-h-[60px] bg-white"></div>
  </div>
)}
          {savedCards?.length > 0 && (
  <div className="mb-6">
    <h4 className="font-semibold mb-2">Saved Cards</h4>
    <div className="space-y-2">
      {savedCards.map(card => (
        <button
          key={card.squareCardId}
          type="button"
          onClick={() => setSelectedCard(card)}
          className={`w-full text-left p-3 border rounded-lg ${
            selectedCard?.squareCardId === card.squareCardId
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300"
          }`}
        >
          💳 {card.brand} •••• {card.last4}
        </button>
      ))}

      <button
        type="button"
        onClick={() => setSelectedCard(null)}
        className="text-sm text-blue-600 underline mt-2"
      >
        Use a new card instead
      </button>
    </div>
  </div>
)}

          {!selectedCard && (
  <label className="flex items-center gap-2 text-sm mt-3 text-gray-700">
    <input
      type="checkbox"
      checked={saveCardForLater}
      onChange={(e) => setSaveCardForLater(e.target.checked)}
    />
    Save this card for future rides
  </label>
)}

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
   <Toaster/>
          {(
            <button
              type="button"
               onClick={async () => {
  if (rideId) {
    try {
      await axios.delete(`${endPoint}/rides/${rideId}`);
      toast.success("Ride cancelled successfully");
    } catch (err) {
      console.error("Failed to cancel ride:", err);
      toast.error("Failed to cancel ride");
    }
  }

  onCancel && onCancel();
}}
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