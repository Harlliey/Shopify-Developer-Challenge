from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from util import *
from datetime import datetime
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///logistics.db'
db = SQLAlchemy(app)


class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False)
    count = db.Column(db.Integer, nullable=False)
    inv_id = db.Column(db.Integer, nullable=False)
    staff = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text)
    country = db.Column(db.String(100), nullable=False)
    region = db.Column(db.String(100), nullable=False)
    create_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    modified_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    deleted = db.Column(db.Integer, nullable=False, default=0)
    comments = db.Column(db.Text)


@app.route('/')
def hello_world():  # put application's code here
    return render_template('index.html')


@app.route('/create_inventory', methods=['POST'])
def create_inventory():
    data = request.form
    name = data['name']
    count = data['count']
    inv_id = data['id']
    staff = data['staff']
    desc = data['desc']
    country = data['country']
    region = data['region']

    duplicated_id = Inventory.query.filter_by(inv_id=int(inv_id)).first()

    # doublecheck the input validity
    if inventory_checker(name, count, inv_id, staff, country, region) is False:
        return jsonify(data='Invalid Input!', status=400)
    elif duplicated_id is not None:
        return jsonify(data='Duplicated inventory id!', status=400)
    else:
        # print(name + " " + count + " " + inv_id + " " + staff + " " + desc + " " + country + " " + region)
        inventory = Inventory(name=name, count=int(count), inv_id=int(inv_id), staff=staff, description=desc,
                              country=country,
                              region=region, create_time=datetime.now(), modified_time=datetime.now())
        db.session.add(inventory)
        db.session.commit()
        return jsonify(data='Success', status=200)


@app.route('/query_inventories', methods=['GET'])
def query_inventory():
    inventories = Inventory.query.filter_by(deleted=0)
    inv_json_list = [dump(i) for i in inventories]
    return jsonify(data=inv_json_list, status=200)


@app.route('/update_inventory', methods=['POST'])
def update_inventory():
    data = request.form
    iid = data['id']
    name = data['name']
    count = data['count']
    inv_id = data['inv_id']
    staff = data['staff']
    desc = data['desc']

    if inventory_checker(name, count, inv_id, staff) is False:
        return jsonify(data='Invalid Input!', status=400)
    else:
        inventory = Inventory.query.filter_by(id=int(iid)).first()
        if inventory is not None:
            inventory.name = name
            inventory.count = count
            inventory.inv_id = inv_id
            inventory.staff = staff
            inventory.description = desc
            inventory.modified_time = datetime.now()

            db.session.commit()
            return jsonify(data='Success', status=200)
        else:
            return jsonify(data='No such inventory in database!', status=400)


@app.route('/delete_inventory', methods=['POST'])
def delete_inventory():
    data = request.form
    iid = data['id']
    comments = data['comments']
    if inventory_checker(iid=iid) is False:
        return jsonify(data='Invalid Input!', status=400)
    else:
        inventory = Inventory.query.filter_by(id=int(iid)).first()
        if inventory is not None:
            inventory.deleted = 1
            inventory.comments = comments
            db.session.commit()
            return jsonify(data='Success', status=200)
        else:
            return jsonify(data='No such inventory in database!', status=400)


@app.route('/query_deleted_inventories', methods=['GET'])
def query_deleted_inventories():
    inventories = Inventory.query.filter_by(deleted=1)
    inv_json_list = [dump(i) for i in inventories]
    return jsonify(data=inv_json_list, status=200)


@app.route('/recover_deletion/<iid>', methods=['GET'])
def recover_deletion(iid):
    if inventory_checker(iid=iid) is False:
        return jsonify(data='Invalid Input!', status=400)
    else:
        inventory = Inventory.query.filter_by(id=int(iid)).first()
        if inventory is not None:
            inventory.deleted = 0
            db.session.commit()
            return jsonify(data='Success', status=200)
        else:
            return jsonify(data='No such inventory in database!', status=400)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
