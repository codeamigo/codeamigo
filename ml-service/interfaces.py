import os
from abc import ABC, abstractmethod

import openai
import yaml
from langchain import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory

try:
    openai.api_key = os.environ["OPENAI_API_KEY"]
except KeyError:
    raise Exception("`OPENAI_API_KEY` missing from runtime environment")


class ModelResponse(ABC):
    @abstractmethod
    def setup(self, *args, **kwargs):
        raise NotImplementedError

    @abstractmethod
    def answer(self, *args, **kwargs):
        raise NotImplementedError

    @classmethod
    def load_base_config(cls):
        this_dir = os.path.dirname(__file__)
        cfg_file = os.path.join(this_dir, "config.yml")
        with open(cfg_file, "r") as f:
            return yaml.safe_load(f)


class OpenAIBase(ModelResponse):
    def __init__(self, **kwargs):
        self.config = OpenAIBase.build_config()
        self.model_params = {}
        if not kwargs:
            self.model_params = self.config["model_params"]
        else:
            for k, v in kwargs.items():
                self.model_params[k] = v

    @staticmethod
    def build_config():
        base_config = ModelResponse.load_base_config()
        return base_config["openai"]["base"]

    def setup(self):
        # no need to init any of the openai model classes
        pass

    def answer(self, user_input: str) -> dict[str]:
        resp = openai.Completion.create(prompt=user_input, **self.model_params)
        return resp.to_dict()


class LangchainChatbotBase(ModelResponse):
    def __init__(self, model, memory):
        self.config = LangchainChatbotBase.build_config()
        self.setup(model, memory)

    @staticmethod
    def build_config():
        base_config = ModelResponse.load_base_config()
        return base_config["langchain"]["chatbot"]

    @staticmethod
    def load_lesson_module(lesson: str) -> str:
        lesson = "lesson.py"  # temp stub
        this_dir = os.path.dirname(__file__)
        cfg_file = os.path.join(this_dir, lesson)
        with open(cfg_file, "r") as f:
            return f.read()

    def build_prompt(self) -> PromptTemplate:
        base_prompt = self.config["template"]
        lesson_code = LangchainChatbotBase.load_lesson_module(
            "lesson.py"
        )  # TODO: extend this
        prompt_lesson_injected = base_prompt.format(lesson_source=lesson_code)
        prompt_template = (
            prompt_lesson_injected
            + """

        {history}
        Human: {human_input}
        PythonTeacher:
        """
        )
        return PromptTemplate(
            input_variables=["history", "human_input"], template=prompt_template
        )

    def setup(self, model, memory, verbose=True):
        prompt = self.build_prompt()
        self.chain = LLMChain(llm=model, prompt=prompt, verbose=verbose, memory=memory)

    def answer(self, user_input: str) -> str:
        return self.chain.predict(human_input=user_input)


class OpenAILangchainChatbot(LangchainChatbotBase):
    def __init__(self):
        model = OpenAI(temperature=0)  # TODO: add via config
        memory = ConversationBufferMemory()
        super().__init__(model, memory)
