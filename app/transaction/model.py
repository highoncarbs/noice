from app import db
from app import ma
from datetime import datetime
from marshmallow_sqlalchemy import field_for
from marshmallow import fields
from app.basic_master.model import Department , DepartmentSchema , LocationSchema , Location ,Uom , UomSchema  , ProductCategory , ProductCategorySchema
from app.main_master.model import RawGoods, RawGoodsSchema, FinishedGoods \
    , FinishedGoodsSchema , Accessories , AccessoriesSchema , OtherMaterials , OtherMaterialsSchema

class TimestampMixin(object):
    created = db.Column(
        db.DateTime,  default=datetime.utcnow)
    updated = db.Column(db.DateTime, onupdate=datetime.utcnow)

base = db.Model


# Transaction Basic

class TransactionBasic( base):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False)
    days = db.Column(db.Integer, nullable=False)
    finished_product_category = db.relationship("ProductCategory",
                                 cascade="all, delete",
                                 backref="transaction_category" , secondary ="transaction_category")
    desc = db.Column(db.String(250), nullable=False)
    upload_folder = db.Column(db.String(250))
    flag = db.Column(db.String(15) , default="draft")
    team_leader =db.Column(db.String(250) , default= None)
    team_members = db.Column(db.String(250) , default=None)
    transaction_id = db.Column(db.Integer , db.ForeignKey('transaction.id' , ondelete="CASCADE"))

    def __init__(self, start_date, days, finished_product_category, desc, team_leader, team_members):
        self.start_date = start_date
        self.days = days
        self.finished_product_category.append(finished_product_category)
        self.desc = desc
        self.team_leader = team_leader
        self.team_members = team_members

db.Table('transaction_category',
         db.Column('transaction_basic_id', db.Integer, db.ForeignKey('transaction_basic.id', ondelete='SET NULL')),
         db.Column('product_category_id', db.Integer, db.ForeignKey('product_category.id', ondelete='SET NULL'))
         )

class TransactionBasicSchema(ma.ModelSchema):
    id = field_for(TransactionBasic, 'id', dump_only=True)
    start_date = field_for(TransactionBasic, 'start_date', dump_only=True)
    days = field_for(TransactionBasic, 'days', dump_only=True)
    finished_product_category = ma.Nested(ProductCategorySchema , many=True)
    desc = field_for(TransactionBasic, 'desc', dump_only=True)
    upload_folder = field_for(TransactionBasic, 'upload_folder', dump_only=True)
    flag = field_for(TransactionBasic, 'flag', dump_only=True)
    team_leader = field_for(TransactionBasic, 'team_leader', dump_only=True)
    team_members = field_for(TransactionBasic, 'team_members', dump_only=True)
   
    class meta:
        model = TransactionBasic
        

# Transaction Activity

class TransactionActivity(base):
    id = db.Column(db.Integer, primary_key=True)
    task_items_act = db.relationship("TaskItemAct",
                                 cascade="all, delete",
                                 backref="transaction_activity")
    transaction_id = db.Column(db.Integer , db.ForeignKey('transaction.id' , ondelete="CASCADE")  )

        


class TaskItemAct(base):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer)
    transaction_activity_id = db.Column(db.Integer,
                                db.ForeignKey('transaction_activity.id', ondelete='SET NULL'))
    department = db.relationship(Department,  secondary='task_department_act',
                               backref='task_department_act', cascade='all ,delete', lazy='joined')
    location = db.relationship(Location, secondary='task_location_act',
                               backref='task_location_act', cascade='all ,delete', lazy='joined')
    days = db.Column(db.Integer , nullable = False , default = 1)
    depends_on = db.Column(db.Integer, nullable=False, default=0)
    remarks = db.Column(db.String(250), default=None)
    name= db.Column(db.String(250), default=None , nullable=False)
    flag = db.Column(db.String(250), default="not", nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)



    def __init__(self, task_id , name , department , location ,days , depends_on , remarks , start_date , end_date , flag):
        self.task_id= task_id
        self.name= name
        self.depends_on= depends_on
        self.remarks= remarks
        self.department.append(department)
        self.location.append(location)
        self.days = days
        self.start_date =start_date
        self.end_date= end_date
        self.flag = flag

    activity = db.relationship(TransactionActivity, lazy="joined")

db.Table('task_department_act',
         db.Column('task_id', db.Integer, db.ForeignKey('task_item_act.id', ondelete='SET NULL')),
         db.Column('department_id', db.Integer, db.ForeignKey('department.id', ondelete='SET NULL'))
         )

db.Table('task_location_act',
         db.Column('task_id', db.Integer, db.ForeignKey('task_item_act.id', ondelete='SET NULL')),
         db.Column('location_id', db.Integer, db.ForeignKey('location.id', ondelete='SET NULL'))
         )

class TaskItemActSchema(ma.ModelSchema):
    id = field_for(TaskItemAct, 'id', dump_only=True)
    task_id = field_for(TaskItemAct, 'task_id', dump_only=True)
    days = field_for(TaskItemAct, 'days', dump_only=True)
    flag = field_for(TaskItemAct, 'flag', dump_only=True)
    name = field_for(TaskItemAct, 'name', dump_only=True)
    remarks= field_for(TaskItemAct, 'remarks', dump_only=True)
    depends_on = field_for(TaskItemAct, 'depends_on', dump_only=True)
    start_date= field_for(TaskItemAct, 'start_date', dump_only=True)
    end_date= field_for(TaskItemAct, 'end_date', dump_only=True)
    department = ma.Nested(DepartmentSchema ,  many=True)
    location = ma.Nested(LocationSchema ,  many=True)

    class meta:
        model = TaskItemAct

class TransactionActivitySchema(ma.ModelSchema):
    id = field_for(TransactionActivity, 'id', dump_only=True)
    task_items_act = ma.Nested(TaskItemActSchema ,  many=True)

    class meta:
        model = TransactionActivity


class TransactionMaterials(base):
    id = db.Column(db.Integer, primary_key=True)
    finished_materials = db.relationship("FinishedItem",
                                 cascade="all, delete",
                                 backref="transaction_materials_finished")
    raw_materials = db.relationship("RawItem",
                                 cascade="all, delete",
                                 backref="transaction_materials_raw")
    accessories_materials = db.relationship("AccessoriesItem",
                                 cascade="all, delete",
                                 backref="transaction_materials_accessories")
    other_materials = db.relationship("OtherMaterialsItem",
                                 cascade="all, delete",
                                 backref="transaction_materials_other")
                                 
    transaction_id = db.Column(db.Integer , db.ForeignKey('transaction.id' , ondelete="CASCADE"))





class FinishedItem(base):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    transaction_materials_id = db.Column(db.Integer,
                                db.ForeignKey('transaction_materials.id', ondelete='SET NULL'))
    finished_mat = db.relationship(FinishedGoods,  secondary='finished_mat',
                               backref='finished_mat', cascade='all ,delete', lazy='joined')
    uom = db.relationship(Uom,  secondary='finished_mat_uom',
                               backref='finished_mat_uom', cascade='all ,delete', lazy='joined')
    quantity = db.Column(db.Float , nullable = False , default = 1)


    def __init__(self, finished_mat , uom , quantity):
        self.finished_mat.append(finished_mat)
        self.uom.append(uom)
        self.quantity = quantity

    material = db.relationship(TransactionMaterials, lazy="joined")

db.Table('finished_mat',
         db.Column('item_id', db.Integer, db.ForeignKey('finished_item.id', ondelete='SET NULL')),
         db.Column('finished_goods_id', db.Integer, db.ForeignKey('finished_goods.id', ondelete='SET NULL'))
         )
db.Table('finished_mat_uom',
         db.Column('item_id', db.Integer, db.ForeignKey('finished_item.id', ondelete='SET NULL')),
         db.Column('finished_mat_uom_id', db.Integer, db.ForeignKey('uom.id', ondelete='SET NULL'))
         )



