class ManagePromotionsController < AdminController
	active_scaffold :promotion do |config|
		config.columns = [:name, :message, :is_active]			
		config.columns[:message].options ={:cols => 60, :rows => 10}
	end
end
