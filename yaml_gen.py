import os, argparse, random

from langchain import LLMChain
from langchain.document_loaders import GitLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain.docstore.document import Document

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

def generate_file_summary_yaml(repo_url):
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

    data = loader.load()

    query = """
    You are a professional Software Engineer who has scarce knowledge about E2E testing and file summarization.
    Create a definition file that summarizes and explains about file in YAML format.
    In the generated yaml format text, it should contain important information about the file.
    
    [File : {file_path}]
    {page_content}

    File Summary in YAML Format :
    """
    template = PromptTemplate(template=query, input_variables=['file_path', 'page_content'])

    openai = OpenAI(model_name="gpt-3.5-turbo")
    chain = LLMChain(prompt=template, llm=openai)

    for file in data:
        # print("page_content", file.page_content)
        # print("source", file.metadata["source"])
        page_content = file.page_content
        file_path = file.metadata["file_path"]
        print(file_path)

        gen_file_path = f"./generated/file_summary/{repo_name}/{file_path}.yaml"

        os.makedirs(os.path.dirname(gen_file_path), exist_ok=True)
        with open(gen_file_path, "w") as f:
            f.write(chain.run({'file_path': file_path, 'page_content': page_content}))
            f.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo_url", "-r", type=str, required=True, help="Github Public Repository URL")
    parser.add_argument("--generate_mode", "-m", type=str, required=True, help="Generate mode - yaml-gen, test-gen")

    args = parser.parse_args()

    if args.generate_mode == "yaml-gen":
        generate_file_summary_yaml(args.repo_url)
    elif args.generate_mode == "test-gen":
        create_suggested_yaml(args.repo_url)
    else:
        print("generate_mode(-m) option should yaml-gen or test-gen. Please try again.")