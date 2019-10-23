from app import db
from app import ma
from datetime import datetime
from app.basic_master.model import ProductCategorySchema, FabricCombinationSchema, DesignNumberSchema,  PrintTechniqueSchema, UomSchema
from app.basic_master.model import YarnSchema, FabricProcessSchema, FabricWidthSchema,  PrintTechniqueSchema, RawMaterialCategorySchema, FabricConstructionSchema, FabricDyeSchema
from marshmallow_sqlalchemy import field_for
from marshmallow import fields


#  Finished Goods Model
class FinishedGoods(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_category = db.relationship(
        'ProductCategory', cascade="all,delete", secondary='product_category_goods', backref='product_category_goods', lazy='joined')
    fabric_combination = db.relationship(
        'FabricCombination', cascade="all,delete", secondary='fabric_combination_goods', backref='fabric_combination_goods', lazy='joined')
    print_technique = db.relationship(
        'PrintTechnique', cascade="all,delete", secondary='print_technique_goods', backref='print_technique_goods', lazy='joined')
    design_number = db.relationship(
        'DesignNumber', cascade="all,delete", secondary='design_number_goods', backref='design_number_goods', lazy='joined')
    uom = db.relationship('Uom', cascade="all,delete",
                          secondary='uom_goods', backref='uom_goods', lazy='joined')

    alt_name = db.Column(db.String(100), default=None)
    product_category_id = db.Column(db.Integer, nullable=False)
    fabric_combination_id = db.Column(db.Integer, nullable=False)
    print_technique_id = db.Column(db.Integer, nullable=False)
    design_number_id = db.Column(db.Integer, nullable=False)
    uom_id = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(250))

    __table_args__ = (db.UniqueConstraint(
        'product_category_id', 'fabric_combination_id', 'print_technique_id', 'design_number_id', name='finished_goods_id'), )

    def __init__(self, alt_name, product_category_id, fabric_combination_id, print_technique_id, design_number_id, uom_id):
        self.alt_name = alt_name
        self.product_category_id = product_category_id
        self.fabric_combination_id = fabric_combination_id
        self.print_technique_id = print_technique_id
        self.design_number_id = design_number_id
        self.uom_id = uom_id

    def get_goods_name(self):
        product_category = self.product_category
        fabric_combination = self.fabric_combo
        print_technique = self.print_technique
        design_number = self.design_number
        uom = self.uom
        goods_name = "{} - {} - {} - {}".format(
            product_category[0].name, fabric_combination[0].name, print_technique[0].name, design_number[0].name)
        return goods_name


db.Table('product_category_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('product_category_id', db.Integer, db.ForeignKey(
             'product_category.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'finished_goods.id', ondelete='SET NULL'))
         )

db.Table('fabric_combination_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('fabric_combination_id', db.Integer, db.ForeignKey(
             'fabric_combination.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'finished_goods.id', ondelete='SET NULL'))
         )
db.Table('print_technique_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('print_technique_id', db.Integer, db.ForeignKey(
             'print_technique.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'finished_goods.id', ondelete='SET NULL'))
         )
db.Table('design_number_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('design_number_id', db.Integer, db.ForeignKey(
             'design_number.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'finished_goods.id', ondelete='SET NULL'))
         )
db.Table('uom_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('uom_id', db.Integer, db.ForeignKey(
             'uom.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'finished_goods.id', ondelete='SET NULL'))
         )


class FinishedGoodsSchema(ma.ModelSchema):
    id = field_for(FinishedGoods, 'id', dump_only=True)
    alt_name = field_for(FinishedGoods, 'alt_name', dump_only=True)
    product_category = ma.Nested(ProductCategorySchema, many=True)
    fabric_combination = ma.Nested(FabricCombinationSchema, many=True)
    print_technique = ma.Nested(PrintTechniqueSchema, many=True)
    design_number = ma.Nested(DesignNumberSchema, many=True)
    uom = ma.Nested(UomSchema, many=True)
    image = field_for(FinishedGoods, 'image', dump_only=True)
    gen_name = fields.Method("get_goods_name")

    def get_goods_name(self , obj):
        goods_name = "{} - {} - {} - {}".format(
            obj.product_category[0].name, obj.fabric_combination[0].name, obj.print_technique[0].name, obj.design_number[0].name)
        return goods_name
    class meta:
        model = FinishedGoods


# Raw Material Goods Model

