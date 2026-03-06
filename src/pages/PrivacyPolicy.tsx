import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-[80vh] flex flex-col pt-12">
            <div className="max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-[0_0_15px_theme(colors.primary/20)]">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter neon-glow-text">
                            Data Privacy <span className="text-primary">Policy</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground font-mono text-sm tracking-wide"
                    >
                        EFFECTIVE DATE: {new Date().toLocaleDateString()} // SECURE PROTOCOL
                    </motion.p>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-8 md:p-12 space-y-8"
                >
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground uppercase tracking-widest">
                            Information We Collect
                        </h2>
                        <div className="text-muted-foreground space-y-4 leading-relaxed">
                            <p>
                                1. **Account Data**: When you register for the Clickyx Central Core, we securely collect your email address and securely hashed password credentials.
                            </p>
                            <p>
                                2. **Generation Data**: We log your synthesis prompts and store the resulting AI-generated assets in secure cloud buckets to provide you with your personal generation history.
                            </p>
                            <p>
                                3. **Payment Information**: Transactions are handled securely by third-party providers (e.g., PayPal). Clickyx does not store full credit card numbers or financial routing data on our local databases.
                            </p>
                        </div>
                    </section>

                    <div className="h-px bg-white/5" />

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground uppercase tracking-widest">
                            How We Use Your Data
                        </h2>
                        <div className="text-muted-foreground space-y-4 leading-relaxed">
                            <ul className="list-disc list-inside space-y-2 marker:text-primary">
                                <li>To authenticate you and grant access to the neural network endpoints.</li>
                                <li>To manage credit deductions and subscription tiers.</li>
                                <li>To improve the accuracy, speed, and safety of our image generation models.</li>
                                <li>To contact you regarding account security, fundamental platform updates, or customer support.</li>
                            </ul>
                        </div>
                    </section>

                    <div className="h-px bg-white/5" />

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground uppercase tracking-widest">
                            Data Security & Processing
                        </h2>
                        <div className="text-muted-foreground space-y-4 leading-relaxed">
                            <p>
                                Your data is transmitted over encrypted channels. We employ industry-standard protocols to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                            <p>
                                However, no transmission method over the public internet, or method of electronic storage, is 100% secure. You use the service at your own risk.
                            </p>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
