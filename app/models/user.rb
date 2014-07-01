class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  has_many :authentications
  has_one :company, :dependent => :'destroy'
  def admin_or_not
  	if self.is_admin
  		'Admin User'
  	else
  		'Not Admin'
  	end	
  end
  def confirmed_or_not
  	if self.confirmed?
  		'Confirmed User'
  	else
  		'Unconfirmed User'
  	end	
  end
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable#,:confirmable
end
