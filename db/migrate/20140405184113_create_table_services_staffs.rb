class CreateTableServicesStaffs < ActiveRecord::Migration
  def change
    create_table :table_services_staffs do |t|
      t.integer :service_id
      t.integer :staff_id
    end
  end
end
