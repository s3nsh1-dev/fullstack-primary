import { useMutation } from "@tanstack/react-query";

const useUploadMyVideo = () => {
  return useMutation({
    mutationKey: ["uploadMyVideo"],
    mutationFn: async (formData: VideoFormData | FormData) => {
      // If caller passed a plain object, convert to FormData
      let payload: FormData;
      if (formData instanceof FormData) {
        payload = formData;
      } else {
        payload = new FormData();
        // append files if present
        if (formData.videoFile) payload.append("videoFile", formData.videoFile);
        if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);
        // append text fields
        if (formData.title) payload.append("title", formData.title);
        if (formData.description)
          payload.append("description", formData.description);
      }

      const response = await fetch(`${URL}/videos`, {
        credentials: "include",
        method: "POST",
        // DO NOT set Content-Type; browser will set the multipart boundary
        body: payload,
      });
      if (!response.ok) throw new Error("ERROR WHILE UPLOADING VIDEO");
      const data = await response.json();
      return data;
    },
  });
};

export default useUploadMyVideo;

interface VideoFormData {
  videoFile: File | null;
  thumbnail: File | null;
  title: string;
  description: string;
  // visibility and tags removed — backend does not use them
}

const URL = import.meta.env.VITE_SERVER_URL;
