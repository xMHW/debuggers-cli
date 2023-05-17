import os, argparse, random

from langchain.document_loaders import GitLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

def create_suggested_yaml(repo_url):
    repo_name = repo_url.split('/')[-1].split('.')[0]
    repo_path = f"./example_repo/{repo_name}"
    supported_extensions = (".js", ".ts", ".tsx")
    if os.path.exists(repo_path):
        loader = GitLoader(repo_path=repo_path, branch="master", 
                        file_filter=lambda file_path: file_path.endswith(supported_extensions))
    else:
        loader = GitLoader(clone_url=repo_url, 
                        repo_path=repo_path, branch="master",
                        file_filter=lambda file_path: file_path.endswith(supported_extensions))

    prompt_template = """You are a Software Engineer who writes test codes. 
    Use the following pieces of context to do actions at the end.
    {context}

    Action: {question}
    """

    query = """
    Recommend the test cases.
    Create a definition file of tests in yaml format.
    And example of the yaml format file is following

    version: 0.1.0
    description: Test main page with login and check token & redirect

    describe:
    name: test main page with login and check token & redirect
    tests:
        - it:
            name: it-login-success
            actions:
            - navigate:
                path: /login
                file-path: src/pages/login.html
            - setInputValue:
                selector: "#email"
                value: Email Input With Less Than 30 Letters
            - setInputValue:
                selector: "#password"
                value: Password Input With Less Than 20 Letters Including At Least "!@#$%^&*" Characters
            - sleep: 5s
            - clickButton:
                selector: "body > div > div > .button"
            expected:
            - jwt-token: "Authorization" Header Should Not Be Empty
            - redirected-page: /main

        - it:
            name: it-login-fails
            actions:
            - navigate:
                path: /login
                file-path: src/pages/login.html
            - setInputValue:
                selector: "#email"
                value: Email Input With More Than 30 Letters
            - setInputValue:
                selector: "#password"
                value: Password Input With Less Than 20 Letters Only With Alphabet
            - sleep: 5s
            - clickButton:
                selector: "body > div > div > .button"
            expected:
            - jwt-token: "Authorization" Header Should Be Empty
            - redirected-page: None (stay in /login page)
            - popup:
                selector: "#login-failed"
    """

    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    index = VectorstoreIndexCreator().from_loaders([loader])

    retriever = index.vectorstore.as_retriever()

    chain_type_kwargs = {"prompt": PROMPT}
    qa = RetrievalQA.from_chain_type(llm=OpenAI(), chain_type="stuff", retriever=retriever,
                                    chain_type_kwargs=chain_type_kwargs)

    with open(f"./yaml/{repo_name}-{hex(random.getrandbits(16))}.yaml", "w") as f:
        f.write(qa.run(query))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo_url", "-r", type=str, required=True, help="Github Public Repository URL")

    args = parser.parse_args()
    create_suggested_yaml(args.repo_url)