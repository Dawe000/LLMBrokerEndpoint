import tiktoken
import json

def get_total_input(context):
    finalstring = ""
    for x in context:
        finalstring += x["content"] + " "
    return finalstring

input_text = input("")
data = json.loads(input_text)

enc = tiktoken.get_encoding("o200k_base")
assert enc.decode(enc.encode("hello world")) == "hello world"

enc = tiktoken.encoding_for_model("gpt-4o")

print(len(enc.encode(get_total_input(data))))