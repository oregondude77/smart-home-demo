/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  // Stop `next dev` from writing AGENTS.md, which tells agents to read the
  // 4.4 MB bundled Next.js docs before any change. Project notes live in CLAUDE.md.
  agentRules: false,
};

export default nextConfig;