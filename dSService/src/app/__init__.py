from flask import Flask
from flask import request, jsonify
from service.messageService import MessageService

app = Flask(__name__)
app.config.from_pyfile('config.py')

messageService = MessageService()

@app.route('/v1/ds/message', methods=['POST'])
def handle_message():
    data = request.get_json()
    message = data.get('message', '')
    # Process the incoming message data here
    result = messageService.processMessage(message)
    if(hasattr(result, 'model_dump')):
        result = result.model_dump()
    return jsonify(result)

@app.route('/', methods=['GET'])
def handle_get():
    print("Hello World")

if __name__ == '__main__':
    app.run(host="localhost", port=8000, debug=True)
    