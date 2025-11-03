/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'localhost',
            'supabase.co',
            'tdhyvpszhphimkjbglfx.supabase.co'  // Tu dominio específico de Supabase
        ],
    },
}

module.exports = nextConfig