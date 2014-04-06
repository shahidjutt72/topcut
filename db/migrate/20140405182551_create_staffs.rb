class CreateStaffs < ActiveRecord::Migration
  def change
    create_table :staffs do |t|
      t.string :name
      t.string :email
      t.string :staff_description
      t.string :phone
      t.string :image_file_name
      t.integer :image_file_size
      t.string :image_content_type
      t.string :cc_email
      t.boolean :can_login
      t.integer :user_id

      t.timestamps
    end
  end
end
