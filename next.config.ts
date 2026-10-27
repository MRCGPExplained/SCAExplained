import type { NextConfig } from "next";

// Pages for products that are no longer sold. These are not "temporarily
// disabled" any more, which is how the £50 bundle and the £30 video course
// came to be sitting behind switched-off pages with their checkout APIs still
// live and still able to charge: the redirect only ever covered page paths.
// Those two routes and their pages are deleted now, so what is left here is
// the retired single-product programme and its old checkout flow.
const DISABLED_PAYMENT_PATHS = [
  "/checkout",
  "/confirmation",
  "/case-bank/purchase",
  "/case-bank/purchase/success",
  "/programme",
];

// Paths that moved, as opposed to the ones above that are switched off. These
// go to where the thing actually lives now, not to "/", so a bookmark or an
// indexed link still does what the person wanted.
const MOVED_PATHS = [
  // The sample report is not a recording, but it used to live at
  // /recordings/sample — so the modal that intercepts /recordings/<id> took
  // "sample" for a recording id, found no such row and 404ed the page. A
  // static route next to the intercept does not help: the modal slot renders
  // nothing and the children slot stays on the page you came from, so you
  // get the homepage under the sample's URL, which is worse. It is a
  // marketing page; it now has a marketing URL and cannot collide again.
  { source: "/recordings/sample", destination: "/sample-report" },
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
