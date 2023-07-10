/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.imgur.com",
      "pbs.twimg.com",
      "cdn.freebiesupply.com",
      "shdw-drive.genesysgo.net",
    ],
  },
};

module.exports = nextConfig;
