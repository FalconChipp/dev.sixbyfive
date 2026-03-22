/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  env: {
    NEXT_PUBLIC_IMAGE_INTAKE_URL: "https://tcgdex-upload.sixbyfive.com",
    NEXT_PUBLIC_IMAGE_INTAKE_KEY: "d04885aef971b7d29abb6ca8559284b5d0f3769ed9eea6b24b0707e85f37b0a2",
  },
};

export default nextConfig;
