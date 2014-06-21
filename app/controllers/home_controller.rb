class HomeController < ApplicationController
	def index
		if current_user and current_user.company
			@slot = Slot.new
			@company = current_user.company
			@services = @company.services
			@staffs = @company.staffs
		end			
	end	
end
