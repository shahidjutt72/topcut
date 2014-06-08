# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140608113024) do

  create_table "authentications", force: true do |t|
    t.string   "provider"
    t.string   "u_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "companies", force: true do |t|
    t.string   "name"
    t.string   "business_type"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

# Could not dump table "customers" because of following NoMethodError
#   undefined method `[]' for nil:NilClass

  create_table "promotions", force: true do |t|
    t.string   "name"
    t.text     "message"
    t.boolean  "is_active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "services", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.float    "cost"
    t.float    "service_time"
    t.float    "buffer_time"
    t.boolean  "show_on_calendar"
    t.integer  "user_id"
    t.string   "image_file_name"
    t.integer  "image_file_size"
    t.string   "image_content_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "company_id"
  end

  create_table "services_staffs", force: true do |t|
    t.integer "service_id"
    t.integer "staff_id"
  end

  create_table "staffs", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "staff_description"
    t.string   "phone"
    t.string   "image_file_name"
    t.integer  "image_file_size"
    t.string   "image_content_type"
    t.string   "cc_email"
    t.boolean  "can_login"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "company_id"
  end

  create_table "table_customers_staffs", force: true do |t|
    t.integer "customer_id"
    t.integer "staff_id"
  end

  create_table "table_services_staffs", force: true do |t|
    t.integer "service_id"
    t.integer "staff_id"
  end

  create_table "timings", force: true do |t|
    t.string   "sun_opening_time"
    t.string   "sun_closing_time"
    t.boolean  "is_on_sun"
    t.string   "mon_opening_time"
    t.string   "mon_closing_time"
    t.boolean  "is_on_mon"
    t.string   "tue_opening_time"
    t.string   "tue_closing_time"
    t.boolean  "is_on_tue"
    t.string   "wed_opening_time"
    t.string   "wed_closing_time"
    t.boolean  "is_on_wed"
    t.string   "thu_opening_time"
    t.string   "thu_closing_time"
    t.boolean  "is_on_thu"
    t.string   "fri_opening_time"
    t.string   "fri_closing_time"
    t.boolean  "is_on_fri"
    t.string   "sat_opening_time"
    t.string   "sat_closing_time"
    t.boolean  "is_on_sat"
    t.integer  "company_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "username"
    t.string   "business_email"
    t.string   "address"
    t.string   "phone"
    t.string   "mobile_phone"
    t.boolean  "appointment_show"
    t.boolean  "notify_order"
    t.boolean  "notify_coupon"
    t.boolean  "notify_payment"
    t.string   "user_type"
    t.boolean  "is_admin"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
