class AddColumnSendMessageToCompanies < ActiveRecord::Migration
  def change
  	add_column :companies, :send_sms, :boolean
  	add_column :companies, :send_email, :boolean
  end
end
