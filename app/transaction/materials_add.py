from flask import Blueprint
from flask import render_template, redirect, url_for, request, session, jsonify, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.transaction import bp
from app.transaction.model import Transaction , TransactionBasic , TransactionActivity, TransactionMaterials , TransactionMaterialsSchema
from app.transaction.model import RawItem, FinishedItem, AccessoriesItem, OtherMaterialsItem \
    , Uom , RawGoods , FinishedGoods , Accessories , OtherMaterials  , AccessoriesItemSchema
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

@bp.route('/get/materials/<id>', methods=['GET'])
@login_required
def get_materials(id):
    trans = Transaction.query.filter_by(id=int(id)).first()
    data = trans.material
   
    schema = TransactionMaterialsSchema(many=True)
    json_data = schema.dumps(data)
    return jsonify(json_data)

@bp.route('/add/materials', methods=['POST'])
@login_required
def add_materials():
    if request.method == 'POST':
        payload = request.json
        raw_inputs = payload[0]['raw_inputs']
        finished_inputs = payload[1]['finished_inputs']
        accessories_inputs = payload[2]['accessories_inputs']
        other_materials_inputs = payload[3]['other_materials_inputs']
        basic_id = payload[4]['basic_id']
        activity_id = payload[5]['activity_id']
        basic_data = TransactionBasic.query.filter_by(id = int(basic_id)).first()
        activity_data = TransactionActivity.query.filter_by(id=int(activity_id)).first()
        if payload:
            try:
                new_data = TransactionMaterials()
                final_Data = Transaction()
                basic_data = TransactionBasic.query.filter_by(id = int(basic_id)).first()
                activity_data = TransactionActivity.query.filter_by(id=int(activity_id)).first()
                basic_data.transaction = final_Data
                activity_data.transaction = final_Data
                new_data.transaction = final_Data
                
                for key, item in enumerate(raw_inputs):
                    raw_mat = RawGoods.query.filter_by(
                        id=int(item['goods'])).first()
                    
                    qty = float(item['qty'])

                    new_data.raw_materials.append(
                        RawItem(raw_mat, qty))
            
                   
                for key, item in enumerate(finished_inputs):
                    finished_mat = FinishedGoods.query.filter_by(
                        id=int(item['goods'])).first()
                    
                    qty = float(item['qty'])

                    new_data.finished_materials.append(
                        FinishedItem(finished_mat, qty))

                   
                for key, item in enumerate(accessories_inputs):
                    accessories_mat = Accessories.query.filter_by(
                        id=int(item['goods'])).first()
                    
                    qty = float(item['qty'])

                    new_data.accessories_materials.append(
                        AccessoriesItem(accessories_mat, qty))

                   
                for key, item in enumerate(other_materials_inputs):
                    other_mat = OtherMaterials.query.filter_by(
                        id=int(item['goods'])).first()
                    
                    qty = float(item['qty'])

                    new_data.other_materials.append(
                        OtherMaterialsItem(other_mat, qty))
                db.session.add(new_data)
                db.session.commit()
                return jsonify({'success': 'Data Added' })

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



@bp.route('/update/materials/<id>', methods=['POST'])
@login_required
def update_materials(id):
    if request.method == 'POST':
        payload = request.json

        payload = request.json
        raw_inputs = payload[0]['raw_inputs']
        finished_inputs = payload[1]['finished_inputs']
        accessories_inputs = payload[2]['accessories_inputs']
        other_materials_inputs = payload[3]['other_materials_inputs']
        
        if payload:
            try:
                new_data = Transaction.query.filter_by(id=int(id)).first().material[0]
                new_data.raw_materials = []
                new_data.finished_materials = []
                new_data.accessories_materials = []
                new_data.other_materials = []

                for key, item in enumerate(raw_inputs):
                    raw_mat = RawGoods.query.filter_by(
                        id=int(item['goods'])).first()
                    
                    qty = float(item['qty'])

                    new_data.raw_materials.append(
                        RawItem(raw_mat, qty))
            
                   
                for key, item in enumerate(finished_inputs):
                    finished_mat = FinishedGoods.query.filter_by(
                        id=int(item['goods'])).first()
                    
                    qty = float(item['qty'])

                    new_data.finished_materials.append(
                        FinishedItem(finished_mat, qty))

                   
                for key, item in enumerate(accessories_inputs):
                    accessories_mat = Accessories.query.filter_by(
                        id=int(item['goods'])).first()
                   
                    qty = float(item['qty'])

                    new_data.accessories_materials.append(
                        AccessoriesItem(accessories_mat, qty))

                   
                for key, item in enumerate(other_materials_inputs):
                    other_mat = OtherMaterials.query.filter_by(
                        id=int(item['goods'])).first()
                    
                    qty = float(item['qty'])

                    new_data.other_materials.append(
                        OtherMaterialsItem(other_mat, qty))
                db.session.commit()
                return jsonify({'success': 'Data updated' })

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



