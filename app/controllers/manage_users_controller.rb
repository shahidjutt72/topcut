class ManageUsersController < AdminController
	active_scaffold :user do |config|
		config.list.columns = [:email, :admin_or_not, :confirmed_or_not]	
		config.create.columns = [:email,:password,:password_confirmation, :is_admin]	
		config.update.columns = [:email, :is_admin, :notify_order,:notify_coupon,:notify_payment]	
		config.action_links.add 'confirm_user', :label => 'Confirm the user', :page => false, :type => :member, :parameters => {}
		# config.action_links.add = 'confirm_user', :label =>"Confirm the user", :page => false, :type =>"member", :parameters =>{}		
	end
	def confirm_user
		u = User.find_by_id(params[:id])
		already_confirmed = false
		if u
			if u.confirmed?
				already_confirmed = true
			end	
			u.confirmation_token = nil
			u.confirmed_at = Time.now
			u.save
		end
		if already_confirmed = true
			notice ="Already Confirmed."
		else
			notice ="Successfully Confirmed"
		end	
		redirect_to manage_users_path
			
	end
end
