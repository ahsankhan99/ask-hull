import dotenv from "dotenv";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GOOGLE_API_KEY,
} = process.env;

type SimilarityMetric = "cosine" | "euclidean" | "dot_product";

const gemini = new GoogleGenAI({
  apiKey: GOOGLE_API_KEY,
});

const hullRegulationsAndPolicies = [
  "https://www.hull.ac.uk/choose-hull/university-and-region/key-documents/docs/academic-appeals.pdf",
  "https://www.hull.ac.uk/choose-hull/university-and-region/key-documents/docs/extensions-and-additional-consideration.pdf",
  "https://www.hull.ac.uk/choose-hull/university-and-region/key-documents/docs/support-for-study-policy-and-procedure.pdf",
  "https://www.hull.ac.uk/choose-hull/university-and-region/key-documents/docs/smoking-policy.pdf",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 768,
      metric: similarityMetric,
    },
  });
  return res;
};

async function loadPDFFromWeb() {
  try {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    for await (const url of hullRegulationsAndPolicies) {
      const response = await fetch(url);
      const blob = await response.blob();
      const loader = new WebPDFLoader(blob);
      const docs = await loader.load();

      for await (const doc of docs) {
        const chunks = await splitter.splitText(doc.pageContent);

        for (const chunk of chunks) {
          const response = await gemini.models.embedContent({
            model: "text-embedding-004",
            contents: chunk,
          });

          const embedding = response?.embeddings[0].values;

          // Insert into Astra DB
          await collection.insertOne({
            text: chunk,
            $vector: embedding,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error loading PDF:", error);
  }
}

createCollection().then(() => loadPDFFromWeb());
