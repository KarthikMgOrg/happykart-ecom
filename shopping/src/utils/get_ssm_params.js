import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { config } from "./config.js";
const region = "us-east-1"; // Replace with your region

const ssmClient = new SSMClient(config.aws.config);

export async function getParameterValue(keyName) {
  const command = new GetParameterCommand({
    Name: keyName,
  });

  try {
    const response = await ssmClient.send(command);
    return response.Parameter.Value;
  } catch (error) {
    console.error(error);
  }
}

// console.log(await getParameterValue("/javascript/mini_projects/11_moving_to_microservice_with_message_broker/customer/mongo_uri"));