class AccessoriesItem(base):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    transaction_materials_id = db.Column(db.Integer,
                                db.ForeignKey('transaction_materials.id', ondelete='SET NULL'))
    accessories_mat = db.relationship(Accessories,  secondary='accessories_mat',
                               backref='accessories_mat', cascade='all ,delete', lazy='joined')
    uom = db.relationship(Uom,  secondary='accessories_mat_uom',
                               backref='accessories_mat_uom', cascade='all ,delete', lazy='joined')
    quantity = db.Column(db.Float , nullable = False , default = 1)


    def __init__(self, accessories_mat , uom , quantity):
        self.accessories_mat.append(accessories_mat)
        self.uom.append(uom)
        self.quantity = quantity

    material = db.relationship(TransactionMaterials, lazy="joined")

db.Table('accessories_mat',
         db.Column('item_id', db.Integer, db.ForeignKey('accessories_item.id', ondelete='SET NULL')),
         db.Column('accessories_id', db.Integer, db.ForeignKey('accessories.id', ondelete='SET NULL'))
         )
db.Table('accessories_mat_uom',
         db.Column('item_id', db.Integer, db.ForeignKey('accessories_item.id', ondelete='SET NULL')),
         db.Column('accessories_mat_uom_id', db.Integer, db.ForeignKey('uom.id', ondelete='SET NULL'))
         )



class OtherMaterialsItem(base):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    transaction_materials_id = db.Column(db.Integer,
                                db.ForeignKey('transaction_materials.id', ondelete='SET NULL'))
    other_mat = db.relationship(OtherMaterials,  secondary='other_mat',
                               backref='other_mat', cascade='all ,delete', lazy='joined')
    uom = db.relationship(Uom,  secondary='other_mat_uom',
                               backref='other_mat_uom', cascade='all ,delete', lazy='joined')
    quantity = db.Column(db.Float , nullable = False , default = 1)


    def __init__(self, other_mat , uom , quantity):
        self.other_mat.append(other_mat)
        self.uom.append(uom)
        self.quantity = quantity

    material = db.relationship(TransactionMaterials, lazy="joined")

db.Table('other_mat',
         db.Column('item_id', db.Integer, db.ForeignKey('other_materials_item.id', ondelete='SET NULL')),
         db.Column('other_materials_id', db.Integer, db.ForeignKey('other_materials.id', ondelete='SET NULL'))
         )
db.Table('other_mat_uom',
         db.Column('item_id', db.Integer, db.ForeignKey('other_materials_item.id', ondelete='SET NULL')),
         db.Column('other_mat_uom_id', db.Integer, db.ForeignKey('uom.id', ondelete='SET NULL'))
         )


class RawItem(base):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    transaction_materials_id = db.Column(db.Integer,
                                db.ForeignKey('transaction_materials.id', ondelete='SET NULL'))
    raw_mat = db.relationship(RawGoods,  secondary='raw_mat',
                               backref='raw_mat', cascade='all ,delete', lazy='joined')
    uom = db.relationship(Uom,  secondary='raw_mat_uom',
                               backref='raw_mat_uom', cascade='all ,delete', lazy='joined')
    quantity = db.Column(db.Float , nullable = False , default = 1)


    def __init__(self, raw_mat , uom , quantity):
        self.raw_mat.append(raw_mat)
        self.uom.append(uom)
        self.quantity = quantity

    material = db.relationship(TransactionMaterials, lazy="joined")

db.Table('raw_mat',
         db.Column('item_id', db.Integer, db.ForeignKey('raw_item.id', ondelete='SET NULL')),
         db.Column('raw_goods_id', db.Integer, db.ForeignKey('raw_goods.id', ondelete='SET NULL'))
         )
db.Table('raw_mat_uom',
         db.Column('item_id', db.Integer, db.ForeignKey('raw_item.id', ondelete='SET NULL')),
         db.Column('raw_mat_uom_id', db.Integer, db.ForeignKey('uom.id', ondelete='SET NULL'))
         )


