from flask import Flask, render_template
app = Flask(__name__, static_url_path="/bulldozer/static")
app.config['DEBUG'] = True
root = "/bulldozer"


@app.route(root + '/')
def home():
    return render_template('bulldozer.html')