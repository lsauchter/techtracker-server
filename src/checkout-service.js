const CheckoutService = {
    getCheckOutByUser(knex, id) {
        return knex('checkout')
            .select('inventory_id', 'quantity')
            .where('user_id', id)
    },
    getCheckOutByItem(knex, id) {
        return knex('checkout')
            .sum('quantity')
            .where('inventory_id', id)
    },
    insertCheckOut(knex, checkOut) {
        return knex
            .insert(checkOut)
            .into('checkout')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    updateCheckOut(knex, userId, inventoryId, quantity) {
        return knex('checkout')
            .where({
                'user_id': userId,
                'inventory_id': inventoryId
            })
            .update(quantity)
    },
    removeCheckOut(knex, userId, inventoryId) {
        return knex('checkout')
            .where({
                'user_id': userId,
                'inventory_id': inventoryId
            })
            .delete()   
    },
    removeCheckOutbyItemId(knex, inventoryId) {
        return knex('checkout')
            .where('inventory_id', inventoryId)
            .delete()
    },
    removeCheckOutByUserId(knex, userId) {
        return knex('checkout')
            .where('user_id', userId)
            .delete()
    }
}

module.exports = CheckoutService