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
