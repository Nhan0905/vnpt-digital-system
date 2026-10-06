import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Cố định luôn chạy ở cổng 5173
    strictPort: true, // Nếu cổng 5173 bận thì báo lỗi chứ không tự đổi sang cổng khác
  }
})