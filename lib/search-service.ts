import axios from "axios";

export async function searchSelfie(file: Blob) {
  const form = new FormData();

  form.append(
    "file",

    file,

    "selfie.jpg",
  );

  const { data } = await axios.post(
    process.env.PYTHON_API + "/search",

    form,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.embedding;
}
