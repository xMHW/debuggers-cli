import os, argparse, random

from langchain import LLMChain
from langchain.document_loaders import GitLoader, DirectoryLoader, TextLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain.docstore.document import Document
from langchain.text_splitter import CharacterTextSplitter
from functools import reduce

OPENAI_MODELS = {
    "DAVINCI": "text-davinci-003",
    "GPT-3": "gpt-3.5-turbo",
    "GPT-4": "gpt-4"
}

def create_suggested_yaml(repo_url):
    repo_name = repo_url.split('/')[-1].split('.')[0]
    repo_path = f"./example_repo/{repo_name}"
    supported_extensions = (".js", ".ts", ".tsx")

    if os.path.exists(repo_path):
        loader = GitLoader(repo_path=repo_path, branch="master", 
                        file_filter=lambda file_path: file_path.endswith(supported_extensions))
        loader = DirectoryLoader(file_summary_path, loader_cls=TextLoader)
    else:
        loader = GitLoader(clone_url=repo_url, 
                        repo_path=repo_path, branch="master",
                        file_filter=lambda file_path: file_path.endswith(supported_extensions))

    prompt_template = """You are a Software Engineer who writes test codes. 
    Your language/framework preference is Javascript(Node.js, Jest).
    Use the following pieces of context to do actions at the end.
    {context}

    Action: {question}
    """

    query = """
    Create E2E test code in Javscript language which works in Node.js environment.
    
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

def create_test_scenario(repo_url):
    repo_name = repo_url.split('/')[-1].split('.')[0]
    file_summary_path = f"./generated/{repo_name}/file_summary"

    if os.path.exists(file_summary_path):
        loader = DirectoryLoader(file_summary_path, loader_cls=TextLoader)
    else:
        raise Exception('file_summary does not exist. Please run summary-gen to generate file_summary.')

    prompt_template = """You are a Software Engineer who writes E2E test scenarios. 
    Use the following pieces of context to do actions at the end.
    {context}

    Action: {question}
    """

    query = """
    Create 30 E2E business logic test scenarios based on document,
    and choose only 10 important test scenarios related to users in Project Manager's perspective.

    Ignore configuration files such as webpack, package.json, etc. Embed business-logic-related files only.
    
    10 E2E test cases(from 30 generated E2E tests) in BULLET POINTS:
    """

    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    index = VectorstoreIndexCreator().from_loaders([loader])

    retriever = index.vectorstore.as_retriever()

    chain_type_kwargs = {"prompt": PROMPT}
    qa = RetrievalQA.from_chain_type(llm=OpenAI(model_name=OPENAI_MODELS["GPT-4"]), chain_type="stuff", retriever=retriever,
                                    chain_type_kwargs=chain_type_kwargs)

    test_scenario_file_path = f"./generated/{repo_name}/test-scenario.txt"
    os.makedirs(os.path.dirname(test_scenario_file_path), exist_ok=True)
    with open(test_scenario_file_path, "w") as f:
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
    Create a definition file that summarizes and explains about file in yaml format.
    In the generated yaml format text, it should contain important information about the file.
    
    [File : {file_path}]
    {page_content}

    File Summary in yaml Format:
    """
    template = PromptTemplate(template=query, input_variables=['file_path', 'page_content'])

    openai = OpenAI(model_name="gpt-3.5-turbo")
    chain = LLMChain(prompt=template, llm=openai)

    for file in data:
        page_content = file.page_content
        file_path = file.metadata["file_path"]
        print(file_path)

        gen_file_path = f"./generated/{repo_name}/file_summary/{file_path}.yaml"

        os.makedirs(os.path.dirname(gen_file_path), exist_ok=True)
        with open(gen_file_path, "w") as f:
            f.write(chain.run({'file_path': file_path, 'page_content': page_content}))
            f.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo_url", "-r", type=str, required=True, help="Github Public Repository URL")
    parser.add_argument("--generate_mode", "-m", type=str, required=True, help="Generate mode - summary-gen, test-scenario-gen, test-gen")

    args = parser.parse_args()

    if args.generate_mode == "summary-gen":
        generate_file_summary_yaml(args.repo_url)
    elif args.generate_mode == "test-scenario-gen":
        create_test_scenario(args.repo_url)
    elif args.generate_mode == "test-gen":
        create_suggested_yaml(args.repo_url)
    else:
        print("generate_mode(-m) option should be one of summary-gen, test-scenario-gen, test-gen. Please try again.")