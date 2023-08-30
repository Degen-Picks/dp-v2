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
  rewrites() {
    return {
        beforeFiles: [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'app.degenpicks.xyz',
                    },
                ],
                destination: '/classic',
            }
        ]
    }
  }
};

module.exports = nextConfig;
