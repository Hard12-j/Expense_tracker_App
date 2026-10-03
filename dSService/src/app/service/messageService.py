from utils.messageUtil import MessageUtil
from service.llmService import LLMService

class MessageService:
    def __init__(self):
        self.messageUtil = MessageUtil()
        self.llmService = LLMService()

    def processMessage(self, message):
        if self.messageUtil.isBankSms(message):
            result = self.llmService.runLLM(message)
            return result
        else:
            return {"error": "Not a bank SMS message."}
