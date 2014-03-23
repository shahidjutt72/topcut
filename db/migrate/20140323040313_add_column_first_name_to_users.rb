class AddColumnFirstNameToUsers < ActiveRecord::Migration
  def change
  	add_column :users, :first_name, :string
  	add_column :users, :last_name, :string
  	add_column :users, :username, :string
  	add_column :users, :business_email, :string
  	add_column :users, :address, :string
  	add_column :users, :phone, :string
  	add_column :users, :mobile_phone, :string
  	add_column :users, :appointment_show, :boolean
  	add_column :users, :notify_order, :boolean
  	add_column :users, :notify_coupon, :boolean
  	add_column :users, :notify_payment, :boolean
  	add_column :users, :user_type, :string
  	add_column :users, :is_admin, :boolean
  end
end
