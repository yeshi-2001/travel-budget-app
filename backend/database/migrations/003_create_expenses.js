exports.up = function(knex) {
  return knex.schema.createTable('expenses', function(table) {
    table.increments('id').primary();
    table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
    table.string('description').notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.string('currency').defaultTo('USD');
    table.enum('category', ['accommodation', 'meals', 'transportation', 'tickets', 'miscellaneous', 'fuel', 'parking', 'tolls', 'activities', 'shopping', 'emergency']).notNullable();
    table.integer('paid_by').references('id').inTable('users').onDelete('CASCADE');
    table.date('expense_date').notNullable();
    table.enum('split_type', ['equal', 'custom', 'percentage']).defaultTo('equal');
    table.string('location');
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.enum('payment_method', ['cash', 'card', 'digital_wallet']).defaultTo('cash');
    table.string('receipt_url');
    table.text('notes');
    table.json('split_details'); // Who owes what
    table.boolean('is_settled').defaultTo(false);
    table.timestamp('settled_at');
    table.string('voice_note_url');
    table.json('participants'); // Who participated in this expense
    table.boolean('is_recurring').defaultTo(false);
    table.json('recurring_config'); // Daily, weekly, etc.
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('expenses');
};