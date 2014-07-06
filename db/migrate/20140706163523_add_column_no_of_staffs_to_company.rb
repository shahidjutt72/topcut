class AddColumnNoOfStaffsToCompany < ActiveRecord::Migration
  def change
  	add_column :companies, :staff_limit, :integer, :default => 3
  end
end
