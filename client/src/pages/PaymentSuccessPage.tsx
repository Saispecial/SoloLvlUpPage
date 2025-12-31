import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-white/10 rounded-2xl p-8 max-w-md w-full text-center"
            >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-500" size={40} />
                </div>

                <h1 className="text-2xl font-bold text-white mb-4">Payment Received!</h1>

                <p className="text-gray-400 mb-8">
                    We are verifying your transaction. You will receive an email shortly with your access details.
                </p>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 text-left">
                    <h3 className="font-bold text-primary mb-2 text-sm">Next Steps:</h3>
                    <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                        <li>Check your inbox for a welcome email.</li>
                        <li>If you don't see it within 5 minutes, check spam.</li>
                        <li>Your community invite link is inside!</li>
                    </ul>
                </div>

                <Link href="/">
                    <a className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                        Return to Home <ArrowRight size={16} />
                    </a>
                </Link>
            </motion.div>
        </div>
    );
}
