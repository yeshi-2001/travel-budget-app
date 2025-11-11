exports.up = function(knex) {
  return knex.schema.createTable('trip_locations', function(table) {
    table.increments('id').primary();
    table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('description');
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.enum('type', ['destination', 'waypoint', 'accommodation', 'restaurant', 'attraction']).defaultTo('destination');
    table.integer('visit_order');
    table.boolean('is_visited').defaultTo(false);
    table.timestamp('visited_at');
    table.decimal('estimated_cost', 12, 2);
    table.decimal('actual_cost', 12, 2);
    table.json('metadata'); // Additional location data
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trip_locations');
};