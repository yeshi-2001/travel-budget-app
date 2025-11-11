exports.up = function(knex) {
  return knex.schema.createTable('trip_tasks', function(table) {
    table.increments('id').primary();
    table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description');
    table.enum('category', ['pre_trip', 'daily', 'activity', 'booking', 'packing', 'document']).defaultTo('activity');
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
    table.boolean('is_completed').defaultTo(false);
    table.timestamp('due_date');
    table.timestamp('completed_at');
    table.integer('assigned_to'); // user_id
    table.integer('created_by'); // user_id
    table.json('metadata'); // Additional task data
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trip_tasks');
};