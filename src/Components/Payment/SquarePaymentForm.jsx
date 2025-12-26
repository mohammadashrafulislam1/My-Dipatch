// components/Payment/SquarePaymentForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { endPoint } from '../ForAPIs';

const SquarePaymentForm = ({ 
  rideId, 
  amount, 
  driverEarning, 
  adminCut, 
  customerId, 
  onPaymentSuccess,
  onPaymentError,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState(null);
  const [errors, setErrors] = useState([]);
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  // Initialize Square Card
  useEffect(() => {
    const initSquareCard = async () => {
      if (!window.Square) {
        setErrors(['Payment system not available. Please refresh.']);
        return;
      }

      try {
        const payments = window.Square.payments(
          process.env.REACT_APP_SQUARE_APPLICATION_ID,
          process.env.REACT_APP_SQUARE_LOCATION_ID
        );

        const cardInstance = await payments.card({
          style: {
            '.input-container': {
              borderColor: '#E0E0E0',
              borderRadius: '8px',
              backgroundColor: 'white'
            },
            '.input-container.is-focus': {
              borderColor: '#FF6B35',
            },
            '.input-container.is-error': {
              borderColor: '#FF3B30',
            },
            '.message-text': {
              color: '#FF3B30',
              fontSize: '14px'
            }
          },
          postalCode: 'required'
        });

        await cardInstance.attach('#card-container');
        setCard(cardInstance);
      } catch (error) {
        console.error('Failed to initialize card:', error);
        setErrors(['Failed to load payment form. Please try again.']);
      }
    };

    initSquareCard();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!card) {
      setErrors(['Payment form not ready. Please wait.']);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      // Tokenize the card
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === 'OK') {
        // Process payment
        const response = await axios.post(`${endPoint}/payment/process`, {
          rideId,
          cardToken: tokenResult.token,
          customerId,
          totalAmount: amount,
          driverAmount: driverEarning,
          adminAmount: adminCut
        });

        if (response.data.success) {
          setPaymentProcessed(true);
          onPaymentSuccess(response.data);
        } else {
          throw new Error(response.data.message || 'Payment failed');
        }
      } else {
        const errorMsg = tokenResult.errors?.[0]?.detail || 'Card tokenization failed';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrors([error.message]);
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal">
      <div className="payment-content">
        <h3 className="payment-title">Complete Payment</h3>
        
        <div className="payment-summary">
          <div className="summary-row">
            <span>Total Amount:</span>
            <span className="amount">${amount.toFixed(2)} CAD</span>
          </div>
          <div className="summary-row">
            <span>Driver Earnings:</span>
            <span>${driverEarning.toFixed(2)} CAD</span>
          </div>
          <div className="summary-row">
            <span>Platform Fee:</span>
            <span>${adminCut.toFixed(2)} CAD</span>
          </div>
        </div>

        <div className="payment-form">
          <div className="form-section">
            <label className="form-label">Card Information</label>
            <div id="card-container" className="card-input"></div>
            <small className="text-sm text-gray-500 mt-2 block">
              Test Card: 4111 1111 1111 1111 | Exp: 12/30 | CVV: 123 | ZIP: 12345
            </small>
          </div>

          {errors.length > 0 && (
            <div className="error-container">
              {errors.map((error, index) => (
                <div key={index} className="error-message">
                  {error}
                </div>
              ))}
            </div>
          )}

          <div className="payment-buttons">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
              disabled={loading || paymentProcessed}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={loading || !card || paymentProcessed}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : paymentProcessed ? (
                'Payment Successful!'
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </button>
          </div>

          <div className="security-note">
            <span className="secure-badge">🔒 Secure Payment</span>
            <span>Powered by Square • Your card details are encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquarePaymentForm;