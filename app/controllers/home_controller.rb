class HomeController < ApplicationController
	def index
		if current_user and current_user.company
			@slot = Slot.new			
			@services = @company.services
			@staffs = @company.staffs
			@slots = @company.slots
			if params[:staff] !=  nil and params[:staff] !=  ""
				@slots = @company.slots.where("staff_id =?",params[:staff].to_i)
			end
		end			
	end	
end
