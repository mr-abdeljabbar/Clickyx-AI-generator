import { motion } from 'motion/react';
import { Aperture, Cpu, Globe2 } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen pt-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

                {/* Hero Section */}
                <section className="text-center space-y-8 max-w-3xl mx-auto relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono uppercase tracking-widest mb-4"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Initialize Story Protocol
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tighter leading-none"
                    >
                        Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 neon-glow-text">Evolution</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground leading-relaxed"
                    >
                        Clickyx was forged in the void between human imagination and machine precision. We build high-throughput neural architectures designed to convert textual thoughts into stunning, flawless digital assets in milliseconds.
                    </motion.p>
                </section>

                {/* Info Grid */}
                <section className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Cpu,
                            title: 'Neural Architecture',
                            desc: 'Powered by highly optimized deep learning models deployed on cutting-edge GPU clusters to ensure zero bottleneck rendering.'
                        },
                        {
                            icon: Aperture,
                            title: 'Flawless Synthesis',
                            desc: 'Our algorithms process high-fidelity noise generation resulting in unmatched resolution, coherence, and artistic integrity.'
                        },
                        {
                            icon: Globe2,
                            title: 'Global Infrastructure',
                            desc: 'Designed for high availability. Our distributed node network guarantees maximum uptime across the globe.'
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/50 transition-colors relative z-10">
                                <item.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-widest mb-3 relative z-10">{item.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed relative z-10">{item.desc}</p>
                        </motion.div>
                    ))}
                </section>

            </div>
        </div>
    );
}
