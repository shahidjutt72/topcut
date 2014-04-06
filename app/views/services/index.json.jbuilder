json.array!(@services) do |service|
  json.extract! service, :id, :name, :description, :cost, :service_time, :buffer_time, :show_on_calendar, :user_id, :image_file_name, :image_file_size, :image_content_type
  json.url service_url(service, format: :json)
end
