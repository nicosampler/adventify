import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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", //process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateImage(country: string, city: string) {
  const response = await openai.createImage({
    prompt: `an image in caricature that represents the city of ${city} with the flag of ${country}`,
    n: 1,
    size: "256x256",
  });
  console.log({ imageUrl: response.data.data[0].url });

  return response.status == 200 ? response.data.data[0].url : null;
}
