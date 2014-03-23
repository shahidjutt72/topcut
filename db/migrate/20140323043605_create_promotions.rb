class CreatePromotions < ActiveRecord::Migration
  def change
    create_table :promotions do |t|
      t.string :name
      t.text :message
      t.boolean :is_active

      t.timestamps
    end
  end
end
