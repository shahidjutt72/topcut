class CreateTimings < ActiveRecord::Migration
  def change
    create_table :timings do |t|
      t.string :sun_opening_time
      t.string :sun_closing_time
      t.boolean :is_on_sun
      t.string :mon_opening_time
      t.string :mon_closing_time
      t.boolean :is_on_mon
      t.string :tue_opening_time
      t.string :tue_closing_time
      t.boolean :is_on_tue
      t.string :wed_opening_time
      t.string :wed_closing_time
      t.boolean :is_on_wed
      t.string :thu_opening_time
      t.string :thu_closing_time
      t.boolean :is_on_thu
      t.string :fri_opening_time
      t.string :fri_closing_time
      t.boolean :is_on_fri
      t.string :sat_opening_time
      t.string :sat_closing_time
      t.boolean :is_on_sat
      t.integer :company_id

      t.timestamps
    end
  end
end
