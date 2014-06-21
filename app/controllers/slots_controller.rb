class SlotsController < ApplicationController
	def create
		@slot = Slot.new(slot_params)
		@slot.company_id = current_user.company.id
		@slot.save
		
		redirect_to "/", :notice =>"Apointment Successfully Added"		
	end
	private
    

    # Never trust parameters from the scary internet, only allow the white list through.
    def slot_params
      params.require(:slot).permit(:staff_id,:service_id,:customer_id,:slot_start_time,:slot_end_time,:notes,:cost,:service_time,:company_id)
    end
end
