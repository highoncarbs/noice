
ALLOWED_EXTENSIONS = set(['pdf', 'png', 'jpg','JPG','PNG','JPEG', 'jpeg', 'gif'])


def allowed_file(filename):
    print(filename)
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
