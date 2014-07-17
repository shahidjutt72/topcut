class UsersController < ApplicationController
	def settings
	end

	def profile
		@slot = Slot.new
	end

	def get_calendar_updates
		service = Service.find_by_id(params[:service_id])
		@company = Company.find_by_id(params[:company_id])
		date = params[:date].to_date
		render :partial =>"users/slot_timings", :locals =>{:date => date, :service =>service}
	end	
end
