class AddColumnCompanyIdToStaffs < ActiveRecord::Migration
  def change
    add_column :staffs, :company_id, :integer
    add_column :services, :company_id, :integer
  end
end
