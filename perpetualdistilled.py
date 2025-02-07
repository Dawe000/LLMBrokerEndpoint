import sys
import contextlib
import io
import warnings
import logging
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, pipeline
from transformers.utils import logging as transformers_logging

# Suppress all logs and warnings
transformers_logging.set_verbosity_error()
warnings.filterwarnings("ignore")
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("bitsandbytes").setLevel(logging.ERROR)

# Create a quantization configuration
quantization_config = BitsAndBytesConfig(load_in_4bit=True)

# Load the model and tokenizer once at the start
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    model = AutoModelForCausalLM.from_pretrained(
        "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
        quantization_config=quantization_config,  # Pass the quantization config here
        device_map="auto"
    )

    tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Llama-8B")

# Initialize the pipeline once
pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)
#print("ready")  # Signal that the model is ready

def get_total_input(context):
    finalstring = ""
    for x in context:
        finalstring += x["content"] + " "
    return finalstring

def generate_text(input_text, max_new_tokens):
    # Run the model
    response = pipe(input_text, max_new_tokens=max_new_tokens, truncation=True)
    generated_text = response[0]["generated_text"][1]["content"]
    input_tokens = tokenizer.encode(get_total_input(input_text), return_tensors="pt")
    num_input_tokens = input_tokens.shape[1]  # Get the length of input tokens
    output_tokens = tokenizer.encode(generated_text, return_tensors="pt")
    num_output_tokens = output_tokens.shape[1]
    response[0]["inputtokens"] = num_input_tokens
    response[0]["outputtokens"] = num_output_tokens
    return response

if __name__ == "__main__":
    while True:
        # Read input from stdin (allowing perpetual requests)
        try:
            input_text = input()
            data = json.loads(input_text)
            max_new_tokens = int(input())  # Read the number of tokens
            output = generate_text(data, max_new_tokens)
            print(json.dumps(output))  # Output response to stdout
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
