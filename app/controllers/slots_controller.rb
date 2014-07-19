class SlotsController < ApplicationController
	def create				
		require 'clickatell'
		params[:slot][:slot_start_time] = params[:slot][:slot_start_time].to_time - (params[:slot][:time_zone_difference].to_i).hours
		params[:slot][:slot_end_time] = params[:slot][:slot_end_time].to_time - (params[:slot][:time_zone_difference].to_i).hours
		@slot = Slot.new(slot_params)
		if !current_user
			@company = Company.find_by_id(params[:company_id])
		end
		service = Service.find_by_id(params[:slot][:service_id])
		staff = Staff.find_by_id(params[:slot][:staff_id])
		@slot.company_id = @company.id
		cust = Customer.find_or_create_by_mobile_phone_and_company_id(params[:cust_mobile],@company.id)
		cust.name = params[:cust_name]
		cust.email = params[:cust_email]
		cust.address = params[:cust_address]
		cust.city = params[:cust_city]
		cust.save
		begin
			api = Clickatell::API.authenticate('3480922', 'shahidjutt72', '786999ab')
			mobile = params[:cust_mobile]
			if mobile.first != "+"
				mobile = mobile.prepend("+")
			end	
			api.send_message(mobile, 'Hello from clickatell')
		rescue
		end	
		@slot.customer_id = cust.id
		@slot.save
		date = @slot.slot_start_time.to_date
		redirect_to request.referrer, :notice =>"Your #{service.name} Successfully Appointed to #{staff.name} on #{date}"		
	end
	private
    

    # Never trust parameters from the scary internet, only allow the white list through.
    def slot_params
      params.require(:slot).permit(:staff_id,:service_id,:customer_id,:slot_start_time,:slot_end_time,:notes,:cost,:service_time,:company_id,:time_zone_difference)
    end
end
