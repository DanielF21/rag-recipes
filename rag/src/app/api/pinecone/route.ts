import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string
});

const index = pinecone.Index("recipes");

async function* generateResponseStream(prompt: string): AsyncGenerator<{ 
  content: string, 
  citations: Array<{ url: string, title: string }>,
  done?: boolean  // Add done to the type definition
}, void, unknown> {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: prompt,
  });

  const queryEmbedding = embeddingResponse.data[0].embedding;

  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: 10,
    includeMetadata: true
  });

  let context = "";
  const citations: Array<{ url: string, title: string }> = [];
  
  // Use all matches for context
  for (const match of queryResponse.matches) {
    if (match.metadata) {
      const relevantContent = String(match.metadata['original_text'] || 'No content available');
      context += `Content: ${relevantContent}\n\n`;
      
      // Only add first 3 matches to citations
      if (citations.length < 3) {
        const title = String(match.metadata['title'] || 'No title available');
        const url = String(match.metadata['url'] || '#');
        citations.push({ url, title });
      }
    }
  }

  const initialPrompt = `You are an AI cooking assistant developed by Daniel Fleming.
                         You are given some context and a question. Your task is to answer the question based on the context provided.
                         You may only asnwer if its about mexican food. If the user question is about anything that is not mexican food, say 'I'm sorry, I don't know anything about that.
                         Answer as concisely and as unbiased as possible. No need to have verbose details. Here is the context:\n${context}
                         If you recognize the query as a question about mexican food, answer it.
                         Finally, format your response as markdown.`;

  const systemMessage = new SystemMessage(initialPrompt);
  const humanMessage = new HumanMessage(`${prompt}`);

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: 'system', content: systemMessage.content as string },
      { role: 'user', content: humanMessage.content as string }
    ],
    stream: true,
    max_tokens: 4096,
    temperature: 0.7,
    presence_penalty: 0.1,
  });

  let accumulatedContent = '';
  try {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content || chunk.choices[0]?.finish_reason === 'stop') {
        accumulatedContent += content;
        yield { 
          content: accumulatedContent, 
          citations,
          done: chunk.choices[0]?.finish_reason === 'stop'
        };
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    // Yield the partial content we have so far
    yield {
      content: accumulatedContent + "\n\n[Error: Response was cut off]",
      citations,
      done: true
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    if (!messages || messages.length === 0) {
      console.error('No messages provided');
      return NextResponse.json({ error: 'No valid input provided' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
      console.error('Last message is invalid');
      return NextResponse.json({ error: 'No valid input provided' }, { status: 400 });
    }

    let accumulatedContent = ''; // Add this line
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const { content, citations, done } of generateResponseStream(lastMessage.content)) {
              accumulatedContent = content; // Track the content
              const responseChunk = JSON.stringify({ content, citations, done }) + '\n';
              controller.enqueue(new TextEncoder().encode(responseChunk));
              
              // Add a small delay between chunks to prevent overwhelming
              await new Promise(resolve => setTimeout(resolve, 10));
            }
          } catch (error) {
            console.error('Stream processing error:', error);
            const errorChunk = JSON.stringify({ 
              content: accumulatedContent + "\n\n[Error: Stream was interrupted]", 
              citations: [], // Initialize empty citations array for error case
              done: true 
            }) + '\n';
            controller.enqueue(new TextEncoder().encode(errorChunk));
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    );
  } catch (error) {
    console.error('Error in chat completion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
