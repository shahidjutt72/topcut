class AuthenticationsController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => [:new, :create]
  def new
    omniauth = request.env["omniauth.auth"]
    provider = omniauth['provider'].to_s
    
    u_id = omniauth['uid']
    while( (@authentication = Authentication.find_by_provider_and_u_id(provider, u_id)) and @authentication.user.nil?) do
      @authentication.destroy
    end            
    if @authentication
      flash[:notice] = "Signed in Successfully"
      sign_in(:user, @authentication.user)      
    elsif current_user
      current_user.authentications.create!(:provider => provider, :u_id => u_id)
      flash[:notice] = "Authentication successful."      
    elsif provider == 'facebook' and User.find_by_email(omniauth['info']['email'])
       @user = User.find_by_email(omniauth['info']['email'])
       @user.authentications.build(:provider => provider, :u_id => omniauth['uid'])
       @user.skip_confirmation!
       if @user.save
         flash[:notice] = "Signed in Successfully"
         sign_in(:user, @user)         
       end      
    else
      @user = User.new
      @user.authentications.build(:provider => provider, :u_id => u_id)      
      if @provider == "facebook"
        @user.email = omniauth['info']['email']                
      end
      @user.skip_confirmation!
      if @user.save
        flash[:notice] = "Signed in Successfully"
        sign_in(:user, @user)        
      end      
    end
    redirect_to "/"
  end  
end