class RawItemSchema(ma.ModelSchema):
    id = field_for(RawItem, 'id', dump_only=True)
    
    quantity = field_for(RawItem, 'quantity', dump_only=True)
    raw_mat = ma.Nested(RawGoodsSchema ,  many=True)
    uom = ma.Nested(UomSchema ,  many=True)

    class meta:
        model = RawItem






class FinishedItemSchema(ma.ModelSchema):
    id = field_for(FinishedItem, 'id', dump_only=True)
    
    quantity = field_for(FinishedItem, 'quantity', dump_only=True)
    finished_mat = ma.Nested(FinishedGoodsSchema ,  many=True)
    uom = ma.Nested(UomSchema ,  many=True)

    class meta:
        model = FinishedItem




class AccessoriesItemSchema(ma.ModelSchema):
    id = field_for(AccessoriesItem, 'id', dump_only=True)
    
    quantity = field_for(AccessoriesItem, 'quantity', dump_only=True)
    accessories_mat = ma.Nested(AccessoriesSchema ,  many=True)
    uom = ma.Nested(UomSchema ,  many=True)

    class meta:
        model = AccessoriesItem





class OtherMaterialsItemSchema(ma.ModelSchema):
    id = field_for(OtherMaterialsItem, 'id', dump_only=True)
    
    quantity = field_for(OtherMaterialsItem, 'quantity', dump_only=True)
    other_mat = ma.Nested(OtherMaterialsSchema ,  many=True)
    uom = ma.Nested(UomSchema ,  many=True)

    class meta:
        model = OtherMaterialsItem




class TransactionMaterialsSchema(ma.ModelSchema):
    id = field_for(TransactionMaterials, 'id', dump_only=True)
    
    finished_materials = ma.Nested(FinishedItemSchema ,  many=True)
    raw_materials = ma.Nested(RawItemSchema ,  many=True)
    accessories = ma.Nested(AccessoriesItemSchema ,  many=True)
    other_materials = ma.Nested(OtherMaterialsItemSchema, many=True)
    transaction_id = db.Column(db.Integer , db.ForeignKey('transaction.id' , ondelete="CASCADE"))

    class meta:
        model = TransactionMaterials


class Transaction(base):
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    basic = db.relationship('TransactionBasic' , backref="transaction" , cascade='all ,delete')
    activity = db.relationship('TransactionActivity' , backref="transaction" , cascade='all ,delete')
    material = db.relationship('TransactionMaterials', backref="transaction" ,  cascade='all ,delete')
    flag = db.Column(db.String(15), default="wip")
    date = db.Column(db.Date,  default = None)
    finished_goods_code = db.Column(db.String(250) , default = None, unique=True)
    quantity = db.Column(db.Float , default = None)
    report = db.Column(db.String(1000), default = None)
    image= db.Column(db.String(250) , default = None)


class TransactionSchema(ma.ModelSchema):
    id = field_for(Transaction, 'id', dump_only=True)
    
    basic = ma.Nested(TransactionBasicSchema ,  many=True)
    activity = ma.Nested(TransactionActivitySchema ,  many=True)
    materials = ma.Nested(TransactionMaterialsSchema )
    flag =  field_for(Transaction, 'flag', dump_only=True)
    date =  field_for(Transaction, 'date', dump_only=True)
    finished_goods_code =  field_for(Transaction, 'finished_goods_code', dump_only=True)
    quantity =  field_for(Transaction, 'quantity', dump_only=True)
    report =  field_for(Transaction, 'report', dump_only=True)
    image =  field_for(Transaction, 'image', dump_only=True)
  

    class meta:
        model = Transaction
class TransactionReportSchema(ma.ModelSchema):
    id = field_for(Transaction, 'id', dump_only=True)
  
    flag =  field_for(Transaction, 'flag', dump_only=True)
    date =  field_for(Transaction, 'date', dump_only=True)
    finished_goods_code =  field_for(Transaction, 'finished_goods_code', dump_only=True)
    quantity =  field_for(Transaction, 'quantity', dump_only=True)
    report =  field_for(Transaction, 'report', dump_only=True)
    image =  field_for(Transaction, 'image', dump_only=True)
  

    class meta:
        model = Transaction



