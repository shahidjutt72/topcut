class AddColorCodeToServices < ActiveRecord::Migration
  def change
  	add_column :services, :color_code, :string
  end
end
