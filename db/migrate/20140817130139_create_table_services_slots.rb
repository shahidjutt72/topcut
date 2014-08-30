class CreateTableServicesSlots < ActiveRecord::Migration
  def change
    create_table :table_services_slots, :id => false do |t|
    	t.integer :service_id
    	t.integer :slot_id
    end
  end
end
