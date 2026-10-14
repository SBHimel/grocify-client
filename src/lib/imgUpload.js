export const imageUpload = async (image) => {
  const formData = new FormData();
  formData.append("image", image);


  console.log(formData);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await res.json()

  return data.data;
};
