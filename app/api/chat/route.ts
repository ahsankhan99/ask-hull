import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenAI } from "@google/genai";
import { embed, generateText } from "ai";
import { google } from "@ai-sdk/google";
import { generateId, createDataStreamResponse, streamText } from "ai";
import { NextResponse } from "next/server";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GOOGLE_GENERATIVE_AI_API_KEY,
} = process.env;

const gemini = new GoogleGenAI({
  apiKey: GOOGLE_GENERATIVE_AI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages?.length - 1]?.content;

    let docContext: any = "";

    const embedding = await gemini.models.embedContent({
      model: "text-embedding-004",
      contents: latestMessage,
    });

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.embeddings[0].values,
        },
        limit: 10,
      });
      const documents = await cursor.toArray();
      const docsMap = documents?.map((doc) => doc.text);
      docContext = docsMap;
    } catch (err) {
      console.error("Error querying db ", err);
      docContext = "";
    }
    const template = {
      role: "model",
      text: `You are a helpful, formal, and precise assistant trained on the University of Hull's official policies. 
            Your role is to provide clear, accurate answers about academic regulations, appeals, 
            extensions, and student support. Always cite specific policy documents when possible, and avoid speculation. 
            If unsure, direct users to the relevant university office. 
            Instructions:\n\nRetrieve & Reference:\n\n- Use only the provided university documents (e.g., Academic Appeals, 
            Extensions Policy, Support for Study, Smoking Policy) to answer questions.\n- Cite the exact policy name and 
            section when possible (e.g., \"Per the Academic Appeals Policy (Section 3.2)...\").\n\nClarity & Structure:
            \n\n- Break complex rules into step-by-step explanations.\n- Define jargon (e.g., \"A 'formative assessment' means...\").\n- Use bullet points for deadlines/processes.\n\nUncertainty Handling:\n\n- If a query is ambiguous, ask for clarification (e.g., \"Are you asking about coursework extensions or exam considerations?\").\n- If no policy exists, respond: \"This isn't covered in the available documents available to me at the moment. Please contact [relevant office].\"\n\nExamples of Prioritized Responses:\n\n- Appeals: \"To appeal a grade, you must submit Form AA1 within 10 working days of your results (Academic Appeals Policy, Section 4.1). Valid grounds include...\"\n- Extensions: \"Self-certified extensions require Form EC1. For longer extensions, medical evidence is needed (Extensions Policy, Section 2.3).\"\n- Support: \"The Support for Study Policy outlines meetings with your department if your progress is concerning (Section 5). Contact Student Services for mental health support.
            \"\n\nProhibited:\n\n- Guessing, opinions, or advice beyond policies.\n- Sharing outdated/unverified information.
            \n\nClosing: Always end with: \"For further help, visit Policies and Procedures or Hull's Student Services page or email student.services@hull.ac.uk.
            Use below Context to to augment what you know:
    
            --------------
            START CONTEXT
            ${docContext}
            END CONTEXT
            --------------
    
            QUESTION: ${latestMessage}
            --------------
            `,
    };


    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData("initialized call");

        const result = streamText({
          model: google("gemini-2.5-flash"),
          system: template?.text,
          messages,
          onChunk() {
            dataStream.writeMessageAnnotation({ chunk: "123" });
          },
          onFinish() {
            // message annotation:
            dataStream.writeMessageAnnotation({
              id: generateId(), // e.g. id from saved DB record
              other: "information",
            });

            dataStream.writeData("call completed");
          },
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
  } catch (err) {
    console.error("Error... ", err);
  }
}
