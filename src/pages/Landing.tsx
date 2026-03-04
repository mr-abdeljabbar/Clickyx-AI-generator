import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Landing = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto max-w-5xl py-24 sm:py-32 lg:py-40 text-center px-6"
      >
        <div className="hidden sm:mb-10 sm:flex sm:justify-center">
          <div className="hud-border px-4 py-1.5 text-[10px] font-black tracking-[0.3em] text-primary uppercase animate-float">
            System Online: Version 2.0.26
          </div>
        </div>

        <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-8xl mb-4 leading-none uppercase">
          Evolve your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-pulse neon-glow">
            Creativity
          </span>
        </h1>

        <p className="mt-8 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto font-medium">
          Harness the power of neural generation to create stunning visuals in milliseconds.
          Push the boundaries of imagination with our advanced AI interface.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/register"
            className="btn-primary-tech w-full sm:w-auto px-10 py-4 text-sm uppercase tracking-widest"
          >
            Initiate System
          </Link>
          <Link
            to="/login"
            className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all flex items-center gap-2 group"
          >
            Access Core <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* HUD Decoration */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 hidden lg:flex flex-col gap-10 opacity-20">
          <div className="w-12 h-1 bg-primary" />
          <div className="w-8 h-1 bg-primary/50" />
          <div className="w-4 h-1 bg-primary/20" />
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 hidden lg:flex flex-col items-end gap-10 opacity-20">
          <div className="w-12 h-1 bg-primary" />
          <div className="w-8 h-1 bg-primary/50" />
          <div className="w-4 h-1 bg-primary/20" />
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Neural Engine',
              description: 'Proprietary inference models optimized for lightning-fast visual processing.',
              tag: 'TECH-01'
            },
            {
              title: 'Ultra Fidelity',
              description: 'Generate high-resolution assets with extreme detail and perfect color depth.',
              tag: 'TECH-02'
            },
            {
              title: 'Matrix Rights',
              description: 'Full commercial ownership of every generation. Decentralized asset control.',
              tag: 'TECH-03'
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="tech-card p-8 group"
            >
              <div className="text-[10px] font-mono text-primary mb-6 opacity-50 tracking-widest">{feature.tag}</div>
              <dt className="text-xl font-black text-foreground uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground font-medium">
                {feature.description}
              </dd>
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-primary/30" />
                  <div className="w-1 h-3 bg-primary/60" />
                  <div className="w-1 h-3 bg-primary" />
                </div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground">READY</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
