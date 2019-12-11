"""empty message

Revision ID: 710b003cb4e7
Revises: 2626b8809435
Create Date: 2019-12-11 12:43:02.715895

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '710b003cb4e7'
down_revision = '2626b8809435'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('acc_id', 'accessories', ['name', 'desc'])
    op.drop_index('desc', table_name='accessories')
    op.drop_index('name', table_name='accessories')
    op.create_unique_constraint('oth_mat_id', 'other_materials', ['name', 'desc'])
    op.drop_index('desc', table_name='other_materials')
    op.drop_index('name', table_name='other_materials')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('name', 'other_materials', ['name'], unique=True)
    op.create_index('desc', 'other_materials', ['desc'], unique=True)
    op.drop_constraint('oth_mat_id', 'other_materials', type_='unique')
    op.create_index('name', 'accessories', ['name'], unique=True)
    op.create_index('desc', 'accessories', ['desc'], unique=True)
    op.drop_constraint('acc_id', 'accessories', type_='unique')
    # ### end Alembic commands ###