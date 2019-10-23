from flask import Blueprint 

bp = Blueprint('transaction' , __name__ , template_folder='templates/base')

from app.transaction import routes