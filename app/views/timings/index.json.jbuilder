json.array!(@timings) do |timing|
  json.extract! timing, :id, :sun_opening_time, :sun_closing_time, :is_on_sun, :mon_opening_time, :mon_closing_time, :is_on_mon, :tue_opening_time, :tue_closing_time, :is_on_tue, :wed_opening_time, :wed_closing_time, :is_on_wed, :thu_opening_time, :thu_closing_time, :is_on_thu, :fri_opening_time, :fri_closing_time, :is_on_fri, :sat_opening_time, :sat_closing_time, :is_on_sat, :company_id
  json.url timing_url(timing, format: :json)
end
