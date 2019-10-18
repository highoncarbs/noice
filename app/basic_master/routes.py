from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify
from flask_login import login_user, logout_user, current_user
from app.basic_master import bp
# from app.master.model import Company, Location, LocationSchema, CompanySchema, EmployeeCategory, EmployeeCatSchema
from app import db, ma


@bp.route('/finished_goods_item', methods=['GET'])
def view_finished_items():
    return render_template('basic_master/finished_items.html')

@bp.route('/raw_materials_item', methods=['GET'])
def view_raw_items():
    return render_template('basic_master/raw_items.html')
@bp.route('/uom', methods=['GET'])
def view_uom():
    return render_template('basic_master/uom.html')
