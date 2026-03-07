import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState } from 'react';

interface GoogleButtonProps {
    mode: 'signin' | 'signup';
    onError: (message: string) => void;
}

const GoogleButton = ({ mode, onError }: GoogleButtonProps) => {
    const navigate = useNavigate();
    const { googleLogin } = useAuthStore();
    const [isSyncing, setIsSyncing] = useState(false);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setIsSyncing(true);
                console.log('[Google Auth] Access Token received. Synchronizing...');

                await googleLogin({ accessToken: tokenResponse.access_token });

                const { user } = useAuthStore.getState();
                console.log('[Google Auth] Identity Linked:', user?.email);

                navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard');
            } catch (err: any) {
                console.error('[Google Auth] Sync Error:', err);
                onError(err.response?.data?.message || err.message || 'Failed to link Google identity');
            } finally {
                setIsSyncing(false);
            }
        },
        onError: (error) => {
            console.error('[Google Auth] Client Error:', error);
            onError('Google connection was interrupted. Please try again.');
        }
    });

    return (
        <motion.button
            type="button"
            onClick={() => login()}
            disabled={isSyncing}
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px hsl(190 90% 50% / 0.3)' }}
            whileTap={{ scale: 0.98 }}
            className={`
        relative w-full py-4 px-6 rounded-xl flex items-center justify-center gap-4
        bg-black/40 backdrop-blur-md border border-white/10 overflow-hidden group transition-all duration-300
        hover:border-primary/50 group-hover:bg-black/60
        ${isSyncing ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
        >
            {/* Background Pulse Effect */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* HUD Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/30 group-hover:border-primary transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/30 group-hover:border-primary transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary/30 group-hover:border-primary transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/30 group-hover:border-primary transition-colors" />

            {/* Google Icon Container */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/50 transition-all">
                {isSyncing ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#EA4335"
                            d="M12 5.04c1.9 0 3.61.65 4.96 1.91l3.72-3.72C18.42 1.18 15.43 0 12 0 7.31 0 3.25 2.69 1.25 6.64l4.17 3.24c.99-2.97 3.76-5.11 6.58-5.11z"
                        />
                        <path
                            fill="#4285F4"
                            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.3h6.44c-.28 1.48-1.11 2.74-2.37 3.58l3.68 2.87c2.15-1.99 3.39-4.91 3.39-8.48z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.42 14.88c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.25 6.64C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.36l4.17-3.24c-.11-.3-.21-.62-.31-.96l.31.72z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.68-2.87c-1.11.75-2.52 1.19-4.26 1.19-3.24 0-5.98-2.19-6.96-5.14l-4.17 3.24C3.25 21.31 7.31 24 12 24z"
                        />
                    </svg>
                )}
            </div>

            <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-bold text-primary tracking-[0.3em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                    {isSyncing ? 'Syncing...' : 'Link Neural ID'}
                </span>
                <span className="text-xs font-black text-foreground tracking-widest uppercase mt-1">
                    {mode === 'signin' ? 'Google Terminal' : 'Google Registry'}
                </span>
            </div>

            {/* Scanline overlay effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
        </motion.button>
    );
};

export default GoogleButton;
