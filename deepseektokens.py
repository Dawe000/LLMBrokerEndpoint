from transformers import AutoTokenizer
import json

def get_total_input(context):
    finalstring = ""
    for x in context:
        finalstring += x["content"] + " "
    return finalstring

input_text = input("")
data = json.loads(input_text)
tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Llama-8B")
input_tokens = tokenizer.encode(get_total_input(data), return_tensors="pt")
num_input_tokens = input_tokens.shape[1]  # Get the length of input tokens
print(num_input_tokens)