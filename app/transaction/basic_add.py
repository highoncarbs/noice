from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.transaction import bp
from app.basic_master.model import ProductCategory
from app.transaction.model import Transaction, TransactionBasic ,TransactionBasicSchema 
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
import uuid

UPLOAD_FOLDER = os.path.abspath(current_app.config['UPLOAD_FOLDER'])


@bp.route('/get/basic/<id>', methods=['GET'])
@login_required
def get_basic(id):
    trans = Transaction.query.filter_by(id=int(id)).first()
    data = trans.basic
    print(data)

    schema = TransactionBasicSchema(many=True)
    json_data = schema.dumps(data)
    return jsonify(json_data)

@bp.route('/add/basic', methods=['POST'])
@login_required
def add_basic():
    if request.method == 'POST':
        payload = json.loads(request.form['data'])

        if payload:
            try:
                unique_prefix = str(uuid.uuid4())[:8]
                temp_date = payload['start_date'].split('-')
                start_date = datetime(
                    int(temp_date[0]), int(temp_date[1]), int(temp_date[2]))
                # print(start_date , int(payload['days']), payload["finished_product_category"], str(payload['desc']), str(payload['team_leader']), str(payload['team_members']))
                finished_goods = ProductCategory.query.filter_by(id =  int(payload["finished_product_category"]) ).first()
                new_data = TransactionBasic(
                    start_date, int(payload['days']), finished_goods , str(payload['desc']), str(payload['team_leader']), str(payload['team_members']))
                if len(request.files) != 0:
                    gen_folder_name = unique_prefix+'_'+str(
                        payload['start_date'])+'_'+str(payload['team_leader'])
                    foldertemp = os.path.join(
                        UPLOAD_FOLDER, 'transaction', str(gen_folder_name))
                    array_file = request.files

                    for file in array_file.items():
                        try:
                            # if file and allowed_file(file.filename):
                            if file:

                                if os.path.exists(foldertemp):
                                    filetemp = os.path.join(
                                        foldertemp, file[1].filename)
                                    file[1].save(filetemp)

                                else:

                                    os.makedirs(foldertemp)
                                    filetemp = os.path.join(
                                        foldertemp,  file[1].filename)
                                    file[1].save(filetemp)
                                
                                setattr(
                                    new_data, 'upload_folder', foldertemp)
                                    
                            else:
                                return jsonify({'message': 'Image file not supported.'})

                        except KeyError as e:
                            print(str(e))
                            pass

                        except Exception as e:
                            print(str(e))
                   
                db.session.add(new_data)
                db.session.commit()
                basic_id = new_data.id
                return jsonify({'success': 'Data Added', 'basic_id': int(basic_id) , 'upload_folder' : str(foldertemp)})

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


@bp.route('/get/basic/files/<id>', methods=['GET'])
@login_required
def get_basic_files(id):
    trans = Transaction.query.filter_by(id=int(id)).first()
    data = trans.basic[0].upload_folder
    images = []
    for r, d, f in os.walk(data):
        for file in f:
            images.append( os.path.join(r , file))
    print(images)
    # schema = TransactionBasicSchema(many=True)
    # json_data = schema.dumps(data)
    return jsonify(images)