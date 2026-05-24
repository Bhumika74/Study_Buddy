// Babel config used ONLY by Jest - Vite has its own internal Babel pipeline
// and does NOT read this file (Vite ignores babel.config.jest.cjs)
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
