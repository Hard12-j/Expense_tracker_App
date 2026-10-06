import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from app.service.Expense import Expense
from dotenv import load_dotenv, dotenv_values

class LLMService:
    def __init__(self):
        load_dotenv()
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert extraction algorithm. "
                "Only extract relevant information from the text. "
                "If you do not know the value of an attribute asked to extract, "
                "return null for the attribute's value."),
            ("human","{text}")
        ])

        self.apikey = os.getenv("OPENAI_API_KEY")
        self.llm = ChatGoogleGenerativeAI(model="gemini-3.8-flash", google_api_key=os.getenv("OPENAI_API_KEY"))
        self.runnable = self.prompt | self.llm.with_structured_output(schema=Expense)

    def runLLM(self, message):
        response = self.runnable.invoke({"text": message})
        return response