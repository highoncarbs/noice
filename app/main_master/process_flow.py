from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.main_master import bp
from app.main_master.model import ProcessFlow, ProcessFlowSchema, TaskItem, TaskItemSchema, Department, Location
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


@bp.route('/get/process_flow', methods=['GET'])
@login_required
def get_process_flow():
    if request.method == 'GET':

        data_schema = ProcessFlowSchema(many=True)
        data = ProcessFlow.query.all()
        print(data)
        json_data = data_schema.dump(data)
        return jsonify(json_data)


@bp.route('/get/process_flow/last', methods=['GET'])
@login_required
def get_process_flow_last():
    if request.method == 'GET':

        data_schema = ProcessFlowSchema()
        data = ProcessFlow.query.order_by(ProcessFlow.id.desc()).first()
        json_data = data_schema.dump(data)
        return jsonify(json_data)


@bp.route('/add/process_flow', methods=['POST'])
@login_required
def add_process_flow():
    if request.method == 'POST':
        payload = request.json
        if payload:
            try:

                new_data = ProcessFlow(
                    payload['name'].lower())

                for key, item in enumerate(payload['task_list']):
                    print(key, item['department']['id'])
                    item = item
                    department = Department.query.filter_by(
                        id=int(item['department']['id'])).first()
                    location = Location.query.filter_by(
                        id=int(item['location']['id'])).first()
                    new_data.task_items.append(
                        TaskItem(int(key), item['name'], department, location, item['days']))

                db.session.add(new_data)
                db.session.commit()
                return jsonify({'success': 'Data Added'})

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


@bp.route('/edit/process_flow', methods=['POST'])
@login_required
def edit_process_flow():
    if request.method == 'POST':
        payload = json.loads(request.form['data'])

        if payload:
            try:
                new_data = ProcessFlow.query.filter_by(
                    id=payload['id']).first()
                temp_image = new_data.image
                new_data.name = payload['name'].lower()
                new_data.desc = payload['desc']

                db.session.commit()
                return jsonify({'success': 'Data Updated'})

            except Exception as e:
                print(str(e))

                db.session.rollback()
                db.session.close()
                return jsonify({'message': 'Something unexpected happened. Check logs', 'log': str(e)})
        else:
            return jsonify({'message': 'Empty Data.'})

    else:
        return jsonify({'message': 'Invalid HTTP method . Use POST instead.'})


@bp.route('/delete/process_flow', methods=['POST'])
@login_required
def delete_process_flow():
    if request.method == 'POST':
        payload = request.json
        check_data = ProcessFlow.query.filter_by(id=payload['id'])
        if check_data.first():
            # if len(check_data.first().company_location) is int(0):

            try:
                check_data.task_items = []
                check_data.delete()
                db.session.commit()
                return jsonify({'success': 'Data deleted'})
            except Exception as e:
                db.session.rollback()
                db.session.close()
                return jsonify({'message': 'Something unexpected happened. Check logs', 'log': str(e)})
            # else:
            #     return jsonify({'message': 'Cannot delete data. Being used by other master.'})

        else:
            return jsonify({'message': 'Data does not exist.'})

    else:
        return jsonify({'message': 'Invalid HTTP method . Use POST instead.'})
