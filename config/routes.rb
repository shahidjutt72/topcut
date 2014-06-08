Topcut::Application.routes.draw do
  resources :timings

  resources :companies do
    member do
      get 'add_staff'
      get 'add_services'
    end  
  end  

  resources :customers do
    member do
      get 'update_attributes'
    end
  end  

  resources :services

  resources :staffs

  devise_for :users
  
  devise_scope :user do
    match "/users/sign_out" => "devise/sessions#destroy", :via => "get"    
  end
  resources :users do
    collection do
      get "settings"
      get "profile"      
    end  
  end
  match "/settings" =>"users#settings", :via => "get"  
  get "home/index"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  resources :manage_users do as_routes 
    member do
      get "confirm_user"
    end  
  end
  match '/auth/:provider/callback' => "authentications#new", :via =>["get","post"]
  resources :manage_promotions do as_routes end
  match "/admin" => "manage_users#index", :via => "get"  
  # match "/" => "companies#show", :via => "get"
  root 'home#index'


  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
