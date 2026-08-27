/*const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });


const cohortChatGptIndex = pc.Index("cohort-ai");

async function createMemory({ vectors, metadata, messageId }) {
  await cohortChatGptIndex.upsert([
    {
      id: messageId,
      values: vectors,
      metadata,
    },
  ]);

  
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  const data = await cohortChatGptIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata ? { metadata } : undefined,
    includeMetadata: true,
  });

  return data.matches;
}






module.exports = { createMemory, queryMemory };

*/

const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const cohortChatGptIndex = pc.Index("cohort-ai");

// =========================================================
// CREATE MEMORY
// =========================================================

async function createMemory({
  vectors,
  metadata = {},
  messageId,
  namespace = "text-memory",
}) {
  if (!vectors || !vectors.length) {
    throw new Error("Vector is required");
  }

  if (!messageId) {
    throw new Error("Message ID is required");
  }

  await cohortChatGptIndex.namespace(namespace).upsert([
    {
      id: messageId,
      values: vectors,
      metadata,
    },
  ]);
}

// =========================================================
// QUERY MEMORY
// =========================================================

async function queryMemory({
  queryVector,
  limit = 5,
  metadata,
  namespace = "text-memory",
}) {
  if (!queryVector || !queryVector.length) {
    throw new Error("Query vector is required");
  }

  const data = await cohortChatGptIndex.namespace(namespace).query({
    vector: queryVector,
    topK: limit,
    filter: metadata || undefined,
    includeMetadata: true,
  });

  return data.matches;
}

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  createMemory,
  queryMemory,
};



//console.log("messageId:", messageId);
//console.log("vector length:", vectors.length);
//console.log("metadata:", metadata);

/*await cohortChatGptIndex.upsert({
    vectors: [
      {
        id: messageId,
        values: vectors,
        metadata,
      },
    ],
  });*/
