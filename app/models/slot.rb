class Slot < ActiveRecord::Base
	belongs_to :staff
	belongs_to :service
	belongs_to :customer
	belongs_to :company
end
