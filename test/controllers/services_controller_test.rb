require 'test_helper'

class ServicesControllerTest < ActionController::TestCase
  setup do
    @service = services(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:services)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create service" do
    assert_difference('Service.count') do
      post :create, service: { buffer_time: @service.buffer_time, cost: @service.cost, description: @service.description, image_content_type: @service.image_content_type, image_file_name: @service.image_file_name, image_file_size: @service.image_file_size, name: @service.name, service_time: @service.service_time, show_on_calendar: @service.show_on_calendar, user_id: @service.user_id }
    end

    assert_redirected_to service_path(assigns(:service))
  end

  test "should show service" do
    get :show, id: @service
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @service
    assert_response :success
  end

  test "should update service" do
    patch :update, id: @service, service: { buffer_time: @service.buffer_time, cost: @service.cost, description: @service.description, image_content_type: @service.image_content_type, image_file_name: @service.image_file_name, image_file_size: @service.image_file_size, name: @service.name, service_time: @service.service_time, show_on_calendar: @service.show_on_calendar, user_id: @service.user_id }
    assert_redirected_to service_path(assigns(:service))
  end

  test "should destroy service" do
    assert_difference('Service.count', -1) do
      delete :destroy, id: @service
    end

    assert_redirected_to services_path
  end
end
