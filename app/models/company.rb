class Company < ActiveRecord::Base
	belongs_to :user
	has_one :timing, :autosave => true	
	has_many :staffs, :autosave => true
	has_many :services	
	accepts_nested_attributes_for :timing
	accepts_nested_attributes_for :services
	accepts_nested_attributes_for :staffs, :update_only => true, :allow_destroy => true
end
