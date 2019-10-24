from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app.main_master import bp
from app import db, ma


@bp.route('/finished_goods_items', methods=['GET'])
@login_required
def view_finished_items():
    return render_template('main_master/finished_items.html')


@bp.route('/raw_materials_item', methods=['GET'])
@login_required
def view_raw_items():
    return render_template('main_master/raw_items.html')

@bp.route('/accessories', methods=['GET'])
@login_required
def view_accessories():
    return render_template('main_master/accessories.html')

@bp.route('/other_materials', methods=['GET'])
@login_required
def view_other_materials():
    return render_template('main_master/other_materials.html')

@bp.route('/process_flow', methods=['GET'])
@login_required
def view_process_flow():
    return render_template('main_master/process_flow.html')
