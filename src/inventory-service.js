const InventoryService = {
    getInventory(knex) {
        return knex('inventory').select('*')
    },
    insertInventory(knex, item) {
        return knex
            .insert(item)
            .into('inventory')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    removeInventory(knex, itemId) {
        return knex('inventory')
        .where({
            'id': itemId
        })
        .delete()
    }
}

module.exports = InventoryService