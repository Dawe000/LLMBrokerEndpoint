#!/bin/bash
python3 -m venv my_env # (create a virual env for ur packages)
source my_env/bin/activate
pip install transformers torch bitsandbytes 'accelerate>=0.26.0' tiktoken