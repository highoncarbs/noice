from flask import Blueprint 

bp = Blueprint('basic_master' , __name__ , template_folder='templates/basic_master')

from app.basic_master import routes , uom
from app.basic_master import yarn  , fabric_process , fabric_width , fabric_construction , raw_material_category ,fabric_dye
from app.basic_master import product_category , fabric_combination , print_technique , design_number , size_master , leader
from app.basic_master import department , location