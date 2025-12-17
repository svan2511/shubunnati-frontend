export async function uploadToCloudinary(file) {
  const CLOUD_NAME = "du33cvn3j"; // from your dashboard
  const UPLOAD_PRESET = "members_unsigned"; // EXACT name from screenshot

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Cloudinary error:", data);
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  };
}
