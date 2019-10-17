from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify
from flask_login import login_user, logout_user, current_user
from app.basic_master import bp
# from app.master.model import Company, Location, LocationSchema, CompanySchema, EmployeeCategory, EmployeeCatSchema
from app import db, ma


@bp.route('/finished_goods_item', methods=['GET'])
def view_finished_master():
    return render_template('basic_master/finished_items.html')
