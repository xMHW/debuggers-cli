import os
import argparse
import random
from dotenv import load_dotenv

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

from langchain.document_loaders import UnstructuredHTMLLoader
import requests

load_dotenv()


TEST_SCENARIO_COUNT = os.getenv("TEST_SCENARIO_COUNT")
GIT_REPOSITORY = os.getenv("GIT_REPOSITORY")

OPENAI_MODELS = {
    "DAVINCI": "text-davinci-003",
    "GPT-3": "gpt-3.5-turbo",
    "GPT-4": "gpt-4"
}

def generate_file_summary_yaml():
    repo_name = "python_tutorial"
    url = requests.get("https://www.w3schools.com/python/python_file_write.asp")
    htmltext = url.text

    f = open("temporaryfile.html", "w")
    f.write(htmltext)
    f.close()

    loader = UnstructuredHTMLLoader("temporaryfile.html")

    data = loader.load()

    query = """
    You are a professional Software Engineer who has scarce knowledge about E2E testing and file summarization.
    Create a definition file that summarizes and explains about file in yaml format.
    In the generated yaml format text, it should contain important information about the file.
    
    [File : {file_path}]
    {page_content}

    File Summary in yaml Format:
    """
    template = PromptTemplate(template=query, input_variables=[
                              'file_path', 'page_content'])

    openai = OpenAI(model_name="gpt-3.5-turbo")
    chain = LLMChain(prompt=template, llm=openai)

    i = 0
    for file in data:
        page_content = file.page_content
        file_path = repo_name + str(i)
        print(file_path)
        i += 1

        gen_file_path = f"./generated2/{repo_name}/file_summary/{file_path}.yaml"

        os.makedirs(os.path.dirname(gen_file_path), exist_ok=True)
        with open(gen_file_path, "w") as f:
            f.write(
                chain.run({'file_path': file_path, 'page_content': page_content}))
            f.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--generate_mode", "-m", type=str, required=True,
                        help="Generate mode - summary-gen")

    args = parser.parse_args()

    if args.generate_mode == "summary-gen":
        generate_file_summary_yaml()
    else:
        print("generate_mode(-m) option should be one of summary-gen. Please try again.")
