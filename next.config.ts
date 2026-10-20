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

// Paths that moved, as opposed to the ones above that are switched off. These
// go to where the thing actually lives now, not to "/", so a bookmark or an
// indexed link still does what the person wanted.
const MOVED_PATHS = [
  // The case bank had its own registration form posting three fields at an
  // action that needs five, so every submission failed. There is one form now.
  { source: "/case-bank/register", destination: "/register" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...DISABLED_PAYMENT_PATHS.map((source) => ({
        source,
        destination: "/",
        permanent: false,
      })),
      ...MOVED_PATHS.map(({ source, destination }) => ({
        source,
        destination,
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
