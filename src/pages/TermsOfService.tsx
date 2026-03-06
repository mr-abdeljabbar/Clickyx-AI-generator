import { motion } from 'motion/react';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
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
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter neon-glow-text">
                            Terms of <span className="text-primary">Service</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground font-mono text-sm tracking-wide"
                    >
                        AGREEMENT REVISION: {new Date().toLocaleDateString()}
                    </motion.p>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-8 md:p-12 space-y-8"
                >
                    <div className="text-muted-foreground space-y-6 leading-relaxed">
                        <p className="font-bold text-foreground">
                            By accessing or using the Clickyx AI platform, you agree to be bound by these functional Terms of Service. If you disagree with any part of these terms, you may not access the service.
                        </p>

                        <section className="space-y-2">
                            <h3 className="text-lg font-bold text-white">1. Account Maintenance</h3>
                            <p>You are responsible for safeguarding the credentials associated with your Clickyx profile. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="text-lg font-bold text-white">2. Prohibited Conduct</h3>
                            <p>You agree not to deliberately use our neural synthesis engine to generate:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4 text-sm mt-2">
                                <li>Child Sexual Abuse Material (CSAM) or extreme explicit violence.</li>
                                <li>Content intended to harass, defame, or intimidate real individuals.</li>
                                <li>Deepfakes or impersonations engineered to spread political misinformation or commit fraud.</li>
                            </ul>
                            <p className="mt-2 text-sm text-red-400">Violation of these thresholds will result in immediate "Terminal Purge" account termination without refund.</p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="text-lg font-bold text-white">3. Credits & Purchases</h3>
                            <p>Generation credits are consumed upon successful API synthesis. Unused credits may roll over depending on your subscription tier. All purchases are final; no refunds are provided for partially used credit balances.</p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="text-lg font-bold text-white">4. Governing Law</h3>
                            <p>These terms shall be governed and construed in accordance with the laws of our primary operating jurisdiction, without regard to its conflict of law provisions.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
