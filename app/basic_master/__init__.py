from flask import Blueprint 

bp = Blueprint('basic_master' , __name__ , template_folder='templates/basic_master')

from app.basic_master import routes
from app.basic_master import product_category
# from app.basic_master import appointment , department , pay , performance , post , benefits , attendence_rules