class Service < ActiveRecord::Base
	belongs_to :company
	has_and_belongs_to_many :staffs
	accepts_nested_attributes_for :staffs
	# has_many :slots, :dependent => :destroy
	has_and_belongs_to_many :slots
end
