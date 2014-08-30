class Slot < ActiveRecord::Base
	belongs_to :staff
	# belongs_to :service
	belongs_to :customer
	belongs_to :company
	has_and_belongs_to_many :services

	def is_booked(t)
		if self.time_zone_difference
			diff = self.time_zone_difference
		else
			diff = 0	
		end
		if self.slot_start_time+diff.hours <= t and self.slot_end_time+diff.hours >= t
			true		
		end	
	end
end
