// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 非推奨の色名を削除し、新しい名前に置き換え
        slate: colors.slate,
        gray: colors.gray,
        neutral: colors.neutral,
        stone: colors.stone,
        sky: colors.sky,
        
        // カスタムカラー
        primary: '#2b6cb0',
        secondary: '#38b2ac',
        background: '#f8f8f8',
        text: '#333333',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};