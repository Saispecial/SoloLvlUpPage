import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PaymentSuccessPage() {
    const [success, setSuccess] = useState(false);
    const { toast } = useToast();

    const form = useForm<InsertContact>({
        resolver: zodResolver(insertContactSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const onSubmit = async (data: InsertContact) => {
        try {
            await apiRequest("POST", "/api/contact", data);
            setSuccess(true);
            toast({
                title: "Information Received",
                description: "We have received your details.",
            });
        } catch (error) {
            toast({
                title: "Submission Failed",
                description: "Please try again or contact support.",
                variant: "destructive",
            });
        }
    };

    if (success) {
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

                    <h1 className="text-2xl font-bold text-white mb-4">Credentials will be sent soon!</h1>

                    <p className="text-gray-400 mb-8">
                        Thank you for verifying your payment details. You will satisfy the Verification Of Payments process shortly.
                    </p>

                    <Link href="/">
                        <a className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                            Return to Home <ArrowRight size={16} />
                        </a>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-white/10 rounded-2xl p-8 max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-primary" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Payment Verified!</h2>
                    <p className="text-gray-400 text-sm">
                        Please fill out this form to complete your registration.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Gmail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your.email@gmail.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Message (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Any additional details..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white mt-4"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Submit Details"
                            )}
                        </Button>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
}
