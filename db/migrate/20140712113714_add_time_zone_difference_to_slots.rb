class AddTimeZoneDifferenceToSlots < ActiveRecord::Migration
  def change
  	add_column :slots, :time_zone_difference, :integer
  end
end
