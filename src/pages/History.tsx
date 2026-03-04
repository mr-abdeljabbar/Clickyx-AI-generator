import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
}

const History = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);

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
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="px-2 py-0.5 bg-background/80 backdrop-blur-md text-[8px] font-mono font-black text-primary border border-primary/20 rounded uppercase">
                    Stored
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
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
    </div>
  );
};

export default History;
