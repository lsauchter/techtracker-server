function makeUsersArray() {
    return [
        {
            name: 'Brooklyn'
        },
        {
            name: 'Derrick'
        }
    ] 
}

function makeInventoryArray() {
    return [
        {
            name: 'Purple Mac',
            quantity: 6,
            category: 'computer',
            image: 'https://images-na.ssl-images-amazon.com/images/I/51et4LzjJxL._SL1000_.jpg'
        },
        {
            name: 'Red Mac',
            quantity: 6,
            category: 'computer',
            image: 'https://images-na.ssl-images-amazon.com/images/I/515I48-ZKKL._SL1000_.jpg'
        },
        {
            name: 'Green Mac',
            quantity: 6,
            category: 'computer',
            image: 'https://images-na.ssl-images-amazon.com/images/I/51V7YDVUFPL._SL1000_.jpg'
        },
        {
            name: 'Blue Mac',
            quantity: 6,
            category: 'computer',
            image: 'https://images-na.ssl-images-amazon.com/images/I/517M3iveTRL._SL1000_.jpg'
        }
    ]
}

function makeCheckoutArray() {
    return [
        {
            user_id: 1,
            inventory_id: 1,
            quantity: 1
        },
        {
            user_id: 1,
            inventory_id: 2,
            quantity: 2
        }
    ]
}

module.exports = {
    makeUsersArray,
    makeInventoryArray,
    makeCheckoutArray
}