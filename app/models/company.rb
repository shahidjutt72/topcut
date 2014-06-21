class Company < ActiveRecord::Base
	belongs_to :user
	has_one :timing, :autosave => true	
	has_many :staffs, :autosave => true
	has_many :services
	has_many :slots	
	accepts_nested_attributes_for :timing
	accepts_nested_attributes_for :services
	accepts_nested_attributes_for :staffs
end
