from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.main_master import bp
from app.main_master.model import Accessories, AccessoriesSchema 
from app.basic_master.model import  Uom
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

UPLOAD_FOLDER = os.path.abspath(current_app.config['UPLOAD_FOLDER'])


@bp.route('/get/accessories', methods=['GET'])
@login_required
def get_accessories():
    if request.method == 'GET':

        data_schema = AccessoriesSchema(many=True)
        data = Accessories.query.all()
        json_data = data_schema.dump(data)
        return jsonify(json_data)


@bp.route('/get/accessories/last', methods=['GET'])
@login_required
def get_accessories_last():
    if request.method == 'GET':

        data_schema = AccessoriesSchema()
        data = Accessories.query.order_by(Accessories.id.desc()).first()
        json_data = data_schema.dump(data)
        print(json_data)
        return jsonify(json_data)


@bp.route('/add/accessories', methods=['POST'])
@login_required
def add_accessories():
    if request.method == 'POST':
        payload = json.loads(request.form['data'])
        file = request.files

        if payload:
            try:
                uom = Uom.query.filter_by(id = int(payload['uom'])).first()
                new_data = Accessories(
                    payload['name'], payload['desc'], payload['uom'])
                new_data.uom.append(uom)
                if len(file) != 0:
                    file = request.files['image']
                    try:

                        if file and allowed_file(file.filename):
                            filename = secure_filename(file.filename)
                            foldertemp = os.path.join(
                                UPLOAD_FOLDER, 'accessories')

                            if os.path.exists(foldertemp):
                                filetemp = os.path.join(
                                    foldertemp, filename)
                                file.save(filetemp)
                                setattr(new_data, 'image', filetemp)
                            else:

                                os.makedirs(foldertemp)

                                filetemp = os.path.join(
                                    foldertemp, filename)
                                file.save(filetemp)
                                setattr(new_data, 'image', filetemp)
                        else:
                            return jsonify({'message': 'Image file not supported.'})

                    except KeyError as e:
                        print(str(e))
                        pass

                    except Exception as e:
                        print(str(e))

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


@bp.route('/edit/accessories', methods=['POST'])
@login_required
def edit_accessories():
    if request.method == 'POST':
        payload = json.loads(request.form['data'])
        file = request.files
        print(payload)
        if payload:
            try:
                new_data = Accessories.query.filter_by(
                    id=payload['id']).first()

                uom = Uom.query.filter_by(id=int(payload['uom'])).first()

                temp_image = new_data.image
                new_data.name = payload['name']
                new_data.desc = payload['desc']
                new_data.uom_id = uom.id
                new_data.uom = []
                new_data.uom.append(uom)

                if len(file) != 0:
                    file = request.files['image']
                    try:

                        if file and allowed_file(file.filename):
                            filename = secure_filename(file.filename)
                            foldertemp = os.path.join(
                                UPLOAD_FOLDER, 'accessories')

                            if os.path.exists(foldertemp):
                                filetemp = os.path.join(
                                    foldertemp, filename)
                                file.save(filetemp)

                                new_data.image = filetemp
                            else:
                                os.makedirs(foldertemp)

                                filetemp = os.path.join(
                                    foldertemp, filename)
                                file.save(filetemp)
                                new_data.image = filetemp

                        else:
                            return jsonify({'message': 'Image file not supported.'})

                    except KeyError as e:
                        print(str(e))

                        pass

                    except Exception as e:
                        print(str(e))
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


@bp.route('/delete/accessories', methods=['POST'])
@login_required
def delete_accessories():
    if request.method == 'POST':
        payload = request.json
        check_data = Accessories.query.filter_by(id=payload['id'])
        if check_data.first():
            # if len(check_data.first().company_location) is int(0):

            try:
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
