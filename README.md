Instructions

1. Prepare public github repo containing react application.
2. Use CLI to get suggested test definition yaml format.

Command

[summary-gen - generated/{repo_name}/file_summary/*.yaml generate]

- OPENAI_API_KEY={openai_api_key} python yaml_gen.py -r {REPO_URL} -m summary-gen

[test-scenario-gen - generated/{repo_name}/test-scenario.txt generate]

- OPENAI_API_KEY={openai_api_key} python yaml_gen.py -r {REPO_URL} -m test-scenario-gen

[test-gen - generated/{repo_name}/test_code/*.js generate]

- OPENAI_API_KEY={openai_api_key} python yaml_gen.py -r {REPO_URL} -m test-gen

Result

- resulting yaml file will be saved to ./yaml folder

example repo urls

- https://github.com/mxstbr/login-flow.git
