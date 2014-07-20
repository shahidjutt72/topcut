class ManageCompaniesController < AdminController
	active_scaffold :company do |config|
		config.list.columns = [:name, :user_email,:staff_limit,:send_sms_status]	
		config.create.columns = [:name, :staff_limit,:send_sms]	
		config.update.columns = [:name, :staff_limit, :send_sms]	
		# config.action_links.add 'confirm_user', :label => 'Confirm the user', :page => false, :type => :member, :parameters => {}
		# config.action_links.add = 'confirm_user', :label =>"Confirm the user", :page => false, :type =>"member", :parameters =>{}		
	end
end
