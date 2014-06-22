class HomeController < ApplicationController
	def index
		if current_user and current_user.company
			@slot = Slot.new			
			@services = @company.services
			@staffs = @company.staffs
		end			
	end	
end
