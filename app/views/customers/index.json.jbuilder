json.array!(@customers) do |customer|
  json.extract! customer, :id, :name, :email, :mobile_phone, :office_phone, :home_phone, :address, :city, :state, :zip, :ountry, :user_id
  json.url customer_url(customer, format: :json)
end
