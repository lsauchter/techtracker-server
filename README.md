# TechTracker API

This RESTful API controls all interactions between the frontend TechTracker app and the database.

## Technology

The API was built using Node, Express, and Knex. The database was built using PostgreSQL

TechTracker live page:  
[https://techtracker.lsauchter.now.sh/](https://techtracker.lsauchter.now.sh/)  
TechTracker repo:  
[https://github.com/lsauchter/techtracker-client](https://github.com/lsauchter/techtracker-client)

---

## Using this API


### Show Users  
Returns json data about all users

#### URL  
    /api/users

* **Method**  
    `GET`

* **URL Params**  
    None

* **Body Params**  
    None

* **Success Response**  
    Code: 200  
    Content:  
    ```javascript
        {
            id: 'id',
            name: 'name'
        }
    ```

* **Error Response**  
    Code: 500

* **Sample Call**  
    ```javascript
    fetch(url + '/api/users')
    .then(response =>  reponse.json())
    ```

---

### Add User  
Adds user to database and return json with new user ID

#### URL  
    /api/users

* **Method**  
    `Post`

* **URL Params**  
    None

* **Body Params**  
    **Required**  
    ```javascript
    {
        name: 'name'
    }
    ```

* **Success Response**  
    Code: 201  
    Content:  
    ```javascript
        {
            id: 'id',
            name: 'name'
        }
    ```

* **Error Response**  
    Code: 400  
    Content:  
    `{error: {message: 'Missing name in request'} }`

* **Sample Call**  
    ```javascript
    fetch((url + '/api/users'), {
            method: 'POST',
            body: JSON.stringify({name: 'userName'}),
            headers: {'content-type': 'application/json'}
        })
    .then(response =>  reponse.json())
    ```

---

### Delete User  
Deletes user from database and adds checkedout items back into circulation

#### URL  
    /api/users

* **Method**  
    `Delete`

* **URL Params**  
    **Required**  
    `id=[userId]`

    **Optional**  
    `clearCheckOut=[true]`  
    Only include if user has items currently checked out

* **Body Params**  
    None

* **Success Response**  
    Code: 204  
    Content: None

* **Error Response**  
    Code: 400  
    Content:  
    `{error: {message: 'Missing id in request'} }`

* **Sample Call**  
    ```javascript
    fetch((url + '/api/users?id=1&clearCheckOut=true'), {
            method: 'DELETE',
            headers: {'content-type': 'application/json'}
        })
    .then(response =>  reponse.json())
    ```

---

### Show Checked Out Items  
Returns json data about all checked out items

#### URL  
    /api/users/checkout

* **Method**  
    `GET`

* **URL Params**  
    None

* **Body Params**  
    None

* **Success Response**  
    Code: 200  
    Content: 
    ```javascript
        {
            user_id: 'userId',
            inventory_id: 'invId',
            quantity: 'quantity'
        }
    ```

* **Error Response**  
    Code: 500  

* **Sample Call**  
    ```javascript
    fetch(url + '/api/users/checkout')  
    .then(response =>  reponse.json())
    ```

---

### Check Out Items  
Add checked out items to database

#### URL  
    /api/users/checkout

* **Method**  
    `Post`

* **URL Params**  
    None

* **Body Params**  
    **Required**  
    ```javascript
    {
        user_id: 'userId',
        data: {
            [inventory_id]: [quantity],
            [inventory_id]: [quantity]
        }
    }
    ```

* **Success Response**  
    Code: 201  
    Content: None

* **Error Response**  
    Code: 400  
    Content:  
    `{error: {message: 'Missing [body param] in request'} }`  
    
* **Sample Call**  
    ```javascript
    fetch((url + '/api/users/checkout'), {  
            method: 'POST',
            body: JSON.stringify({
                user_id: 'userId',
                data: {
                2: 3,
                3: 4
            }),
            headers: {'content-type': 'application/json'}
        })  
    .then(response =>  reponse.json())
    ```

---

### Check In Items - Partial  
Check in part of a checked out item (update quantity checked out)

#### URL  
    /api/users/checkin

* **Method**  
    `Patch`

* **URL Params**  
    None

* **Body Params**  
    **Required**  
    ```javascript
    {
        user_id: 'userId',
        inventory_id: 'invId',
        quantity: 'quantity'
    }
    ```

* **Success Response**  
    Code: 204  
    Content: None

* **Error Response**  
    Code: 400  
    Content:  
    `{error: {message: 'Missing [body param] in request'} }`  

* **Sample Call**  
    ```javascript
    fetch((url + '/api/users/checkin'), {  
            method: 'Patch',
            body: JSON.stringify({
                user_id: 'userId'
                inventory_id: 'invId',
                quantity: 'quantity'
            }),
            headers: {'content-type': 'application/json'}
        })  
    .then(response =>  reponse.json())
    ```

---

### Check In Items - full 
Check in all of a checked out item (delete checked out from database)

#### URL  
    /api/users/checkin

* **Method**  
    `Delete`

* **URL Params**  
    None

* **Body Params**  
    **Required**  
    ```javascript
    {
        user_id: 'userId',
        inventory_id: 'invId'
    }
    ```

* **Success Response**  
    Code: 204  
    Content: None

* **Error Response**  
    Code: 400  
    Content:  
    `{error: {message: 'Missing [body param] in request'} }`

* **Sample Call**  
    ```javascript
    fetch((url + '/api/users?id=1&clearCheckOut=true'), {
            method: 'DELETE',
            headers: {'content-type': 'application/json'}
        })
    .then(response =>  reponse.json())
    ```

---

### Show Inventory  
Returns json data about all inventory

#### URL  
    /api/inventory

* **Method**  
    `GET`

* **URL Params**  
    None

* **Body Params**  
    None

* **Success Response**  
    Code: 200  
    Content:  
    ```javascript
        {
            id: 'id',
            name: 'name',
            quantity: 'quantity',
            quantityAvailable: 'quantAvail',
            category: 'category',
            image: 'image url'
        }
    ```

* **Error Response**  
    Code: 500

* **Sample Call**  
    ```javascript
    fetch(url + '/api/inventory')
    .then(response =>  reponse.json())
    ```

---

### Add Inventory 
Add inventory to database and return json with new inventory ID

#### URL  
    /api/inventory

* **Method**  
    `Post`

* **URL Params**  
    None

* **Body Params**  
    **Required**  
    ```javascript
    {
        name: 'name',
        quantity: 'quantity',
        category: 'category',
        image: 'image url'
    }
    ```

* **Success Response**  
    Code: 201  
    Content:  
    ```javascript
        {
            id: 'id',
            name: 'name',
            quantity: 'quantity',
            category: 'category',
            image: 'image url'
        }
    ```

* **Error Response**  
    Code: 400  
    Content:  
    `{error: {message: 'Missing [body param] in request'} }`

* **Sample Call**  
    ```javascript
    fetch((url + '/api/inventory'), {
            method: 'POST',
            body: JSON.stringify({
                name: 'name',
                quantity: 'quantity',
                category: 'category',
                image: 'image url'
            }),
            headers: {'content-type': 'application/json'}
        })
    .then(response =>  reponse.json())
    ```

---

### Delete Inventory   
Deletes inventory from inventory and check out database

#### URL  
    /api/inventory

* **Method**  
    `Delete`

* **URL Params**  
    **Required**  
    `id=[userId]`

* **Body Params**  
    None

* **Success Response**  
    Code: 204  
    Content: None

* **Error Response**  
    Code: 400  
    Content:  
    `{error: {message: 'Missing id in request'} }`

* **Sample Call**  
    ```javascript
    fetch((url + '/api/inventory?id=1'), {
            method: 'DELETE',
            headers: {'content-type': 'application/json'}
        })
    .then(response =>  reponse.json())
    ```
