export const downloadImage = async (url: string, filename: string = 'neural-synthesis.png') => {
    try {
        // We use our backend proxy to bypass CORS restrictions from R2 storage
        const encodedUrl = encodeURIComponent(url);
        const proxyUrl = `/api/generate/download?url=${encodedUrl}`;

        // Creating an invisible anchor to trigger the download directly from the API endpoint
        const link = document.createElement('a');
        link.href = proxyUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
    } catch (error) {
        console.error('Failed to download image:', error);
        // Fallback: try to open in a new tab
        window.open(url, '_blank');
    }
};
