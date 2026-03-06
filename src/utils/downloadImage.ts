export const downloadImage = async (url: string, filename: string = 'neural-synthesis.png') => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);

        // Create an invisible anchor to trigger the download
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
        console.error('Failed to download image:', error);
        // Fallback: try to open in a new tab if blob fetch fails (e.g., hard CORS)
        window.open(url, '_blank');
    }
};
