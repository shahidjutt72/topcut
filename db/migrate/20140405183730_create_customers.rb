class CreateCustomers < ActiveRecord::Migration
  def change
    create_table :customers do |t|
      t.string :name
      t.string :email
      t.string :mobile_phone
      t.string :office_phone
      t.string :home_phone
      t.string :address
      t.string :city
      t.string :state
      t.string :zip
      t.string :ountry
      t.integer :user_id

      t.timestamps
    end
  end
end
