
exports.up = function (knex, Promise) {
  return knex.schema.createTable('visits', (table) => {
    table.increments()
    table.timestamp('timestamp')
    table.string('userIp')
  })
}

exports.down = function (knex, Promise) {

}
