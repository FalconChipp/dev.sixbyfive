// app/tools/image-intake/page.js

import ImageIntakeClient from "./ImageIntakeClient";

export const metadata = {
  title: "Card Image Intake • SixByFive Tools",
  description:
    "Upload a zip of card images for a set. Files are validated, renamed to canonical format, and uploaded to Google Drive.",
};

export default function ImageIntakePage() {
  return <ImageIntakeClient />;
}