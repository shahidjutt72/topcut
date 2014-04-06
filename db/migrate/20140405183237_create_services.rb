class CreateServices < ActiveRecord::Migration
  def change
    create_table :services do |t|
      t.string :name
      t.text :description
      t.float :cost
      t.float :service_time
      t.float :buffer_time
      t.boolean :show_on_calendar
      t.integer :user_id
      t.string :image_file_name
      t.integer :image_file_size
      t.string :image_content_type

      t.timestamps
    end
  end
end
