from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app.transaction import bp
from app import db, ma


@bp.route('/new', methods=['GET'])
@login_required
def view_transaction():
    return render_template('transaction/new.html')
