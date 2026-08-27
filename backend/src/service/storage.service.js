/*const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(contents) {
  const response = await ai.models.generateContent({
    model: "",
    contents: contents,
    config: {
      temperature: 0.7,
      systemInstruction: ``,
    },
  });
  return response.text;
}

async function generateVector(contents) {
  const ai = await ai.models.embedContent({
    model: "",
    contents: contents,
    config: {
      outputDimensionality: 768,
    },
  });
  return response.embeddings[0].values;
}

module.exports = { generateResponse, generateVector };
*/

/*
const Pinecone = require("@pinecone-database/pinecone");

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatgptIndex = pc.Index("");

async function createMemory(vectors, messageID, metaData) {
  await chatgptIndex.upsert({
    id: messageID,
    values: vectors,
    metaData,
  });
}

async function queryMemory(queryVectors, limit = 5, metadata) {
  const data = await chatgptIndex.query({
    vector: queryVectors,
    topK: limit,
    filter: metadata ? { metadata } : undefined,
    includeMetadata: true,
  });
  return data.matches;
}

*/

const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage({ buffer, fileName, folder }) {
  try {
    console.log("Uploading image to ImageKit...");
    console.log("File size:", buffer.length);
    console.log("File name:", fileName);

    const result = await imagekit.upload({
      file: buffer,
      fileName,
      folder,
    });

    console.log("ImageKit upload successful:");
    console.log(result.url);

    return result.url;
  } catch (error) {
    console.error("ImageKit Upload Error:", error);

    throw error;
  }
}

module.exports = {
  uploadImage,
};
