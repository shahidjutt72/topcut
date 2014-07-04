class SlotsController < ApplicationController
	def create		
		@slot = Slot.new(slot_params)
		@slot.company_id = @company.id
		cust = Customer.find_or_create_by_mobile_phone_and_company_id(params[:cust_mobile],@company.id)
		cust.name = params[:cust_name]
		cust.email = params[:cust_email]
		cust.address = params[:cust_address]
		cust.city = params[:cust_city]
		cust.save
		@slot.customer_id = cust.id
		@slot.save
		
		redirect_to request.referrer, :notice =>"Apointment Successfully Added"		
	end
	private
    

    # Never trust parameters from the scary internet, only allow the white list through.
    def slot_params
      params.require(:slot).permit(:staff_id,:service_id,:customer_id,:slot_start_time,:slot_end_time,:notes,:cost,:service_time,:company_id)
    end
end
