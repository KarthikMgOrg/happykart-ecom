// export default async function signupHandler(payload) {

//     let data = {"data":"", "error":false, "success":true}
//     try {
//         let headers = {
//             "Content-Type":"application/json"
//         }

//         const res = await axios.post(`${import.meta.env.VITE_API_CUSTOMERS}/signup`, payload, {
//             headers:headers
//         })

//         data.data = await res.data
//     } catch (error) {
//         data.error = error.response.data.message
//         data.success = false
//     }
//     return data
// }

export default async function signupHandler(payload) {
  const signupResp = { data: {}, error: false, success: true };
  try {
    await fetch(`${import.meta.env.VITE_API_CUSTOMERS}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => {
        if (!resp.ok) {
          signupResp.success = false;
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        // if (data.status === "Failure") {
        //     signupResp.success = false
        // }
        // if ()
        signupResp.data = data.data;
        signupResp.error = data.error;
      })
      .catch((err) => {
        signupResp.error = err;
        signupResp.success = false;
      });
  } catch (error) {
    console.log("Catching error");
    signupResp.error = error;
    signupResp.success = false;
  }
  return signupResp;
}
