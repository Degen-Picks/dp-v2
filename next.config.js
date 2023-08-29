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
                destination: '/classic/:path*',
            },
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'app.degen-picks-git-development-degenpicks.vercel.app',
                    },
                ],
                destination: '/classic/:path*',
            },
        ]
    }
  }
};

module.exports = nextConfig;
