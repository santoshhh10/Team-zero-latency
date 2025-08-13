/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				brand: {
					red: '#E53935',
					green: '#2E7D32'
				}
			}
		}
	},
	plugins: []
};