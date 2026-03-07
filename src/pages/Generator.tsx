import React, { useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { downloadImage } from '../utils/downloadImage';
import { Download } from 'lucide-react';

const Generator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { checkAuth } = useAuthStore(); // To update credits

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImage(null);

    try {
      const response = await api.post('/generate', { prompt });
      setImage(response.data.imageUrl);
      
      // Directly update the user store with the deduct credits from the response
      if (response.data.user) {
        useAuthStore.getState().setUser(response.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-6 mb-2">
        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter neon-glow">Neural Interface</h1>
        <div className="flex-grow h-px bg-white/5" />
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Labs: v4.2</span>
        </div>
      </div>

      <div className="tech-card p-8">
        <form onSubmit={handleGenerate} className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="prompt" className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                Neural Directive [Prompt]
              </label>
              <span className="text-[10px] font-mono text-muted-foreground opacity-50 uppercase">Input: Text/Alpha</span>
            </div>
            <div className="relative group">
              <textarea
                id="prompt"
                className="w-full p-6 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all h-40 resize-none text-foreground font-medium placeholder:text-muted-foreground/30 shadow-inner"
                placeholder="A futuristic city with flying cars at sunset, cyberpunk style..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-muted-foreground pointer-events-none">
                UTF-8 // SYSIO
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-tech w-full py-4 uppercase tracking-[0.2em] text-xs"
          >
            {loading ? (
              <span className="flex items-center gap-4">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Processing Synapses...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Initiate Generation <span className="opacity-50 font-mono text-[10px]">[1_CRED]</span>
              </span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-8 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center shadow-[0_0_15px_theme(colors.red.500/10)]">
            Critical Error: {error}
          </div>
        )}

        {image && (
          <div className="mt-12 pt-12 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6">Generated Synthesis</h3>
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40">
              <img
                src={image}
                alt="Generated"
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-6 text-center">
                <div className="hud-border p-8 flex flex-col items-center gap-6">
                  <p className="text-xs font-medium text-foreground max-w-xs line-clamp-3 mb-2">{prompt}</p>
                  <button
                    onClick={() => downloadImage(image, `synthesis-${Date.now()}.png`)}
                    className="btn-primary-tech px-8 text-xs uppercase tracking-widest flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Archive Asset
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center px-2">
              <div className="flex gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-primary/30 rounded-full" />
                ))}
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Asset // ID_9942X</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
