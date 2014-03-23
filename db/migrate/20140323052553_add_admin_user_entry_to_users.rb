class AddAdminUserEntryToUsers < ActiveRecord::Migration
  def change
  	begin
  		u = User.new
  		u.email = "admin@topcut.com"
  		u.password = "123456789"
  		u.save(:validate => false)
  		admin = User.find_by_email("admin@topcut.com")
  		if admin
  			admin.confirmation_token = nil
  			admin.confirmed_at = Time.now
  			admin.is_admin = true  			
  			admin.save(:validate => false)
  		end	
  	rescue
  	end	

  end
end
