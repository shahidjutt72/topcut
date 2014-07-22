class Notifier < ActionMailer::Base
  default from: "noreply@servuapp.com"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifier.customer_email.subject
  #
  def customer_email(staff,slot,customer,service,company)
    @staff = staff
    @slot = slot
    @customer = customer
    @service = service
    @company = company
    @time = "#{slot.slot_start_time.strftime("%A")}, #{slot.slot_start_time.strftime("%d")} #{slot.slot_start_time.strftime("%b")} #{slot.slot_start_time.strftime("%Y")} at #{slot.slot_start_time.strftime("%I:%M %p")}"    

    mail to: customer.email, :subject =>"Appointment Scheduled for #{@time} with #{staff.name}."
  end

  def staff_email(staff,slot,customer,service,company)
    @staff = staff
    @slot = slot
    @customer = customer
    @service = service
    @company = company
    @time = "#{slot.slot_start_time.strftime("%A")}, #{slot.slot_start_time.strftime("%d")} #{slot.slot_start_time.strftime("%b")} #{slot.slot_start_time.strftime("%Y")} at #{slot.slot_start_time.strftime("%I:%M %p")}"

    mail to: staff.email, :subject =>"Appointment Scheduled for #{@time} with #{customer.name}."
  end
end
