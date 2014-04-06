json.array!(@staffs) do |staff|
  json.extract! staff, :id, :name, :email, :staff_description, :phone, :image_file_name, :image_file_size, :image_content_type, :cc_email, :can_login, :user_id
  json.url staff_url(staff, format: :json)
end
