from flask import Blueprint 

bp = Blueprint('main_master' , __name__ , template_folder='templates/main_master')

from app.main_master import routes , finished_item , raw_item , accessories , other_materials , process_flow