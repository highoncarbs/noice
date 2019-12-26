from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app.reports import bp
from app import db, ma


@bp.route('/view', methods=['GET'])
@login_required
def view_reports():
    return render_template('reports/view.html')

@bp.route('/print/<id>', methods=['GET'])
@login_required
def print_reports(id):
    return render_template('reports/transaction_print.html')
