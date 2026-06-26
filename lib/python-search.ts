import axios from "axios";

export async function generateEmbedding(file: File) {
  const form = new FormData();

  form.append("file", file);

  const { data } = await axios.post(
    `${process.env.PYTHON_API}/search`,
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (!data.embedding) {
    throw new Error("No face detected.");
  }

  return data.embedding as number[];
}