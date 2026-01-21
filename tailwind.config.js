/** @type {import('tailwindcss').Config} */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        app: {
          primary: '#7D6FB1',     // Deep Purple - Màu chính thương hiệu
          secondary: '#A696C8',   // Light Purple - Màu phụ/Gradient
          accent: '#C5A059',      // Gold - Màu điểm nhấn (Points/Stars)
          bg: '#F4F7F9',          // Light Slate - Nền ứng dụng
          text: '#2D3436',        // Dark Grey - Chữ chính
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3.5rem',
      },
      spacing: {
        'safe-top': 'var(--sat)',
        'safe-bottom': 'var(--sab)',
      },
      animation: {
        'slide-up': 'slideUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards',
        'slide-up-modal': 'slideUpModal 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'shake': 'shake 0.3s ease-in-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUpModal: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        }
      }
    }
  },
  plugins: [],
}