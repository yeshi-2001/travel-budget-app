exports.up = function(knex) {
  return knex.schema.alterTable('trips', function(table) {
    // Trip lifecycle status
    table.enum('lifecycle_status', ['DRAFT', 'PLANNING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'SETTLED', 'ARCHIVED']).defaultTo('DRAFT');
    
    // Enhanced trip data
    table.text('description');
    table.integer('total_participants').defaultTo(1);
    table.decimal('total_distance', 10, 2);
    table.decimal('estimated_fuel_cost', 12, 2);
    table.json('route_data'); // GPS coordinates, waypoints
    table.json('checklist_data'); // Pre-trip, daily tasks
    table.json('itinerary_data'); // Daily plans, activities
    
    // Progress tracking
    table.integer('completion_percentage').defaultTo(0);
    table.integer('tasks_completed').defaultTo(0);
    table.integer('tasks_total').defaultTo(0);
    table.integer('locations_visited').defaultTo(0);
    table.integer('locations_planned').defaultTo(0);
    
    // Budget tracking
    table.decimal('actual_spent', 12, 2).defaultTo(0);
    table.json('category_budgets'); // Detailed budget per category
    table.json('daily_budgets'); // Budget per day
    
    // Trip metadata
    table.boolean('is_offline_enabled').defaultTo(false);
    table.timestamp('trip_started_at');
    table.timestamp('trip_completed_at');
    table.json('settings'); // Notifications, preferences
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('trips', function(table) {
    table.dropColumn('lifecycle_status');
    table.dropColumn('description');
    table.dropColumn('total_participants');
    table.dropColumn('total_distance');
    table.dropColumn('estimated_fuel_cost');
    table.dropColumn('route_data');
    table.dropColumn('checklist_data');
    table.dropColumn('itinerary_data');
    table.dropColumn('completion_percentage');
    table.dropColumn('tasks_completed');
    table.dropColumn('tasks_total');
    table.dropColumn('locations_visited');
    table.dropColumn('locations_planned');
    table.dropColumn('actual_spent');
    table.dropColumn('category_budgets');
    table.dropColumn('daily_budgets');
    table.dropColumn('is_offline_enabled');
    table.dropColumn('trip_started_at');
    table.dropColumn('trip_completed_at');
    table.dropColumn('settings');
  });
};