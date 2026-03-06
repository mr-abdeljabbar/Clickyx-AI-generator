import { motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

export default function Disclaimer() {
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
                        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_theme(colors.red.500/20)]">
                            <ShieldAlert className="w-6 h-6 text-red-500" />
                        </div>
                        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter neon-glow-text">
                            Liability <span className="text-red-500">Disclaimer</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground font-mono text-sm tracking-wide"
                    >
                        LAST UPDATED: {new Date().toLocaleDateString()} // PROTOCOL VERSION 1.0
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
                        <h2 className="text-xl font-bold text-primary uppercase tracking-widest flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            1. AI-Generated Outputs
                        </h2>
                        <div className="text-muted-foreground space-y-4 leading-relaxed">
                            <p>
                                The images and content synthesized by Clickyx AI are generated via advanced neural networks. While we strive for high quality, the outputs may contain unpredictable, inaccurate, or inappropriate elements due to the nature of generative AI.
                            </p>
                            <p>
                                Clickyx makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the generated assets.
                            </p>
                        </div>
                    </section>

                    <div className="h-px bg-white/5" />

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-primary uppercase tracking-widest flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            2. Intellectual Property & Usage
                        </h2>
                        <div className="text-muted-foreground space-y-4 leading-relaxed">
                            <p>
                                It is strictly the user's responsibility to ensure that prompts submitted to our system, and the subsequent usage of generated assets, do not violate third-party copyrights, trademarks, or intellectual property rights.
                            </p>
                            <p>
                                We accept no liability for copyright infringement claims arising from content created through our platform.
                            </p>
                        </div>
                    </section>

                    <div className="h-px bg-white/5" />

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-primary uppercase tracking-widest flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            3. Service Availability
                        </h2>
                        <div className="text-muted-foreground space-y-4 leading-relaxed">
                            <p>
                                Clickyx operates "as is" and "as available". We do not guarantee continuous, uninterrupted, or perfectly secure access to our neural generation endpoints. We reserve the right to temporarily suspend the platform for maintenance or system upgrades without prior notice.
                            </p>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
