from app import db
from app import ma
from datetime import datetime
from marshmallow_sqlalchemy import field_for
from marshmallow import fields
from app.basic_master.model import Department , DepartmentSchema , LocationSchema , Location ,Uom , UomSchema  , ProductCategory , ProductCategorySchema , Leader , LeaderSchema
from app.main_master.model import RawGoods, RawGoodsSchema, FinishedGoods \
    , FinishedGoodsSchema , Accessories , AccessoriesSchema , OtherMaterials , OtherMaterialsSchema


class TimestampMixin(object):
    created = db.Column(
        db.DateTime,  default=datetime.utcnow)
    updated = db.Column(db.DateTime, onupdate=datetime.utcnow)

base = db.Model


# Production Basic

class ProductionBasic( base):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False)
    days = db.Column(db.Integer, nullable=False)
    finished_product_category = db.relationship("ProductCategory",
                                 cascade="all, delete",
                                 backref="production_category" , secondary ="production_category")
    desc = db.Column(db.String(250), nullable=False)
    qty = db.Column(db.Integer, nullable=False)
    sample = db.Column(db.String(10), nullable=False)
    chart = db.Column(db.String(500), nullable=False)
    upload_folder = db.Column(db.String(250))
    flag = db.Column(db.String(15), default="draft")
    team_leader = db.relationship("Leader",
                                cascade="all, delete",
                                backref="production_leader" , secondary ="production_leader")
    team_members = db.Column(db.String(250) , default=None)
    production_id = db.Column(db.Integer , db.ForeignKey('production.id' , ondelete="CASCADE"))

    def __init__(self, start_date, days, finished_product_category, desc, team_leader, team_members , qty , sample , chart):
        self.start_date = start_date
        self.days = days
        self.finished_product_category.append(finished_product_category)
        self.desc = desc
        self.team_leader.append(team_leader)
        self.team_members = team_members
        self.qty= qty
        self.sample = sample
        self.chart = chart

db.Table('production_category',
         db.Column('production_basic_id', db.Integer, db.ForeignKey('production_basic.id', ondelete='SET NULL')),
         db.Column('product_category_id', db.Integer, db.ForeignKey('product_category.id', ondelete='SET NULL'))
         )
db.Table('production_leader',
         db.Column('production_basic_id', db.Integer, db.ForeignKey('production_basic.id', ondelete='SET NULL')),
         db.Column('leader_id', db.Integer, db.ForeignKey('leader.id', ondelete='SET NULL'))
         )

class ProductionBasicSchema(ma.ModelSchema):
    id = field_for(ProductionBasic, 'id', dump_only=True)
    start_date = field_for(ProductionBasic, 'start_date', dump_only=True)
    days = field_for(ProductionBasic, 'days', dump_only=True)
    finished_product_category = ma.Nested(ProductCategorySchema , many=True)
    desc = field_for(ProductionBasic, 'desc', dump_only=True)
    upload_folder = field_for(ProductionBasic, 'upload_folder', dump_only=True)
    flag = field_for(ProductionBasic, 'flag', dump_only=True)
    team_leader = ma.Nested(LeaderSchema , many=True)
    team_members = field_for(ProductionBasic, 'team_members', dump_only=True)
    qty = field_for(ProductionBasic, 'qty', dump_only=True)
    sample = field_for(ProductionBasic, 'sample', dump_only=True)
    chart = field_for(ProductionBasic, 'chart', dump_only=True)
   
    class meta:
        model = ProductionBasic
        

# Production Activity

class ProductionActivity(base):
    id = db.Column(db.Integer, primary_key=True)
    task_items_act = db.relationship("ProdTaskItemAct",
                                 cascade="all, delete",
                                 backref="production_activity")
    production_id = db.Column(db.Integer , db.ForeignKey('production.id' , ondelete="CASCADE")  )

        


class ProdTaskItemAct(base):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer)
    production_activity_id = db.Column(db.Integer,
                                db.ForeignKey('production_activity.id', ondelete='SET NULL'))
    department = db.relationship(Department,  secondary='prod_task_department_act',
                               backref='prod_task_department_act', cascade='all ,delete', lazy='joined')
    location = db.relationship(Location, secondary='prod_task_location_act',
                               backref='prod_task_location_act', cascade='all ,delete', lazy='joined')
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

    activity = db.relationship(ProductionActivity, lazy="joined")

db.Table('prod_task_department_act',
         db.Column('task_id', db.Integer, db.ForeignKey('prod_task_item_act.id', ondelete='SET NULL')),
         db.Column('department_id', db.Integer, db.ForeignKey('department.id', ondelete='SET NULL'))
         )

db.Table('prod_task_location_act',
         db.Column('task_id', db.Integer, db.ForeignKey('prod_task_item_act.id', ondelete='SET NULL')),
         db.Column('location_id', db.Integer, db.ForeignKey('location.id', ondelete='SET NULL'))
         )

