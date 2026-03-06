import { motion } from 'motion/react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import React, { useState } from 'react';

export default function Contact() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch('https://formspree.io/f/xkoqwayb', {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                setStatus('success');
                form.reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col pt-12 items-center justify-center">
            <div className="max-w-xl w-full mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-10 space-y-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-[0_0_20px_theme(colors.primary/20)]"
                    >
                        <MessageSquare className="w-8 h-8 text-primary" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter neon-glow-text"
                    >
                        Initiate <span className="text-primary">Contact</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground font-medium"
                    >
                        Transmit a direct message to the core engineering team.
                    </motion.p>
                </div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-8 rounded-2xl border border-white/10"
                >
                    {status === 'success' ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                <Send className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-emerald-500 uppercase tracking-widest">Transmission Successful</h3>
                            <p className="text-muted-foreground text-sm">Your message has been securely delivered to the Clickyx network.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-colors"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    Signal Origin (Email)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        className="block w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="user@network.local"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    Data Payload (Message)
                                </label>
                                <textarea
                                    name="message"
                                    id="message"
                                    required
                                    rows={5}
                                    className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                    placeholder="Enter your query or feedback here..."
                                />
                            </div>

                            {status === 'error' && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-500 text-center font-bold">
                                    Transmission failed. Please verify your connection and try again.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full btn-primary-tech py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                {status === 'submitting' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Deploy Message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
