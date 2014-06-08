class Notifier < ActionMailer::Base
  default from: "from@example.com"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifier.customer_email.subject
  #
  def customer_email
    @greeting = "Hi"

    mail to: "shahidjutt72@yahoo.com"
  end
end
