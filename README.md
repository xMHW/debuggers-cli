# Automatic Test Code Generation CLI

This CLI tool is designed to assist in generating test scenarios and test codes for a React application. It uses OpenAI's language model to generate test-related content based on provided inputs and the repository's source code.

## Prerequisites

Before using this tool, make sure you have the following:

- A public GitHub repository containing the React application.
- An OpenAI API key.
- Python 3.6 or above installed.

## Setup

1. Clone this repository to your local machine.
2. Install the required Python packages by running the following command in the project directory:

   ```
   pip install -r requirements.txt
   ```

3. Rename the `.env.example` file to `.env` and update the following values:

   ```
   OPENAI_API_KEY=[YOUR OPENAI API KEY]
   GIT_REPOSITORY=[GIT REPOSITORY URL]
   TEST_SCENARIO_COUNT=[NUMBER OF TEST SCENARIOS TO GENERATE]
   ```

   Replace the placeholders with your OpenAI API key, the URL of the GitHub repository, and the desired number of test scenarios to generate.

## Usage

The CLI tool provides the following commands:

### 1. Generate File Summary YAML

This command generates YAML files that summarize and explain each file in the React application.

Command:

```
python yaml_gen.py -m summary-gen
```

This command analyzes the source code files in the specified GitHub repository and generates a YAML file for each file. The YAML file contains important information about the file.

**Note:** Make sure to run this command before running the `test-scenario-gen` and `test-gen` commands.

### 2. Generate Test Scenarios

This command generates test scenarios based on the file summaries generated in the previous step.

Command:

```
python yaml_gen.py -m test-scenario-gen
```

This command generates 30 test scenarios based on the file summaries. It then selects a specified number of important test scenarios related to users from the Project Manager's perspective.

### 3. Generate Test Codes

This command generates test codes for the specified number of test scenarios.

Command:

```
python yaml_gen.py -m test-gen
```

This command uses the generated test scenarios and generates professional and detailed end-to-end (E2E) test codes in JavaScript using Node.js and Jest.

## Example Repository

To test the CLI tool, you can use the following example repository:

- Repository URL: [https://github.com/mxstbr/login-flow.git](https://github.com/mxstbr/login-flow.git)

Make sure to update the `GIT_REPOSITORY` value in the `.env` file with the desired repository URL.

## Alternate Idea: HTML Summarizer

html_yaml.py is an alternate idea that we introduced in midterm, but we did not actually use, so it remains as an alternate idea. The way it works is by summarizing html page and collecting all the interative objects. NOTE: It is made based on yaml_gen.py, and not part of the main implementation.

## Usage

1. Name the website and provide link
```
WEB_NAME = "python_tutorial"
WEB_LINK = "https://www.w3schools.com/python/python_file_write.asp"
```

2. Create summary of html page
```
python html_yaml.py -m summary-gen
```

3. Fetch all interactive elements.
By using the previous summary:
```
python html_yaml.py -m fetch-sect
```
Without using the previous summary:
```
python html_yaml.py -m fetch-elems
```

4. Generate test scenario
```
python html_yaml.py -m test-scenario-gen
```

5. Generate test cases
```
python html_yaml.py -m test-gen
```

## Important Notes

- Make sure to run the commands in the specified order (`summary-gen` -> `test-scenario-gen` -> `test-gen`).
- The generated files will be stored in the `generated` directory within the project.
- You can customize the behavior of the language model by modifying the code in the `yaml_gen.py` file.

Feel free to reach out if you have any questions or encounter any issues.
