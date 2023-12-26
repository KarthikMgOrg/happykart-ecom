// import AWS from "aws-sdk"

// import { SSM } from "@aws-sdk/client-ssm";

// const ACCESS_KEY = "AKIAWHJFJLKC7BVF5D67"
// const SECRET_ACCESS_KEY = "B5Mb / qdP68TZvuVmD1SYSKmVmsDIXYMajYOgX / ON"
// const REGION = "us-east-1"

// // JS SDK v3 does not support global configuration.
// // Codemod has attempted to pass values to each service client in this file.
// // You may need to update clients outside of this file, if they use global config.
// AWS.config.update({
//     accessKeyId: ACCESS_KEY,
//     secretAccessKey: SECRET_ACCESS_KEY,
//     region: REGION
// });

// // Create an SSM instance
// const ssm = new SSM({
//     credentials: {
//         accessKeyId: ACCESS_KEY,
//         secretAccessKey: SECRET_ACCESS_KEY,
//     },

//     region: REGION
// });

// // Specify the parameter name
// // const parameterName = '/javascript/mini_projects/11_moving_to_microservice_with_message_broker/customer/mongo_uri';
// let parameterName = '/javascript/value'

// // Fetch the parameter value
// ssm.getParameter({ Name: parameterName })
//     .then((result) => {
//         const mongoUri = result.Parameter.Value;
//         console.log('MongoDB URI:', mongoUri);
//     })
//     .catch((error) => {
//         console.error('Error fetching parameter:', error);
//     });

// bard

import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
const region = "us-east-1"; // Replace with your region
const keyName =
  "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/rabbitmq_uri"; // Replace with the key name you want to fetch

const client = new SSMClient({ region });

const command = new GetParameterCommand({
  Name: keyName,
});

(async () => {
  try {
    const response = await client.send(command);
    const parameterValue = response.Parameter.Value;
    console.log(`Parameter value: ${parameterValue}`);
  } catch (error) {
    console.error(error);
  }
})();
