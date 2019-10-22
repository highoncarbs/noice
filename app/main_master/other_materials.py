from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.main_master import bp
from app.main_master.model import OtherMaterials, OtherMaterialsSchema
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


@bp.route('/get/other_materials', methods=['GET'])
@login_required
def get_other_materials():
    if request.method == 'GET':

        data_schema = OtherMaterialsSchema(many=True)
        data = OtherMaterials.query.all()
        json_data = data_schema.dump(data)
        return jsonify(json_data)


@bp.route('/get/other_materials/last', methods=['GET'])
@login_required
def get_other_materials_last():
    if request.method == 'GET':

        data_schema = OtherMaterialsSchema()
        data = OtherMaterials.query.order_by(OtherMaterials.id.desc()).first()
        json_data = data_schema.dump(data)
        return jsonify(json_data)


@bp.route('/add/other_materials', methods=['POST'])
@login_required
def add_other_materials():
    if request.method == 'POST':
        payload = json.loads(request.form['data'])
        file = request.files

        if payload:
            try:

                new_data = OtherMaterials(
                    payload['name'], payload['desc'])
                if len(file) != 0:
                    file = request.files['image']
                    try:

                        if file and allowed_file(file.filename):
                            filename = secure_filename(file.filename)
                            foldertemp = os.path.join(
                                UPLOAD_FOLDER, 'other_materials')

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


@bp.route('/edit/other_materials', methods=['POST'])
@login_required
def edit_other_materials():
    if request.method == 'POST':
        payload = json.loads(request.form['data'])
        file = request.files
        print(payload)
        if payload:
            try:
                new_data = OtherMaterials.query.filter_by(
                    id=payload['id']).first()
                temp_image = new_data.image
                new_data.name = payload['name']
                new_data.desc = payload['desc']

                if len(file) != 0:
                    file = request.files['image']
                    try:

                        if file and allowed_file(file.filename):
                            filename = secure_filename(file.filename)
                            foldertemp = os.path.join(
                                UPLOAD_FOLDER, 'other_materials')

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


@bp.route('/delete/other_materials', methods=['POST'])
@login_required
def delete_other_materials():
    if request.method == 'POST':
        payload = request.json
        check_data = OtherMaterials.query.filter_by(id=payload['id'])
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
