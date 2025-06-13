from flask import Flask, render_template, request, redirect, url_for, flash
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config.from_pyfile('config.py')

# Allowed extensions for uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'webm', 'ogg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route: Home page with gallery
@app.route('/')
def index():
    # Load media files from static folder
    image_folder = os.path.join(app.static_folder, 'images')
    video_folder = os.path.join(app.static_folder, 'videos')

    images = [f for f in os.listdir(image_folder) if allowed_file(f)]
    videos = [f for f in os.listdir(video_folder) if allowed_file(f)]

    return render_template('index.html', images=images, videos=videos)

# Route: Upload page
@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        if 'media' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['media']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            ext = filename.rsplit('.', 1)[1].lower()
            if ext in {'mp4', 'webm', 'ogg'}:
                save_path = os.path.join(app.static_folder, 'videos', filename)
            else:
                save_path = os.path.join(app.static_folder, 'images', filename)
            file.save(save_path)
            flash('File uploaded successfully!')
            return redirect(url_for('index'))
        else:
            flash('File type not allowed.')
            return redirect(request.url)
    return render_template('upload.html')

# Custom error handler for 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)
