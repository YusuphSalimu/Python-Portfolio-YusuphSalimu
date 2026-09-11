import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

process.env.ROLLUP_WASM = 'true'
import '@rollup/wasm-node'

export default defineConfig({
  plugins: [react()],
})
