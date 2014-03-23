class AdminController < ApplicationController
	layout 'admin'
	before_filter :login_required
	def login_required
		if current_user
			if current_user.is_admin == true
				return true
			else
				redirect_to "/", :notice => "you are not allowed to enter admin panel"			
			end	
		else
			redirect_to "/", :notice => "Please Sign in first"	
		end	
	end	
end
