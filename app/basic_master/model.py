from app import db
from app import ma
from datetime import datetime

from marshmallow_sqlalchemy import field_for


class ProductCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class ProductCategorySchema(ma.ModelSchema):
    class Meta:
        model = ProductCategory


class FabricCombination(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class FabricCombinationSchema(ma.ModelSchema):
    class Meta:
        model = FabricCombination


class PrintTechnique(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class PrintTechniqueSchema(ma.ModelSchema):
    class Meta:
        model = FabricCombination


class DesignNumber(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class DesignNumberSchema(ma.ModelSchema):
    class Meta:
        model = FabricCombination


class SizeMaster(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class SizeMasterSchema(ma.ModelSchema):
    class Meta:
        model = FabricCombination


# Raw Materials Master

class Yarn(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class YarnSchema(ma.ModelSchema):
    class Meta:
        model = Yarn


class FabricProcess(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class FabricProcessSchema(ma.ModelSchema):
    class Meta:
        model = FabricProcess


class FabricWidth(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class FabricWidthSchema(ma.ModelSchema):
    class Meta:
        model = FabricWidth


class FabricDye(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class FabricDyeSchema(ma.ModelSchema):
    class Meta:
        model = FabricDye


class RawMaterialCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class RawMaterialCategorySchema(ma.ModelSchema):
    class Meta:
        model = RawMaterialCategory


class FabricConstruction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class FabricConstructionSchema(ma.ModelSchema):
    class Meta:
        model = FabricConstruction


class Uom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class UomSchema(ma.ModelSchema):
    class Meta:
        model = Uom
