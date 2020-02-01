from flask import Blueprint 

bp = Blueprint('production' , __name__ )

from app.production import routes , prod_activity_add , prod_basic_add , prod_materials_add