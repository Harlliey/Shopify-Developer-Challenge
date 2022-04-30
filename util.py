# input checker
def inventory_checker(name='Harry', count='1', inv_id='1', staff='Jack', country='United States of America',
                      region='Texas', iid='0'):
    if name == '' or count == '' or id == '' or staff is None or country == '' or region == '':
        return False
    elif not str(iid).isnumeric() or not str(count).isnumeric() or not str(inv_id).isnumeric():
        return False
    else:
        return True


# dump inventory to json
def dump(inventory):
    return {'id': str(inventory.id),
            'name': inventory.name,
            'count': str(inventory.count),
            'inv_id': str(inventory.inv_id),
            'staff': inventory.staff,
            'description': inventory.description,
            'country': inventory.country,
            'region': inventory.region,
            'create_time': inventory.create_time.strftime("%m/%d/%Y, %H:%M:%S"),
            'modified_time': inventory.modified_time.strftime("%m/%d/%Y, %H:%M:%S"),
            'deleted': inventory.deleted,
            'comments': inventory.comments
            }
