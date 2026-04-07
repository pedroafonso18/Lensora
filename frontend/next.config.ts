import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Clerk requires access to its own domains for auth flows.
    // Stripe.js is loaded from js.stripe.com for the checkout redirect.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Clerk + Stripe
      "script-src 'self' 'unsafe-inline' https://clerk.accounts.dev https://*.clerk.accounts.dev https://js.stripe.com",
      // Styles: self + inline (Tailwind and Clerk components generate inline styles)
      "style-src 'self' 'unsafe-inline'",
      // Images: self + data URIs (Clerk avatars)
      "img-src 'self' data: https://*.clerk.com https://*.gravatar.com",
      // Fonts: self
      "font-src 'self'",
      // Connections: self + Clerk API + Stripe
      "connect-src 'self' https://*.clerk.accounts.dev https://clerk.accounts.dev https://api.stripe.com",
      // Frames: Clerk and Stripe use iframes for auth/payment flows
      "frame-src https://clerk.accounts.dev https://*.clerk.accounts.dev https://js.stripe.com https://hooks.stripe.com",
      // Workers: none
      "worker-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
