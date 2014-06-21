class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  before_filter :register_company, :except =>[:new, :create,:destroy,:update_company_attrs]
  before_filter :set_company
  protected
  def self.active_scaffold_controller_for(klass)
  	return ManageUsersController if klass == User
  	return ManagePromotionsController if klass == Promotion
  end	
  private

  def set_company
    if current_user
      @Company = current_user.company
    else
      @Company = nil
    end
  end
  def after_sign_in_path_for(resource_or_scope)
    if resource.is_admin
    	'/admin'
    else
    	'/'
    end	
  end
  def register_company
    if (current_user and !current_user.company) or (current_user and current_user.company and current_user.company.staffs.length==0) or (current_user and current_user.company and current_user.company.staffs.length > 0 and current_user.company.services.length == 0) 
      redirect_to new_company_path
    end      
  end  
end
