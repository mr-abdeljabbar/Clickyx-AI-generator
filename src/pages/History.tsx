import { useEffect, useState } from 'react';
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
    <>
      <h1 className="text-3xl font-bold mb-8 text-slate-900">History</h1>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-lg">No images generated yet.</p>
          <a href="/generate" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium">
            Start generating &rarr;
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-slate-100 overflow-hidden relative">
                <img 
                  src={img.imageUrl} 
                  alt={img.prompt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-700 font-medium truncate" title={img.prompt}>{img.prompt}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(img.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default History;
