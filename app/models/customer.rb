class Customer < ActiveRecord::Base
	has_many :slots, :dependent => :destroy
	belongs_to :company
	def fulladdress
		"#{self.address},#{self.city},#{self.ountry}"
	end	
end
