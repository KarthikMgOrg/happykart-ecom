import rabbitMQClient from "../rpc/client.js"

export async function authenticateUser(payload) {
    let authUser = await rabbitMQClient.produce(payload)
    // console.log(authUser, " is the rpc authenticated user");
    return authUser
}