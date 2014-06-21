class CreateSlots < ActiveRecord::Migration
  def change
    create_table :slots do |t|
      t.integer :staff_id
      t.integer :service_id
      t.integer :company_id
      t.integer :customer_id
      t.datetime :slot_start_time
      t.datetime :slot_end_time
      t.text :notes
      t.float :cost
      t.integer :service_time

      t.timestamps
    end
  end
end
