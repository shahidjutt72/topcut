class Timing < ActiveRecord::Base
	belongs_to :company
	DAYS={0 =>'sun',1 =>'mon', 2 =>'tue', 3 => 'wed', 4 =>'thu', 5 => 'fri', 6 => 'sat'}
end
