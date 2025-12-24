

import React, { useState, useContext } from 'react';
import { AppContext, AppContextType } from '../App';
import { Event } from '../types';
import Modal from './Modal';
import { Icon } from './icons';
import { sendPaymentReceiptEmail } from '../services/emailService';

interface PaymentModalProps {
  event: Event;
  onClose: () => void;
}

type PaymentStep = 'details' | 'initiating' | 'awaiting_payment' | 'confirming' | 'success' | 'error';

// A generic view for loading/processing steps
const StatusView: React.FC<{ icon: string; title: string; message: string; }> = ({ icon, title, message }) => (
    <div className="flex flex-col items-center justify-center h-80 text-center animate-fade-in">
        <Icon name={icon} className="w-16 h-16 text-neon-blue animate-spin" />
        <h3 className="text-2xl font-bold mt-4 text-gray-200">{title}</h3>
        <p className="text-gray-400">{message}</p>
    </div>
);

// A non-functional, visual-only credit card form to simulate a payment gateway's secure iframe
const FakeCardForm: React.FC<{ onConfirm: () => void; amount: number; }> = ({ onConfirm, amount }) => (
    <div className="space-y-4 animate-fade-in">
        <p className="text-center text-gray-400 text-sm">This is a simulation. No real payment will be processed.</p>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 space-y-3">
            <div>
                <label className="text-xs text-gray-500">Card Number</label>
                <div className="w-full p-3 bg-gray-700 rounded-md font-mono text-gray-400">4242 4242 4242 4242</div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-xs text-gray-500">Expiry Date</label>
                    <div className="w-full p-3 bg-gray-700 rounded-md font-mono text-gray-400">12 / 25</div>
                </div>
                <div className="flex-1">
                    <label className="text-xs text-gray-500">CVC</label>
                    <div className="w-full p-3 bg-gray-700 rounded-md font-mono text-gray-400">123</div>
                </div>
            </div>
        </div>
        <button
            onClick={onConfirm}
            className="w-full py-3 mt-4 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90 transition-opacity"
        >
            Confirm Payment of ₹{amount.toFixed(2)}
        </button>
    </div>
);


const PaymentModal: React.FC<PaymentModalProps> = ({ event, onClose }) => {
  const [step, setStep] = useState<PaymentStep>('details');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const appContext = useContext(AppContext as React.Context<AppContextType>);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!userName.trim()) newErrors.name = 'Name is required.';
    if (!userEmail.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitiatePayment = () => {
    if (!validateForm()) return;
    
    // STEP 1 (SIMULATED): Frontend asks backend to create a payment intent.
    // The backend would talk to a payment gateway (e.g., Stripe) and return a client_secret.
    setStep('initiating');
    
    setTimeout(() => {
      // STEP 2 (SIMULATED): Backend returns the client_secret.
      // Frontend uses it to show the secure payment gateway form.
      setStep('awaiting_payment');
    }, 1500);
  };

  const handleConfirmPayment = async () => {
    // STEP 3 (SIMULATED): User submits the form to the payment gateway.
    // Frontend shows a processing state while the gateway confirms with the bank
    // and the backend waits for a confirmation webhook.
    setStep('confirming');
    
    setTimeout(async () => {
      try {
        // STEP 4 (SIMULATED): The payment gateway webhook is received by the backend.
        // The backend finalizes the transaction, updates the database, and sends an email.
        const paymentData = {
          eventId: event.id,
          eventName: event.title,
          userName,
          userEmail,
          amount: event.price || 0,
        };
        const newPayment = appContext.addPayment(paymentData);
        setTransactionId(newPayment.transactionId);

        try {
            await sendPaymentReceiptEmail(newPayment, appContext.siteSettings.adminPage.adminEmail);
        } catch (emailError) {
            console.error("Email failed to send but payment was recorded:", emailError);
            appContext.setAlert({
                message: "Payment successful, but we couldn't send the receipt email. Please check your spam folder or contact us if it doesn't arrive.",
                type: 'error',
            });
        }
        
        // STEP 5 (SIMULATED): Backend confirms success to the frontend.
        setStep('success');
      } catch (error) {
        console.error("Payment processing error:", error);
        setStep('error');
      }
    }, 2500);
  };

  const renderContent = () => {
    switch (step) {
      case 'initiating':
        return <StatusView icon="refresh" title="Initiating Secure Session" message="Preparing your transaction..." />;
      case 'awaiting_payment':
        return <FakeCardForm onConfirm={handleConfirmPayment} amount={event.price || 0} />;
      case 'confirming':
        return <StatusView icon="refresh" title="Confirming Payment..." message="This may take a moment. Please don't close this window." />;
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center h-80 text-center animate-fade-in">
            <Icon name="check" className="w-16 h-16 text-green-500" />
            <h3 className="text-2xl font-bold mt-4 text-green-400">Payment Successful!</h3>
            <p className="text-gray-300 mt-2">Your registration for <strong>{event.title}</strong> is confirmed.</p>
            <p className="text-gray-400 text-sm">A receipt has been sent to your email.</p>
            <div className="mt-4 p-3 bg-gray-900 rounded-md">
                <span className="text-xs text-gray-500">Transaction ID</span>
                <p className="font-mono text-golden-yellow">{transactionId}</p>
            </div>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-neon-blue text-white font-semibold rounded-lg hover:bg-blue-600">
                Close
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-80 text-center animate-fade-in">
            <Icon name="close" className="w-16 h-16 text-red-500" />
            <h3 className="text-2xl font-bold mt-4 text-red-400">Payment Failed</h3>
            <p className="text-gray-400 mt-2">Something went wrong. Please try again.</p>
             <button onClick={() => setStep('details')} className="mt-6 px-6 py-2 bg-neon-blue text-white font-semibold rounded-lg hover:bg-blue-600">
                Try Again
            </button>
          </div>
        );
      case 'details':
      default:
        return (
          <div>
            <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h4 className="text-lg font-bold text-gray-200">{event.title}</h4>
              <p className="text-gray-400">{event.date}</p>
              <p className="text-2xl font-bold text-golden-yellow mt-2">₹{event.price?.toFixed(2)}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-400">Your Name (for receipt)</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-3 bg-gray-700/50 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:border-neon-blue"
                  placeholder="e.g., John Doe"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-400">Your Email (for receipt)</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full p-3 bg-gray-700/50 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:border-neon-blue"
                  placeholder="e.g., john.doe@example.com"
                />
                 {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={handleInitiatePayment}
                className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-neon-blue to-neon-pink hover:opacity-90 transition-opacity"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch(step) {
      case 'success': return 'Confirmation';
      case 'awaiting_payment': return 'Secure Payment';
      case 'initiating':
      case 'confirming': return 'Processing...';
      default: return 'Event Registration';
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={getTitle()}>
      {renderContent()}
    </Modal>
  );
};

export default PaymentModal;