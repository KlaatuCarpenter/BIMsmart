from flask import Flask, request, jsonify
from resources.adapter import Update


app = Flask(__name__)

@app.route('/', methods=["POST"])
def update_payment_app():
     input_json = request.get_json(force=True)
     update = Update(input_json)
     return jsonify(update.result)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port='8081', threaded=True)
