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
      redirect_to "/"
    elsif current_user
      current_user.authentications.create!(:provider => provider, :u_id => u_id)
      flash[:notice] = "Authentication successful."
      redirect_to "/"
    elsif provider == 'facebook' and User.find_by_email(omniauth['info']['email'])
       @user = User.find_by_email(omniauth['info']['email'])
       @user.authentications.build(:provider => provider, :u_id => omniauth['uid'])
       @user.skip_confirmation!
       if @user.save
         flash[:notice] = "Signed in Successfully"
         sign_in(:user, @user)
         redirect_to "/"
       end
    else
      @user = User.new
      @user.authentications.build(:provider => provider, :u_id => u_id)      
      if @provider == "facebook"
        @user.email = omniauth['info']['email']
        @user.name = omniauth['extra']['raw_info']['username']
        @user.gender = omniauth['extra']['raw_info']['gender']
      end
      @user.skip_confirmation!
      if @user.save
        flash[:notice] = "Signed in Successfully"
        sign_in(:user, @user)
        redirect_to "/"
      end
    end
  end  
end
