from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.transaction import bp
from app.transaction.model import Transaction, TransactionActivity, TaskItemAct, TransactionActivitySchema
from app.main_master.model import Department, Location
from werkzeug import secure_filename
import shutil
from pathlib import Path
from app import db, ma
import app
import json
import config
import os
from app.utils import allowed_file
import sqlalchemy.exc
from datetime import datetime

UPLOAD_FOLDER = os.path.abspath(current_app.config['UPLOAD_FOLDER'])


@bp.route('/get/activity/<id>', methods=['GET'])
@login_required
def get_activity(id):
    trans = Transaction.query.filter_by(id=int(id)).first()
    data = trans.activity
    schema = TransactionActivitySchema(many=True)
    json_data = schema.dumps(data)
    print(json_data)
    return jsonify(json_data)


@bp.route('/update/activity/item/<item_id>', methods=['POST'])
@login_required
def update_activity_item(item_id):

    try:
        item = TaskItemAct.query.filter_by(id=int(item_id)).first()
        item.flag = "done"
        db.session.commit()
        db.session.close()
        return jsonify({'success': 'Activity updated'})

    except Exception as e:
        db.session.rollback()
        db.session.close()
        return jsonify({'message': 'Something went wrong'})
        
@bp.route('/update/activity/item/not/<item_id>', methods=['POST'])
@login_required
def update_not_activity_item(item_id):

    try:
        item = TaskItemAct.query.filter_by(id=int(item_id)).first()
        item.flag = "not"
        db.session.commit()
        db.session.close()
        return jsonify({'success': 'Activity updated'})

    except Exception as e:
        db.session.rollback()
        db.session.close()
        return jsonify({'message': 'Something went wrong'})


@bp.route('/add/activity', methods=['POST'])
@login_required
def add_activity():
    if request.method == 'POST':
        payload = request.json
        print(payload)
        if payload:
            try:
                new_data = TransactionActivity()

                for key, item in enumerate(payload['task_items']):
                    print(key , item)
                    department = Department.query.filter_by(
                        id=int(item['department'][0]['id'])).first()
                    location = Location.query.filter_by(
                        id=int(item['location'][0]['id'])).first()
                    if 'depends' not in item.keys():
                        item['depends'] = 0
                    if 'remarks' not in item.keys():
                        item['remarks'] = ""
                    if 'flag' not in item.keys():
                        item['flag'] = "not"
                    temp_date = item['start_date'].split('-')
                    start_date = datetime(
                        int(temp_date[2]), int(temp_date[1]), int(temp_date[0]))

                    temp_end_date = item['end_date'].split('-')
                    end_date = datetime(
                        int(temp_end_date[2]), int(temp_end_date[1]), int(temp_end_date[0]))
                    new_data.task_items_act.append(
                        TaskItemAct(int(key), item['name'], department, location, int(item['days']), int(item['depends']), item['remarks'], start_date, end_date , item['flag']))

                db.session.add(new_data)
                db.session.commit()
                return jsonify({'success': 'Data Added', 'activity_id': new_data.id})

            except sqlalchemy.exc.IntegrityError as e:
                print('Here' + str(e))
                db.session.rollback()
                db.session.close()
                return jsonify({'message': 'Duplicate entry for values.'})

            except Exception as e:
                print('Here' + str(e))
                db.session.rollback()
                db.session.close()
                return jsonify({'message': 'Something unexpected happened. Check logs', 'log': str(e)})
        else:
            return jsonify({'message': 'Empty Data.'})
    else:
        return jsonify({'message': 'Invalid HTTP method . Use POST instead.'})





@bp.route('/update/activity/<id>', methods=['POST'])
@login_required
def update_activity(id):
    if request.method == 'POST':
        payload = request.json
        print(payload)
        if payload:
            try:
                new_data = Transaction.query.filter_by(id=int(id)).first().activity[0]
                print(new_data)
                new_data.task_items_act = []
                db.session.commit()
                for key, item in enumerate(payload['task_items_act']):
                    print(key , item)
                    department = Department.query.filter_by(
                        id=int(item['department'][0]['id'])).first()
                    location = Location.query.filter_by(
                        id=int(item['location'][0]['id'])).first()
                    if 'depends' not in item.keys():
                        item['depends'] = 0
                    if 'remarks' not in item.keys():
                        item['remarks'] = ""
                    if 'flag' not in item.keys():
                        item['flag'] = "not"
                    temp_date = item['start_date'].split('-')
                    start_date = datetime(
                        int(temp_date[2]), int(temp_date[1]), int(temp_date[0]))

                    temp_end_date = item['end_date'].split('-')
                    end_date = datetime(
                        int(temp_end_date[2]), int(temp_end_date[1]), int(temp_end_date[0]))
                    new_data.task_items_act.append(
                        TaskItemAct(int(key), item['name'], department, location, int(item['days']), int(item['depends']), item['remarks'], start_date, end_date , item['flag']))

                db.session.add(new_data)
                db.session.commit()
                return jsonify({'success': 'Data Added', 'activity_id': new_data.id})

            except sqlalchemy.exc.IntegrityError as e:
                print('Here' + str(e))
                db.session.rollback()
                db.session.close()
                return jsonify({'message': 'Duplicate entry for values.'})

            except Exception as e:
                print('Here' + str(e))
                db.session.rollback()
                db.session.close()
                return jsonify({'message': 'Something unexpected happened. Check logs', 'log': str(e)})
        else:
            return jsonify({'message': 'Empty Data.'})
    else:
        return jsonify({'message': 'Invalid HTTP method . Use POST instead.'})
