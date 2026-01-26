import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Tambahkan ini
      },
      // Tambahkan domain lain jika nanti ada (misal dari server sendiri atau google)
      // {
      //   protocol: "https",
      //   hostname: "res.cloudinary.com",
      // },
    ],
  },
};

export default nextConfig;
