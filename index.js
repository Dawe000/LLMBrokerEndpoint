import express from 'express';
import { spawn, execSync } from 'child_process';
import { OpenAI } from 'openai';
import { UserApi } from 'llmbrokerapilib';
import dotenv from 'dotenv';
import { client } from './client.js';
import { createWallet, privateKeyToAccount } from "thirdweb/wallets";
const port = 8080;

dotenv.config();
const app = express();
const wallet = createWallet("local");
const account = await privateKeyToAccount({
    client,
    privateKey: process.env.PRIVATE_KEY
});

const address = process.env.SERVER_CONTRACT_ADDRESS;

let api = new UserApi(client,account,process.env.BROKER_CONTRACT_ADDRESS);

// Add this near the top of your file, after the imports
const activeRequests = new Map();

// Middleware to parse JSON request bodies
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// POST /deepseek route
app.post('/deepseek', async (req, res) => {
  let usertokensremaining = 1000;
  const { context, num, publicKey, signature, address} = req.body;

  // Check if this public key already has an active request
  if (activeRequests.has(publicKey)) {
    res.status(429).send('Too Many Requests: An inference is already in progress for this public key');
    return;
  }

  // Set lock for this public key
  activeRequests.set(publicKey, true);

  try {
    // Your existing validation checks
    if (deepseektokens(context)+num > usertokensremaining){
      res.status(400).send('Bad Request: Not enough tokens');
      activeRequests.delete(publicKey);
      return;
    }
    if (!api.verify(publicKey, signature, context)){
      res.status(400).send('Bad Request: Invalid Signature');
      activeRequests.delete(publicKey);
      return;
    }
    if (api.GetClientAgreement(address,publicKey) === null){
      res.status(400).send('Bad Request: No agreement');
      activeRequests.delete(publicKey);
      return;
    }
    
    if (typeof num === 'number' && isValidContext(context)) {
      if (process.env.LOCALMODE === 'Hugging Face') {
        runPython(JSON.stringify(context, null), num, async (out) => {
          try {
            const data = JSON.parse(out);
            let agreement = await api.GetClientAgreement(address,address);
            await api.NotifyResponse(agreement, data[0].inputtokens,data[0].outputtokens);
            res.send(data[0]);
          } finally {
            // Release the lock
            activeRequests.delete(publicKey);
          }
        });
      } else if (process.env.LOCALMODE === 'Ollama') {
        try {
          const response = await ollama.chat({
            model: 'deepseek-r1:14b',
            messages: context,
            keep_alive: '10m',
            num_predict: num
          });
          res.send(response);
        } finally {
          // Release the lock
          activeRequests.delete(publicKey);
        }
      }
    } else {
      res.status(400).send('Bad Request: Expected a context object and a number');
    }
  } catch (error) {
    // If any error occurs, make sure to release the lock
    activeRequests.delete(publicKey);
    res.status(500).send('Internal Server Error');
  }
});

// POST /deepseek/tokens route
app.post('/deepseek/tokens', (req, res) => {
  const { context } = req.body;
  if (isValidContext(context)) {
    return deepseektokens(context);
  } else {
    res.status(400).send('Bad Request: Expected a context object');
  }
});

function deepseektokens(context){
  const pythonProcess = spawn("python3", ["deepseektokens.py"]);
  pythonProcess.stdin.write(JSON.stringify(context) + "\n");
  pythonProcess.stdin.end();                // End input stream

  pythonProcess.stdout.on("data", (output) => {
    try {
      const pythonProcess = spawn("python3", ["deepseektokens.py"]);
      pythonProcess.stdin.write(JSON.stringify(context) + "\n");
      pythonProcess.stdin.end();                // End input stream

      pythonProcess.stdout.on("data", (output) => {
        console.log(`Token count: ${output}`);
        res.send({ "tokens": parseInt(output, 10) });
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });
}

// POST /chatgpt/tokens route
app.post('/chatgpt/tokens', (req, res) => {
  const { context } = req.body;
  if (isValidContext(context)) {
    try {
      const pythonProcess = spawn("python3", ["chatgpttokens.py"]);
      pythonProcess.stdin.write(JSON.stringify(context) + "\n");
      pythonProcess.stdin.end();                // End input stream

      pythonProcess.stdout.on("data", (output) => {
        console.log(`Token count: ${output}`);
        res.send({ "tokens": parseInt(output, 10) });
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }

  } else {
    res.status(400).send('Bad Request: Expected a context object');
  }
});

function isValidContext(context) {
  // Check if `context` is an array
  if (!Array.isArray(context)) return false;
  // Validate each item in the array
  for (const item of context) {
    // Check if item is an object with `role` and `content` properties
    if (
      typeof item !== 'object' ||
      item === null ||
      !('role' in item) ||
      !('content' in item) ||
      typeof item.role !== 'string' ||
      typeof item.content !== 'string'
    ) {
      return false;
    }
  }

  return true;
}

let pythonProcess;

// If the Python process isn't running, start it
if (!pythonProcess) {
  pythonProcess = spawn('python3', ['perpetualdistilled.py']);

  // Handle errors
  pythonProcess.on('error', (err) => {
    console.log(`Python process failed: ${err}`);
    callback(`error: ${err}`);
  });

  // Capture any errors from the Python process
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Capture output from the Python process
  pythonProcess.stdout.on('data', (data) => {

  });
}

function runPython(str, num, callback) {
  // If the Python process isn't running, start it
  if (!pythonProcess) {
    pythonProcess = spawn('python3', ['perpetualdistilled.py']);

    // Handle errors
    pythonProcess.on('error', (err) => {
      console.log(`Python process failed: ${err}`);
      callback(`error: ${err}`);
    });

    // Capture any errors from the Python process
    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    // Capture output from the Python process
    pythonProcess.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
  }

  // Send the input to the Python process
  pythonProcess.stdin.write(`${str}\n`);
  pythonProcess.stdin.write(`${num}\n`);

  // Capture the output from Python and return it
  pythonProcess.stdout.once('data', (output) => {
    callback(output.toString());
  });
}

app.post('/chatgpt', async (req, res) => {
  const { context, num } = req.body;

  if (typeof num === 'number' && isValidContext(context)) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: context,
        response_format: {
          "type": "text"
        },
        temperature: 1,
        max_completion_tokens: num,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });
      const inputTokens = response.usage.prompt_tokens;
      const outputTokens = response.usage.completion_tokens;
      let outputMessage = context;
      outputMessage.push(response.choices[0].message);
      const output = {
        generated_text: outputMessage,
        inputtokens: inputTokens,
        outputtokens: outputTokens
      };
      res.status(200).send(
        output,
      );
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while processing your request.');
    }
  } else {
    res.status(400).send('Bad Request: Expected a context object and a number');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
