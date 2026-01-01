import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Shield, Users, Star, ExternalLink, ArrowRight } from "lucide-react";
import { NeonButton } from "@/components/NeonButton";
import { useLocation } from "wouter";

interface PayPalGateProps {
  onPaymentSuccess?: () => void; // Deprecated in favor of redirect, but kept for interface compatibility
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export function PayPalGate({ }: PayPalGateProps) {
  const [, setLocation] = useLocation();
  const [method, setMethod] = useState<'selection' | 'paypal'>('selection');
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Load PayPal SDK only when needed
  useEffect(() => {
    if (method === 'paypal' && !window.paypal) {
      const script = document.createElement('script');
      // Note: Removed vault=true and intent=subscription. Added currency=USD.
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'demo'}&currency=USD&intent=capture`;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    } else if (method === 'paypal' && window.paypal) {
      setPaypalLoaded(true);
    }
  }, [method]);

  // Ensure we have a session ID for tracking independent of PayPal login
  useEffect(() => {
    if (!localStorage.getItem('payment_session_id')) {
      const sid = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('payment_session_id', sid);
    }
  }, []);

  useEffect(() => {
    if (method === 'paypal' && paypalLoaded && window.paypal) {
      // Clear previous button if any
      const container = document.getElementById('paypal-button-container');
      if (container) container.innerHTML = '';

      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'pay'
        },
        createOrder: function (data: any, actions: any) {
          return actions.order.create({
            purchase_units: [{
              description: "SoloLvlUp Community Access",
              custom_id: localStorage.getItem('payment_session_id'), // Link user session
              amount: {
                value: "2.00"
              }
            }]
          });
        },
        onApprove: function (data: any, actions: any) {
          // CRITICAL: We do NOT verify here. Webhook is the source of truth.
          // Just redirect to success page to guide the user.
          console.log("PayPal approved, redirecting...", data);

          // Capture logic happens automatically on backend via webhook or we could capture here if we want immediate confirmation, 
          // but strict instruction says "capture order" then redirect. 
          // Actually, the standard flow is to capture on client OR server. 
          // Plan says: "Capture order" inside onApprove then redirect.
          return actions.order.capture().then(function (details: any) {
            console.log('Transaction completed by ' + details.payer.name.given_name);
            setLocation("/payment-success");
          });
        },
        onError: function (err: any) {
          console.error('PayPal error:', err);
        }
      }).render('#paypal-button-container');
    }
  }, [paypalLoaded, method, setLocation]);

  const handleUPI = () => {
    // Official Google Form URL for UPI Verification
    window.open('https://forms.gle/KxzNaECgf6YVHc9e7', '_blank');
  };

  // Demo Mode - Removed in Live
  // if (onSkipPayment) { ... }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-card border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
        {/* Back Button */}
        {method === 'paypal' && (
          <button
            onClick={() => setMethod('selection')}
            className="absolute top-4 left-4 text-gray-400 hover:text-white"
          >
            ← Back
          </button>
        )}

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Join SoloLvlUp Community</h2>
          <p className="text-gray-400 text-sm">
            Unlock exclusive access to our growth-focused community
          </p>
        </div>

        {/* Features Summary */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3">
            <Star className="text-primary" size={16} />
            <span className="text-gray-300 text-sm">Lifetime Access</span>
          </div>
        </div>

        {method === 'selection' ? (
          <div className="space-y-4">
            {/* Option A: International */}
            <button
              onClick={() => setMethod('paypal')}
              className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white p-4 rounded-xl flex items-center justify-between transition-all group"
            >
              <div className="flex flex-col items-start">
                <span className="font-bold">International</span>
                <span className="text-xs opacity-90">PayPal / Cards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">$2.00</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option B: India */}
            <button
              onClick={handleUPI}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:opacity-90 text-white p-4 rounded-xl flex items-center justify-between transition-all group"
            >
              <div className="flex flex-col items-start">
                <span className="font-bold">India</span>
                <span className="text-xs opacity-90">UPI / GPay / PhonePe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">₹149</span>
                <ExternalLink size={16} />
              </div>
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              *India option requires manual verification via Google Form
            </p>
          </div>
        ) : (
          /* "Coming Soon" View for International */
          <div className="w-full text-center py-8">
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl animate-pulse">
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon...</h3>
              <p className="text-gray-400 text-sm">
                International payments are currently being integrated. Please check back later or use the India option if you have a supported payment method.
              </p>
            </div>

            {/* 
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg mb-6 text-center">
              <p className="text-blue-200 text-sm">Total to pay: <strong>$2.00</strong></p>
            </div>

            <div id="paypal-button-container" className="min-h-[150px]">
              {!paypalLoaded && (
                <div className="w-full h-12 bg-gray-800 rounded animate-pulse flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Connecting to PayPal...</span>
                </div>
              )}
            </div>
            */}
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-6">
          <Shield size={14} />
          <span>Secure Checkout • Lifetime Access</span>
        </div>
      </div>
    </motion.div>
  );
}