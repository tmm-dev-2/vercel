from tvDatafeed import TvDatafeed, Interval
import json
from flask import Flask, request

app = Flask(__name__)
tv = TvDatafeed()

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '')
    results = tv.search_symbol(query)
    return json.dumps(results)

if __name__ == '__main__':
    app.run(port=5000)
