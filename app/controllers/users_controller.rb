class UsersController < ApplicationController
	def settings
	end

	def profile
		@slot = Slot.new
	end	
end
