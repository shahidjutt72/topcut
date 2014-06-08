class ChangeColumnCountryAndAddNewColumnToCustomers < ActiveRecord::Migration
  def change
  	add_column :customers, :notes, :text  	
  end
end
