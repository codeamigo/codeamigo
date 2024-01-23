from flask import Flask, jsonify, request
from flask_cors import CORS
from interfaces import OpenAIBase

app = Flask(__name__)

CORS(app)

model = OpenAIBase()


@app.route("/data", methods=["POST"])
def explain():
    input_text = request.json.get("prompt")
    answer = model.answer(input_text)
    return jsonify(answer)


if __name__ == "__main__":
    app.run(debug=True)
