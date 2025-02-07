import sys
import contextlib
import io
import warnings
import logging
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, pipeline
from transformers.utils import logging as transformers_logging

# Suppress all logs and warnings

def generate_text(input_text, max_new_tokens):
    # Create a quantization configuration
    quantization_config = BitsAndBytesConfig(load_in_4bit=True)

    
    
        # Load the model with the quantization configuration
    model = AutoModelForCausalLM.from_pretrained(
        "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
        quantization_config=quantization_config,  # Pass the quantization config here
        device_map="auto"
    )

    tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Llama-8B")

    # Initialize the pipeline
    pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)

    # Run the model
    response = pipe(input_text, max_new_tokens=max_new_tokens, truncation=True)
    return response

if __name__ == "__main__":

    i =  [
			{
				"role": "user",
				"content": "Test"
			}
		]
    max_new_tokens = 100
    # Print only the generated text
    print(generate_text(i, max_new_tokens))