import json
from flask import Flask
from flask import request, jsonify
from .service.messageService import MessageService
from kafka import KafkaProducer
import os


app = Flask(__name__)
app.config.from_pyfile('config.py')

messageService = MessageService()
kafka_host = os.getenv('KAFKA_HOST', 'localhost')
kafka_port = os.getenv('KAFKA_PORT', '9092')
kafka_bootstrap_servers = f"{kafka_host}:{kafka_port}"
print("kafka server: ", kafka_bootstrap_servers)
print("\n")
producer = KafkaProducer(bootstrap_servers=kafka_bootstrap_servers,
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))

@app.route('/v1/ds/message', methods=['POST'])
def handle_message():
    data = request.get_json()
    message = data.get('message', '')
    # Process the incoming message data here
    result = messageService.processMessage(message)

    #serialized_result = result.json()
      # Serialize the result to JSON
    #producer.send('expense_service', serialized_result)

    payload = result.model_dump()   # a dict
    producer.send('expense_service', payload)
    producer.flush()



    if(hasattr(result, 'model_dump')):
        result = result.model_dump()
    return jsonify(result)

@app.route('/', methods=['GET'])
def handle_get():
    print("Hello World")

if __name__ == '__main__':
    app.run(host="localhost", port=8010, debug=True)
    