import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenAI } from "@google/genai";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GOOGLE_API_KEY,
} = process.env;

const gemini = new GoogleGenAI({
  apiKey: GOOGLE_API_KEY,
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
      parts: [
        {
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
        },
      ],
    };

    const response = await gemini.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [template, ...messages],
    });

    const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            controller.enqueue(new TextEncoder().encode(chunk.text));
          }
          controller.close();
        },
      });
  
      console.log({stream})
      return new Response(stream, {
        headers: { "Content-Type": "text/plain" },
      });
  } catch (err) {
    console.error("Error... ", err);
  }
}
