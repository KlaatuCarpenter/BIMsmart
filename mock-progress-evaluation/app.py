from flask import Flask, request, jsonify
from resources.api import Update


app = Flask(__name__)

# @app.route('/', methods=['POST'])
# def call_adapter():
#     data = request.get_json()
#     if data == '':
#         data = {}
#     adapter = Adapter(data)
#     return jsonify(adapter.result)

# @app.route('/<int:payment_id>', methods=['POST'])
# def update_payment():
#     pass

# @app.route('/0', methods=['GET', 'POST'])
# def upload_initial_data():
#     if request.method == 'POST':
#         # check if the post request has the file part
#         if 'file' not in request.files:
#             return 'No file part'
#         file = request.files['file']
#         # If the user does not select a file, the browser submits an
#         # empty file without a filename.
#         if file.filename == '':
#             return 'No selected file'
#         try:
#             res = s3.put_object(
#             Bucket = PROJECT_BUCKET,
#             Key = file.filename,
#             ContentType = 'file',
#             Body = file,
#             ACL = 'private'
#             )
#         except Exception as e:
#             return f"Exception {e}"
#         return f"{res['ResponseMetadata']['HTTPHeaders']['x-fleek-ipfs-hash']}"
#     return '''
#     <!doctype html>
#     <title>Upload new File</title>
#     <h1>Upload new File</h1>
#     <form method=post enctype=multipart/form-data>
#       <input type=file name=file>
#       <input type=submit value=Upload>
#     </form>
#     '''

# @app.route('/', methods=["POST"])
# def create_initial_docs_app():
#      input_json = request.get_json(force=True)
#      initial = Initial(input_json)
#      return initial.result

@app.route('/', methods=["POST"])
def update_payment_app():
     input_json = request.get_json(force=True)
     update = Update(input_json)
     return update.result


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port='8081', threaded=True)
