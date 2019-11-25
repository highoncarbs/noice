from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.main_master import bp
from app.main_master.model import FinishedGoods, FinishedGoodsSchema
from app.basic_master.model import ProductCategory, FabricCombination, PrintTechnique, DesignNumber, Uom
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


@bp.route('/get/finished_goods', methods=['GET'])
@login_required
def get_finished_goods():
    if request.method == 'GET':

        data_schema = FinishedGoodsSchema(many=True)
        data = FinishedGoods.query.all()
        json_data = data_schema.dump(data)
        return jsonify(json_data)

@bp.route('/get/finished_goods/last', methods=['GET'])
@login_required
def get_finished_goods_last():
    if request.method == 'GET':

        data_schema = FinishedGoodsSchema()
        data = FinishedGoods.query.order_by(FinishedGoods.id.desc()).first()
        json_data = data_schema.dump(data)
        return jsonify(json_data)


@bp.route('/add/finished_goods', methods=['POST'])
@login_required
def add_finished_goods():
    if request.method == 'POST':
        print(request.form)
        payload = json.loads(request.form['data'])
        print(payload)
        file = request.files
        print(file)
        if payload:
            try:
                product_category = ProductCategory.query.filter_by(
                    id=int(payload['product_category'])).first()
                fabric_combination = FabricCombination.query.filter_by(
                    id=int(payload['fabric_combination'])).first()
                print_technique = PrintTechnique.query.filter_by(
                    id=int(payload['print_technique'])).first()
                design_number = DesignNumber.query.filter_by(
                    id=int(payload['design_number'])).first()
                uom = Uom.query.filter_by(id=int(payload['uom'])).first()

                new_data = FinishedGoods(
                    payload['alt_name'], int(payload['product_category']), int(payload['fabric_combination']), int(payload['print_technique']), int(payload['design_number']), int(payload['uom']))
                new_data.product_category.append(product_category)
                new_data.fabric_combination.append(fabric_combination)
                new_data.print_technique.append(print_technique)
                new_data.design_number.append(design_number)
                new_data.uom.append(uom)

                if len(file) != 0:
                    file = request.files['image']
                    try:

                        if file and allowed_file(file.filename):
                            filename = secure_filename(file.filename)
                            foldertemp = os.path.join(
                                UPLOAD_FOLDER, 'finished_goods')

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


@bp.route('/edit/finished_goods', methods=['POST'])
@login_required
def edit_finished_goods():
    if request.method == 'POST':
        payload = json.loads(request.form['data'])
        file = request.files
        print(payload)
        if payload:
            try:
                new_data = FinishedGoods.query.filter_by(
                    id=payload['id']).first()
                temp_image = new_data.image
                new_data.alt_name = payload['alt_name']
                product_category = ProductCategory.query.filter_by(
                    id=int(payload['product_category'])).first()
                fabric_combination = FabricCombination.query.filter_by(
                    id=int(payload['fabric_combination'])).first()
                print_technique = PrintTechnique.query.filter_by(
                    id=int(payload['print_technique'])).first()
                design_number = DesignNumber.query.filter_by(
                    id=int(payload['design_number'])).first()
                uom = Uom.query.filter_by(id=int(payload['uom'])).first()

                new_data.product_category_id = product_category.id
                new_data.fabric_combination_id = fabric_combination.id
                new_data.print_technique_id = print_technique.id
                new_data.design_number_id = design_number.id
                new_data.uom_id = uom.id
                new_data.product_category = []
                new_data.print_technique = []
                new_data.fabric_combination = []
                new_data.design_number = []
                new_data.uom = []
                new_data.product_category.append(product_category)
                new_data.fabric_combination.append(fabric_combination)
                new_data.print_technique.append(print_technique)
                new_data.design_number.append(design_number)
                new_data.uom.append(uom)

                if len(file) != 0:
                    file = request.files['image']
                    try:

                        if file and allowed_file(file.filename):
                            filename = secure_filename(file.filename)
                            foldertemp = os.path.join(
                                UPLOAD_FOLDER, 'finished_goods')

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


@bp.route('/delete/finished_goods', methods=['POST'])
@login_required
def delete_finished_goods():
    if request.method == 'POST':
        payload = request.json
        check_data = FinishedGoods.query.filter_by(id=payload['id'])
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
