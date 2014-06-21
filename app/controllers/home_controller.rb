class HomeController < ApplicationController
	def index
		@slot = Slot.new
		@company = current_user.company
		@services = @company.services
		@staffs = @company.staffs		
	end	
end
