import { useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

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
      checkAuth(); // Update credits
    } catch (err: any) {
      setError(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Generate Image</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-2">
              Prompt
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-32 resize-none text-slate-900 placeholder:text-slate-400"
                placeholder="A futuristic city with flying cars at sunset, cyberpunk style..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Be descriptive for better results.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : 'Generate Image (1 Credit)'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {image && (
          <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in duration-500">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">Result</h3>
            <div className="relative group rounded-xl overflow-hidden shadow-lg bg-slate-100">
              <img 
                src={image} 
                alt="Generated" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a
                  href={image}
                  download="generated-image.png"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download High Res
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
