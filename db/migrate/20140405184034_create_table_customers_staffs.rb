class CreateTableCustomersStaffs < ActiveRecord::Migration
  def change
    create_table :table_customers_staffs do |t|
      t.integer :customer_id
      t.integer :staff_id
    end
  end
end
