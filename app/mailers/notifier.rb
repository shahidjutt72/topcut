class Notifier < ActionMailer::Base
  default from: "noreply@servuapp.com"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifier.customer_email.subject
  #
  def customer_email(email)
    @greeting = "Hi"
    subject => "Appiontment Email"

    mail to: email
  end
end
