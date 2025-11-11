exports.up = function(knex) {
  return knex.schema.createTable('trip_participants', function(table) {
    table.increments('id').primary();
    table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('role', ['admin', 'member', 'view_only']).defaultTo('member');
    table.enum('status', ['invited', 'joined', 'declined']).defaultTo('invited');
    table.string('email');
    table.string('name');
    table.decimal('total_paid', 12, 2).defaultTo(0);
    table.decimal('total_owed', 12, 2).defaultTo(0);
    table.decimal('net_balance', 12, 2).defaultTo(0);
    table.timestamp('joined_at');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trip_participants');
};