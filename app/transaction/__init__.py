from flask import Blueprint 

bp = Blueprint('transaction' , __name__ , template_folder='templates/base')

from app.transaction import routes , basic_add , activity_add , materials_add