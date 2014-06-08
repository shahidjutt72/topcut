class Customer < ActiveRecord::Base

	def fulladdress
		"#{self.address},#{self.city},#{self.ountry}"
	end	
end