class RawGoods(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    yarn = db.relationship(
        'Yarn', cascade="all,delete", secondary='yarn_goods', backref='yarn_goods', lazy='joined')
    fabric_process = db.relationship(
        'FabricProcess', cascade="all,delete", secondary='fabric_process_goods', backref='fabric_process_goods', lazy='joined')
    fabric_width = db.relationship(
        'FabricWidth', cascade="all,delete", secondary='fabric_width_goods', backref='fabric_width_goods', lazy='joined')
    fabric_dye = db.relationship(
        'FabricDye', cascade="all,delete", secondary='fabric_dye_goods', backref='fabric_dye_goods', lazy='joined')
    raw_material_category = db.relationship(
        'RawMaterialCategory', cascade="all,delete", secondary='raw_material_category_goods', backref='raw_material_category_goods', lazy='joined')
    fabric_construction = db.relationship('FabricConstruction', cascade="all,delete",
                                          secondary='fabric_construction_goods', backref='fabric_construction_goods', lazy='joined')

    alt_name = db.Column(db.String(100), default=None)
    yarn_id = db.Column(db.Integer, nullable=False)
    fabric_process_id = db.Column(db.Integer, nullable=False)
    fabric_width_id = db.Column(db.Integer, nullable=False)
    fabric_dye_id = db.Column(db.Integer, nullable=False)
    raw_material_category_id = db.Column(db.Integer, nullable=False)
    fabric_construction_id = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(250))

    __table_args__ = (db.UniqueConstraint(
        'yarn_id', 'fabric_process_id', 'fabric_width_id', 'fabric_dye_id', 'raw_material_category_id', 'fabric_construction_id',  name='raw_goods_id'), )

    def __init__(self, alt_name, yarn_id, fabric_process_id, fabric_width_id, fabric_dye_id, raw_material_category_id, fabric_construction_id):
        self.alt_name = alt_name
        self.yarn_id = yarn_id
        self.fabric_process_id = fabric_process_id
        self.fabric_width_id = fabric_width_id
        self.fabric_dye_id = fabric_dye_id
        self.raw_material_category_id = raw_material_category_id
        self.fabric_construction_id = fabric_construction_id

    # def get_goods_name(self):
    #     yarn = self.yarn
    #     fabric_combination = self.fabric_combo
    #     print_technique = self.print_technique
    #     design_number = self.design_number
    #     uom = self.uom
    #     goods_name = "{} - {} - {} - {}".format(
    #         product_category[0].name, fabric_combination[0].name, print_technique[0].name, design_number[0].name)
    #     return goods_name


db.Table('yarn_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('yarn_id', db.Integer, db.ForeignKey(
             'yarn.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'raw_goods.id', ondelete='SET NULL'))
         )

db.Table('fabric_process_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('fabric_process_id', db.Integer, db.ForeignKey(
             'fabric_process.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'raw_goods.id', ondelete='SET NULL'))
         )

db.Table('fabric_width_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('fabric_width_id', db.Integer, db.ForeignKey(
             'fabric_width.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'raw_goods.id', ondelete='SET NULL'))
         )
db.Table('fabric_dye_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('fabric_dye_id', db.Integer, db.ForeignKey(
             'fabric_dye.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'raw_goods.id', ondelete='SET NULL'))
         )

db.Table('raw_material_category_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('raw_material_category_id', db.Integer, db.ForeignKey(
             'raw_material_category.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'raw_goods.id', ondelete='SET NULL'))
         )

db.Table('fabric_construction_goods',
         db.Column('id', db.Integer, primary_key=True),
         db.Column('fabric_construction_id', db.Integer, db.ForeignKey(
             'fabric_construction.id', ondelete='SET NULL')),
         db.Column('goods_id', db.Integer, db.ForeignKey(
             'raw_goods.id', ondelete='SET NULL'))
         )


class RawGoodsSchema(ma.ModelSchema):
    id = field_for(RawGoods, 'id', dump_only=True)
    alt_name = field_for(RawGoods, 'alt_name', dump_only=True)
    yarn = ma.Nested(YarnSchema, many=True)
    fabric_process = ma.Nested(FabricProcessSchema, many=True)
    fabric_width = ma.Nested(FabricWidthSchema, many=True)
    fabric_dye = ma.Nested(FabricDyeSchema, many=True)
    raw_material_category = ma.Nested(RawMaterialCategorySchema, many=True)
    fabric_construction = ma.Nested(FabricConstructionSchema, many=True)
    image = field_for(RawGoods, 'image', dump_only=True)
    gen_name = fields.Method("get_goods_name")


    def get_goods_name(self , obj):
        goods_name = "{} - {} - {} - {} - {} - {}".format(
            obj.yarn[0].name, obj.fabric_process[0].name, obj.fabric_width[0].name, obj.fabric_dye[0].name, obj.raw_material_category[0].name, obj.fabric_construction[0].name)
        return goods_name

    class meta:
        model = RawGoods


class Accessories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)
    desc = db.Column(db.String(100))
    image = db.Column(db.String(250))

    def __init__(self, name, desc):
        self.name = name
        self.desc = desc


class AccessoriesSchema(ma.ModelSchema):
    id = field_for(Accessories, 'id', dump_only=True)
    name = field_for(Accessories, 'name', dump_only=True)
    desc = field_for(Accessories, 'desc', dump_only=True)
    image = field_for(Accessories, 'image', dump_only=True)

    class meta:
        model = Accessories


class OtherMaterials(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)
    desc = db.Column(db.String(100))
    image = db.Column(db.String(250))

    def __init__(self, name, desc):
        self.name = name
        self.desc = desc


class OtherMaterialsSchema(ma.ModelSchema):
    id = field_for(OtherMaterials, 'id', dump_only=True)
    name = field_for(OtherMaterials, 'name', dump_only=True)
    desc = field_for(OtherMaterials, 'desc', dump_only=True)
    image = field_for(OtherMaterials, 'image', dump_only=True)

    class meta:
        model = OtherMaterials
