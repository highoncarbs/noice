from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.main_master import bp
from app.main_master.model import RawGoods, RawGoodsSchema
from app.basic_master.model import Yarn, FabricProcess, FabricWidth, FabricDye, RawMaterialCategory, FabricConstruction
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


@bp.route('/get/raw_goods', methods=['GET'])
@login_required
def get_raw_goods():
    if request.method == 'GET':

        data_schema = RawGoodsSchema(many=True)
        data = RawGoods.query.all()
        json_data = data_schema.dump(data)
        return jsonify(json_data)


@bp.route('/get/raw_goods/last', methods=['GET'])
@login_required
def get_raw_goods_last():
    if request.method == 'GET':

        data_schema = RawGoodsSchema()
        data = RawGoods.query.order_by(RawGoods.id.desc()).first()
        json_data = data_schema.dump(data)
        return jsonify(json_data)


@bp.route('/add/raw_goods', methods=['POST'])
@login_required
def add_raw_goods():
    if request.method == 'POST':
        print(request.form)
        payload = json.loads(request.form['data'])
        print(payload)
        file = request.files

        if payload:
            try:
                yarn = Yarn.query.filter_by(
                    id=int(payload['yarn'])).first()
                fabric_process = FabricProcess.query.filter_by(
                    id=int(payload['fabric_process'])).first()
                fabric_width = FabricWidth.query.filter_by(
                    id=int(payload['fabric_width'])).first()
                fabric_dye = FabricDye.query.filter_by(
                    id=int(payload['fabric_dye'])).first()
                raw_material_category = RawMaterialCategory.query.filter_by(
                    id=int(payload['raw_material_category'])).first()
                fabric_construction = FabricConstruction.query.filter_by(
                    id=int(payload['fabric_construction'])).first()
                new_data = RawGoods(
                    payload['alt_name'], int(payload['yarn']), int(payload['fabric_process']), int(payload['fabric_width']), int(payload['fabric_dye']), int(payload['raw_material_category']), int(payload['fabric_construction']))
                
                new_data.yarn.append(yarn)
                new_data.fabric_process.append(fabric_process)
                new_data.fabric_width.append(fabric_width)
                new_data.fabric_dye.append(fabric_dye)
                new_data.raw_material_category.append(raw_material_category)
                new_data.fabric_construction.append(fabric_construction)

                if len(file) != 0:
                    file = request.files['image']
                    try:

                        if file and allowed_file(file.filename):
                            filename = secure_filename(file.filename)
                            foldertemp = os.path.join(
                                UPLOAD_FOLDER, 'raw_goods')

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


@bp.route('/edit/raw_goods', methods=['POST'])
@login_required
def edit_raw_goods():
    if request.method == 'POST':
        payload = json.loads(request.form['data'])
        file = request.files
        print(payload)
        if payload:
            try:
                new_data = RawGoods.query.filter_by(
                    id=payload['id']).first()
                temp_image = new_data.image
                new_data.alt_name = payload['alt_name']
                yarn = Yarn.query.filter_by(
                    id=int(payload['yarn'])).first()
                fabric_process = FabricProcess.query.filter_by(
                    id=int(payload['fabric_process'])).first()
                fabric_width = FabricWidth.query.filter_by(
                    id=int(payload['fabric_width'])).first()
                fabric_dye = FabricDye.query.filter_by(
                    id=int(payload['fabric_dye'])).first()
                raw_material_category = RawMaterialCategory.query.filter_by(
                    id=int(payload['raw_material_category'])).first()
                fabric_construction = FabricConstruction.query.filter_by(
                    id=int(payload['fabric_construction'])).first()

                new_data.yarn_id = yarn.id
                new_data.fabric_process_id =fabric_process.id
                new_data.fabric_width_id = fabric_width.id
                new_data.fabric_dye_id = fabric_dye.id
                new_data.raw_material_category_id = raw_material_category.id
                new_data.fabric_construction_id = fabric_construction.id

                new_data.yarn = []
                new_data.fabric_process = []
                new_data.fabric_width = []
                new_data.fabric_dye = []
                new_data.raw_material_category = []
                new_data.fabric_construction = []

                new_data.yarn.append(yarn)
                new_data.fabric_process.append(fabric_process)
                new_data.fabric_width.append(fabric_width)
                new_data.fabric_dye.append(fabric_dye)
                new_data.raw_material_category.append(raw_material_category)
                new_data.fabric_construction.append(fabric_construction)

                if len(file) != 0:
                    file = request.files['image']
                    try:

                        if file and allowed_file(file.filename):
                            filename = secure_filename(file.filename)
                            foldertemp = os.path.join(
                                UPLOAD_FOLDER, 'raw_goods')

                            if os.path.exists(foldertemp):
                                filetemp = os.path.join(
                                    foldertemp, filename)
                                print(filetemp)
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


@bp.route('/delete/raw_goods', methods=['POST'])
@login_required
def delete_raw_goods():
    if request.method == 'POST':
        payload = request.json
        check_data = RawGoods.query.filter_by(id=payload['id'])
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
