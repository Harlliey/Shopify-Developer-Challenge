# Readme

This is the *Fall 2022 - Shopify Developer Intern Challenge Question*.

The task is to implement an inventory tracking web application for a logistics company.

I use Python Flask Framework for backend development and jQuery Library for fronend development and sqlite database for data storage.
Though the Flask Framework supports the ninja engine for frontend rendering, I think it is not tidy enough to blend the frontend and backend enough. So my backend and frontend are fully separated,

I have implemented:

1. Basic CRUD Functionalities, including,
- Creating Inventories
- Updating Inventories information
- Deleting Inventories
- Viewing Inventories as list

2. Undo deletion
3. Allow deletion comments
4. Part of location service(there are some bugs when updating location information)