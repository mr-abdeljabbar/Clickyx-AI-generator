import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { downloadImage } from '../utils/downloadImage';
import { Download, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
}

const History = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/generate/history');
        setImages(response.data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-6 mb-2">
        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter neon-glow">Data Archive</h1>
        <div className="flex-grow h-px bg-white/5" />
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Logs: Syncing</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-primary">SCN</div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Decrypting local logs...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="tech-card p-20 text-center flex flex-col items-center gap-6 group">
          <div className="hud-border p-10 opacity-30 group-hover:opacity-60 transition-opacity">
            <p className="text-muted-foreground text-sm font-medium">Neural Archive is currently empty.</p>
          </div>
          <Link to="/generate" className="btn-primary-tech px-10 text-xs uppercase tracking-widest">
            Initiate First Protocol
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="tech-card group flex flex-col h-full bg-black/20">
              <div className="aspect-square bg-black/40 overflow-hidden relative border-b border-white/5">
                <img
                  src={img.imageUrl}
                  alt={img.prompt}
                  className="w-full h-full object-cover transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setSelectedImage(img)}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary/20 border border-white/20 hover:border-primary/50 flex items-center justify-center text-white hover:text-primary transition-all backdrop-blur-md shadow-[0_0_15px_transparent] hover:shadow-[0_0_15px_theme(colors.primary/30)]"
                    title="Expand View"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(img.imageUrl, `synthesis-${img.id.slice(-6)}.png`);
                    }}
                    className="w-10 h-10 rounded-xl bg-primary hover:bg-white text-primary-foreground hover:text-primary border border-transparent transition-all shadow-[0_0_15px_theme(colors.primary/30)] hover:shadow-[0_0_20px_theme(colors.primary/50)] flex items-center justify-center"
                    title="Download Asset"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>

                <div className="absolute top-2 right-2 flex gap-1 pointer-events-none group-hover:opacity-0 transition-opacity">
                  <div className="px-2 py-0.5 bg-background/80 backdrop-blur-md text-[8px] font-mono font-black text-primary border border-primary/20 rounded uppercase">
                    Stored
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between cursor-pointer" onClick={() => setSelectedImage(img)}>
                <div>
                  <div className="text-[8px] font-mono text-muted-foreground mb-2 flex items-center gap-2">
                    <span className="w-1 h-3 bg-primary/40 rounded-full" />
                    ID: {img.id.slice(-8).toUpperCase()}
                  </div>
                  <p className="text-xs text-foreground font-bold line-clamp-2 leading-relaxed mb-4 group-hover:text-primary transition-colors" title={img.prompt}>{img.prompt}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground opacity-50">{new Date(img.createdAt).toLocaleDateString()}</span>
                  <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-size Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_theme(colors.primary)]" />
                  <span className="text-[10px] font-mono font-black text-primary uppercase tracking-widest">
                    Asset Details // {selectedImage.id.slice(-8)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-black border-b border-white/5">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="w-full h-auto object-contain mx-auto max-h-[60vh] md:max-h-[70vh]"
                />
              </div>

              <div className="p-6 bg-card flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-black mb-1">Neural Directive</p>
                  <p className="text-sm font-medium text-foreground">{selectedImage.prompt}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-mono">Synthesized: {new Date(selectedImage.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => downloadImage(selectedImage.imageUrl, `synthesis-${selectedImage.id.slice(-6)}.png`)}
                  className="btn-primary-tech px-8 py-3 w-full md:w-auto text-xs uppercase tracking-widest flex items-center justify-center gap-3 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download Asset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default History;
