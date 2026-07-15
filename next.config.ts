import type { NextConfig } from "next";

// TEMPORARY: payment pages disabled. Remove this redirects block to re-enable.
const DISABLED_PAYMENT_PATHS = [
  "/checkout",
  "/confirmation",
  "/case-bank/purchase",
  "/case-bank/purchase/success",
  "/video-course/purchase",
  "/video-course/purchase/success",
  "/bundle/purchase",
  "/bundle/purchase/success",
  "/programme",
];

const nextConfig: NextConfig = {
  async redirects() {
    return DISABLED_PAYMENT_PATHS.map((source) => ({
      source,
      destination: "/",
      permanent: false,
    }));
  },
};

export default nextConfig;
