async function getData() {
  try {
    await fetch(`${import.meta.env.VITE_API_SHOPPING}/getOrders`, {
      method: "GET",
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzYwNGU2YjkyNWZiMmEzNmQzYmM1YSIsImlhdCI6MTcwMjMwNTg5OCwiZXhwIjoxNzAyNTY1MDk4fQ.aFqOWG9ABqXa6lLaHKZSjLMxTaDepINa_Ss3vkIbCHA",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
}

await getData();
