class Customer < ActiveRecord::Base
	has_many :slots
	def fulladdress
		"#{self.address},#{self.city},#{self.ountry}"
	end	
end
