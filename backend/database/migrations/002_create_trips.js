exports.up = function(knex) {
  return knex.schema.createTable('trips', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.enum('mode', ['individual', 'group']).defaultTo('individual');
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.decimal('planned_budget', 12, 2);
    table.string('currency').defaultTo('USD');
    table.enum('status', ['planning', 'active', 'completed']).defaultTo('planning');
    table.integer('created_by');
    table.json('budget_allocation');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trips');
};