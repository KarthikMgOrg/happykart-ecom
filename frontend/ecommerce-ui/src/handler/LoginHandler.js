export async function HandleLogin(payload) {
  const signinResp = { data: {}, error: false, success: true };
  try {
    await fetch(`${import.meta.env.VITE_API_CUSTOMERS}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => {
        if (!resp.ok) {
          signinResp.success = false;
          signinResp.error = true;
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data, " is the data after login");
        signinResp.data = data;
        signinResp.error = data.error;
      })
      .catch((err) => {
        signinResp.error = err;
        signinResp.success = false;
      });
  } catch (error) {
    signinResp.error = error;
    signinResp.success = false;
  }

  return signinResp;
}
