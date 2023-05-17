Instructions
1. Prepare public github repo containing react application.
2. Use CLI to get suggested test definition yaml format.

Command
- OPENAI_API_KEY={openai_api_key} python yaml_gen.py -r {REPO_URL}

Result
- resulting yaml file will be saved to ./yaml folder

example repo urls
- https://github.com/mxstbr/login-flow.git