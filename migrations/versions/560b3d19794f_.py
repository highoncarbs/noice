"""empty message

Revision ID: 560b3d19794f
Revises: 49dfb4ad9be4
Create Date: 2019-11-25 18:29:45.950619

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '560b3d19794f'
down_revision = '49dfb4ad9be4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('transaction_category', sa.Column('product_category_id', sa.Integer(), nullable=True))
    op.drop_constraint('transaction_category_ibfk_2', 'transaction_category', type_='foreignkey')
    op.create_foreign_key(None, 'transaction_category', 'product_category', ['product_category_id'], ['id'], ondelete='SET NULL')
    op.drop_column('transaction_category', 'finished_goods_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('transaction_category', sa.Column('finished_goods_id', mysql.INTEGER(display_width=11), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'transaction_category', type_='foreignkey')
    op.create_foreign_key('transaction_category_ibfk_2', 'transaction_category', 'finished_goods', ['finished_goods_id'], ['id'], ondelete='SET NULL')
    op.drop_column('transaction_category', 'product_category_id')
    # ### end Alembic commands ###
