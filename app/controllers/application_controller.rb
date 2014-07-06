class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  before_filter :register_company, :except =>[:new, :create,:destroy,:update_company_attrs]
  before_filter :set_company_overall
  protected
  def self.active_scaffold_controller_for(klass)
  	return ManageUsersController if klass == User
  	return ManagePromotionsController if klass == Promotion
    return ManageCompaniesController if klass == Company
  end	
  private

  def set_company_overall
    if current_user
      @company = current_user.company
    else
      @company = nil
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
    if ((current_user and !current_user.company) or (current_user and current_user.company and current_user.company.staffs.length==0) or (current_user and current_user.company and current_user.company.staffs.length > 0 and current_user.company.services.length == 0)) and (current_user and current_user.is_admin != true)
      redirect_to new_company_path
    end      
  end  
end
