exports.up = function(knex) {
  return knex.schema
    // Create trip_destinations table for day-by-day itinerary
    .createTable('trip_destinations', function(table) {
      table.increments('id').primary();
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
      table.string('location_name').notNullable();
      table.date('arrival_date').notNullable();
      table.date('departure_date').notNullable();
      table.integer('duration_days');
      table.integer('duration_nights');
      table.decimal('latitude', 10, 8);
      table.decimal('longitude', 11, 8);
      table.text('notes');
      table.integer('sequence_order');
      table.decimal('distance_from_previous', 10, 2);
      table.decimal('travel_time_minutes', 8, 2);
      table.timestamps(true, true);
    })
    
    // Create accommodation_plans table
    .createTable('accommodation_plans', function(table) {
      table.increments('id').primary();
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
      table.integer('destination_id').references('id').inTable('trip_destinations').onDelete('CASCADE');
      table.string('accommodation_name');
      table.date('checkin_date');
      table.date('checkout_date');
      table.integer('nights');
      table.integer('rooms');
      table.decimal('planned_cost_per_night', 12, 2);
      table.decimal('total_planned_cost', 12, 2);
      table.decimal('actual_cost', 12, 2);
      table.text('notes');
      table.boolean('is_booked').defaultTo(false);
      table.timestamps(true, true);
    })
    
    // Create meal_plans table
    .createTable('meal_plans', function(table) {
      table.increments('id').primary();
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
      table.integer('destination_id').references('id').inTable('trip_destinations').onDelete('CASCADE');
      table.enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']).notNullable();
      table.string('restaurant_name');
      table.decimal('planned_cost_per_meal', 12, 2);
      table.integer('number_of_meals');
      table.decimal('total_planned_cost', 12, 2);
      table.decimal('actual_cost', 12, 2);
      table.timestamps(true, true);
    })
    
    // Create transportation_plans table
    .createTable('transportation_plans', function(table) {
      table.increments('id').primary();
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
      table.enum('transport_type', ['rental', 'fuel', 'tolls', 'parking', 'taxi', 'other']).notNullable();
      table.string('description');
      table.decimal('planned_cost', 12, 2);
      table.decimal('actual_cost', 12, 2);
      table.json('details'); // Vehicle type, fuel efficiency, etc.
      table.timestamps(true, true);
    })
    
    // Create activity_plans table
    .createTable('activity_plans', function(table) {
      table.increments('id').primary();
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
      table.integer('destination_id').references('id').inTable('trip_destinations').onDelete('CASCADE');
      table.string('activity_name').notNullable();
      table.date('planned_date');
      table.decimal('cost_per_person', 12, 2);
      table.integer('number_of_people');
      table.decimal('total_planned_cost', 12, 2);
      table.decimal('actual_cost', 12, 2);
      table.boolean('is_completed').defaultTo(false);
      table.boolean('is_booked').defaultTo(false);
      table.timestamps(true, true);
    })
    
    // Create real_time_tracking table
    .createTable('real_time_tracking', function(table) {
      table.increments('id').primary();
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
      table.decimal('current_latitude', 10, 8);
      table.decimal('current_longitude', 11, 8);
      table.string('current_location_name');
      table.integer('current_destination_id');
      table.decimal('distance_traveled_today', 10, 2);
      table.decimal('total_distance_traveled', 10, 2);
      table.timestamp('last_location_update');
      table.json('route_data'); // GPS tracking points
      table.timestamps(true, true);
    })
    
    // Create budget_alerts table
    .createTable('budget_alerts', function(table) {
      table.increments('id').primary();
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
      table.enum('alert_type', ['daily_budget', 'category_budget', 'overall_budget', 'location_arrival', 'meal_time', 'activity_reminder']).notNullable();
      table.string('alert_title');
      table.text('alert_message');
      table.boolean('is_sent').defaultTo(false);
      table.timestamp('scheduled_time');
      table.timestamp('sent_time');
      table.json('alert_data');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('budget_alerts')
    .dropTableIfExists('real_time_tracking')
    .dropTableIfExists('activity_plans')
    .dropTableIfExists('transportation_plans')
    .dropTableIfExists('meal_plans')
    .dropTableIfExists('accommodation_plans')
    .dropTableIfExists('trip_destinations');
};