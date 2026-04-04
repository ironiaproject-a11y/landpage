/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        deviceSizes: [390, 640, 768, 1024, 1280, 1920],
        imageSizes: [32, 64, 128, 256, 384, 512],
        dangerouslyAllowSVG: false,
    },
    // Compress responses
    compress: true,
};

module.exports = nextConfig;