class ProdTaskItemActSchema(ma.ModelSchema):
    id = field_for(ProdTaskItemAct, 'id', dump_only=True)
    task_id = field_for(ProdTaskItemAct, 'task_id', dump_only=True)
    days = field_for(ProdTaskItemAct, 'days', dump_only=True)
    flag = field_for(ProdTaskItemAct, 'flag', dump_only=True)
    name = field_for(ProdTaskItemAct, 'name', dump_only=True)
    remarks= field_for(ProdTaskItemAct, 'remarks', dump_only=True)
    depends_on = field_for(ProdTaskItemAct, 'depends_on', dump_only=True)
    start_date= field_for(ProdTaskItemAct, 'start_date', dump_only=True)
    end_date= field_for(ProdTaskItemAct, 'end_date', dump_only=True)
    department = ma.Nested(DepartmentSchema ,  many=True)
    location = ma.Nested(LocationSchema ,  many=True)

    class meta:
        model = ProdTaskItemAct

class ProductionActivitySchema(ma.ModelSchema):
    id = field_for(ProductionActivity, 'id', dump_only=True)
    task_items_act = ma.Nested(ProdTaskItemActSchema ,  many=True)

    class meta:
        model = ProductionActivity


class ProductionMaterials(base):
    id = db.Column(db.Integer, primary_key=True)
    finished_materials = db.relationship("ProdFinishedItem",
                                 cascade="all, delete",
                                 backref="production_materials_finished")
    raw_materials = db.relationship("ProdRawItem",
                                 cascade="all, delete",
                                 backref="production_materials_raw")
    accessories_materials = db.relationship("ProdAccessoriesItem",
                                 cascade="all, delete",
                                 backref="production_materials_accessories")
    other_materials = db.relationship("ProdOtherMaterialsItem",
                                 cascade="all, delete",
                                 backref="production_materials_other")
                                 
    production_id = db.Column(db.Integer , db.ForeignKey('production.id' , ondelete="CASCADE"))





class ProdFinishedItem(base):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    production_materials_id = db.Column(db.Integer,
                                db.ForeignKey('production_materials.id', ondelete='SET NULL'))
    finished_mat = db.relationship(FinishedGoods,  secondary='prod_finished_mat',
                               backref='prod_finished_mat', cascade='all ,delete', lazy='joined')
    quantity = db.Column(db.Float , nullable = False , default = 1)


    def __init__(self, prod_finished_mat , quantity):
        self.finished_mat.append(finished_mat)
        self.quantity = quantity

    material = db.relationship(ProductionMaterials, lazy="joined")

db.Table('prod_finished_mat',
         db.Column('item_id', db.Integer, db.ForeignKey('prod_finished_item.id', ondelete='SET NULL')),
         db.Column('finished_goods_id', db.Integer, db.ForeignKey('finished_goods.id', ondelete='SET NULL'))
         )



class ProdAccessoriesItem(base):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    production_materials_id = db.Column(db.Integer,
                                db.ForeignKey('production_materials.id', ondelete='SET NULL'))
    accessories_mat = db.relationship(Accessories,  secondary='prod_accessories_mat',
                               backref='prod_accessories_mat', cascade='all ,delete', lazy='joined')
    quantity = db.Column(db.Float , nullable = False , default = 1)


    def __init__(self, accessories_mat , quantity):
        self.accessories_mat.append(accessories_mat)
        self.quantity = quantity

    material = db.relationship(ProductionMaterials, lazy="joined")

db.Table('prod_accessories_mat',
         db.Column('item_id', db.Integer, db.ForeignKey('prod_accessories_item.id', ondelete='SET NULL')),
         db.Column('accessories_id', db.Integer, db.ForeignKey('accessories.id', ondelete='SET NULL'))
         )


class ProdOtherMaterialsItem(base):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    production_materials_id = db.Column(db.Integer,
                                db.ForeignKey('production_materials.id', ondelete='SET NULL'))
    other_mat = db.relationship(OtherMaterials,  secondary='prod_other_mat',
                               backref='prod_other_mat', cascade='all ,delete', lazy='joined')
    
    quantity = db.Column(db.Float , nullable = False , default = 1)


    def __init__(self, other_mat , quantity):
        self.other_mat.append(other_mat)
        self.quantity = quantity

    material = db.relationship(ProductionMaterials, lazy="joined")

db.Table('prod_other_mat',
         db.Column('item_id', db.Integer, db.ForeignKey('prod_other_materials_item.id', ondelete='SET NULL')),
         db.Column('other_materials_id', db.Integer, db.ForeignKey('other_materials.id', ondelete='SET NULL'))
         )


