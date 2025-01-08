export async function loginApi(formData: FormData) {
  const url = "http://127.0.0.1:8000/api/login";

  try {
    const response = await fetch(url, {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    return await response.status;
  } catch (err) {
    return `Fetch of loginUser failed ${err}`;
  }
}
