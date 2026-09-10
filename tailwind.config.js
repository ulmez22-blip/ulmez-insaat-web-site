/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#121A2E',
        // secondary dark navy — one shade lighter than charcoal, used to give
        // alternating dark sections a bit of depth instead of one flat block
        navy: '#1A2338',
        navylight: '#232D48',
        brick: '#C9A227',
        brickdark: '#9C7D1D',
        sand: '#EDE7D9',
        paper: '#FAF8F4',
        steel: '#57647A',
        ochre: '#D9B65B',
        // darker gold, used for text/links directly on light backgrounds
        // (brick/ochre don't hit 4.5:1 against white — this does, ~5:1)
        goldtext: '#8A6A16',
        goldtextdark: '#6B5211',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};