class ProdRawItem(base):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    production_materials_id = db.Column(db.Integer,
                                db.ForeignKey('production_materials.id', ondelete='SET NULL'))
    raw_mat = db.relationship(RawGoods,  secondary='prod_raw_mat',
                               backref='prod_raw_mat', cascade='all ,delete', lazy='joined')
    quantity = db.Column(db.Float , nullable = False , default = 1)


    def __init__(self, raw_mat , quantity):
        self.raw_mat.append(raw_mat)
        self.quantity = quantity

    material = db.relationship(ProductionMaterials, lazy="joined")

db.Table('prod_raw_mat',
         db.Column('item_id', db.Integer, db.ForeignKey('prod_raw_item.id', ondelete='SET NULL')),
         db.Column('raw_goods_id', db.Integer, db.ForeignKey('raw_goods.id', ondelete='SET NULL'))
         )


class ProdRawItemSchema(ma.ModelSchema):
    id = field_for(ProdRawItem, 'id', dump_only=True)
    
    quantity = field_for(ProdRawItem, 'quantity', dump_only=True)
    raw_mat = ma.Nested(RawGoodsSchema ,  many=True)
    
    class meta:
        model = ProdRawItem






class ProdFinishedItemSchema(ma.ModelSchema):
    id = field_for(ProdFinishedItem, 'id', dump_only=True)
    
    quantity = field_for(ProdFinishedItem, 'quantity', dump_only=True)
    finished_mat = ma.Nested(FinishedGoodsSchema ,  many=True)
    
    class meta:
        model = ProdFinishedItem




class ProdAccessoriesItemSchema(ma.ModelSchema):
    id = field_for(ProdAccessoriesItem, 'id', dump_only=True)
    
    quantity = field_for(ProdAccessoriesItem, 'quantity', dump_only=True)
    accessories_mat = ma.Nested(AccessoriesSchema ,  many=True)
    
    class meta:
        model = ProdAccessoriesItem





class ProdOtherMaterialsItemSchema(ma.ModelSchema):
    id = field_for(ProdOtherMaterialsItem, 'id', dump_only=True)
    
    quantity = field_for(ProdOtherMaterialsItem, 'quantity', dump_only=True)
    other_mat = ma.Nested(OtherMaterialsSchema ,  many=True)
    
    class meta:
        model = ProdOtherMaterialsItem




class ProductionMaterialsSchema(ma.ModelSchema):
    id = field_for(ProductionMaterials, 'id', dump_only=True)
    
    finished_materials = ma.Nested(ProdFinishedItemSchema ,  many=True)
    raw_materials = ma.Nested(ProdRawItemSchema ,  many=True)
    accessories_materials = ma.Nested(ProdAccessoriesItemSchema ,  many=True )
    other_materials = ma.Nested(ProdOtherMaterialsItemSchema, many=True)

    class meta:
        model = ProductionMaterials


class Production(base):
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    basic = db.relationship('ProductionBasic' , backref="production" , cascade='all ,delete')
    activity = db.relationship('ProductionActivity' , backref="production" , cascade='all ,delete')
    material = db.relationship('ProductionMaterials', backref="production" ,  cascade='all ,delete')
    flag = db.Column(db.String(15), default="wip")
    date = db.Column(db.Date,  default = None)
    finished_goods_code = db.Column(db.String(250) , default = None, unique=True)
    quantity = db.Column(db.Float , default = None)
    report = db.Column(db.String(1000), default = None)
    image= db.Column(db.String(250) , default = None)


class ProductionSchema(ma.ModelSchema):
    id = field_for(Production, 'id', dump_only=True)
    
    basic = ma.Nested(ProductionBasicSchema ,  many=True)
    activity = ma.Nested(ProductionActivitySchema ,  many=True)
    materials = ma.Nested(ProductionMaterialsSchema , many=True )
    flag =  field_for(Production, 'flag', dump_only=True)
    date =  field_for(Production, 'date', dump_only=True)
    finished_goods_code =  field_for(Production, 'finished_goods_code', dump_only=True)
    quantity =  field_for(Production, 'quantity', dump_only=True)
    report =  field_for(Production, 'report', dump_only=True)
    image =  field_for(Production, 'image', dump_only=True)
  

    class meta:
        model = Production
class ProductionReportSchema(ma.ModelSchema):
    id = field_for(Production, 'id', dump_only=True)
  
    flag =  field_for(Production, 'flag', dump_only=True)
    date =  field_for(Production, 'date', dump_only=True)
    finished_goods_code =  field_for(Production, 'finished_goods_code', dump_only=True)
    quantity =  field_for(Production, 'quantity', dump_only=True)
    report =  field_for(Production, 'report', dump_only=True)
    image =  field_for(Production, 'image', dump_only=True)
  

    class meta:
        model = Production



