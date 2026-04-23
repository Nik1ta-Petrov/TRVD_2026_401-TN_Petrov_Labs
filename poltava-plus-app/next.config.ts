import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Додаємо цей блок, щоб вимкнути помилку конфлікту
  // @ts-ignore - іноді типи ще не знають про це поле в бета-версіях
  turbopack: {}, 

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
