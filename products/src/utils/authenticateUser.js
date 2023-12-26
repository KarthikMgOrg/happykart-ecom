import rabbitMQClient from "../rpc/client.js"

export async function authenticateUser(payload) {
    let authUser = await rabbitMQClient.produce(payload)
    // console.log(authUser, " is the rpc authenticated user");
    return authUser
}

// export function authenticateUser(payload) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let authUser = await rabbitMQClient.produce(payload);
//             console.log(authUser, " is the rpc authenticated user");
//             resolve(authUser);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }