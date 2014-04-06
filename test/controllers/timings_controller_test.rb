require 'test_helper'

class TimingsControllerTest < ActionController::TestCase
  setup do
    @timing = timings(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:timings)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create timing" do
    assert_difference('Timing.count') do
      post :create, timing: { company_id: @timing.company_id, fri_closing_time: @timing.fri_closing_time, fri_opening_time: @timing.fri_opening_time, is_on_fri: @timing.is_on_fri, is_on_mon: @timing.is_on_mon, is_on_sat: @timing.is_on_sat, is_on_sun: @timing.is_on_sun, is_on_thu: @timing.is_on_thu, is_on_tue: @timing.is_on_tue, is_on_wed: @timing.is_on_wed, mon_closing_time: @timing.mon_closing_time, mon_opening_time: @timing.mon_opening_time, sat_closing_time: @timing.sat_closing_time, sat_opening_time: @timing.sat_opening_time, sun_closing_time: @timing.sun_closing_time, sun_opening_time: @timing.sun_opening_time, thu_closing_time: @timing.thu_closing_time, thu_opening_time: @timing.thu_opening_time, tue_closing_time: @timing.tue_closing_time, tue_opening_time: @timing.tue_opening_time, wed_closing_time: @timing.wed_closing_time, wed_opening_time: @timing.wed_opening_time }
    end

    assert_redirected_to timing_path(assigns(:timing))
  end

  test "should show timing" do
    get :show, id: @timing
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @timing
    assert_response :success
  end

  test "should update timing" do
    patch :update, id: @timing, timing: { company_id: @timing.company_id, fri_closing_time: @timing.fri_closing_time, fri_opening_time: @timing.fri_opening_time, is_on_fri: @timing.is_on_fri, is_on_mon: @timing.is_on_mon, is_on_sat: @timing.is_on_sat, is_on_sun: @timing.is_on_sun, is_on_thu: @timing.is_on_thu, is_on_tue: @timing.is_on_tue, is_on_wed: @timing.is_on_wed, mon_closing_time: @timing.mon_closing_time, mon_opening_time: @timing.mon_opening_time, sat_closing_time: @timing.sat_closing_time, sat_opening_time: @timing.sat_opening_time, sun_closing_time: @timing.sun_closing_time, sun_opening_time: @timing.sun_opening_time, thu_closing_time: @timing.thu_closing_time, thu_opening_time: @timing.thu_opening_time, tue_closing_time: @timing.tue_closing_time, tue_opening_time: @timing.tue_opening_time, wed_closing_time: @timing.wed_closing_time, wed_opening_time: @timing.wed_opening_time }
    assert_redirected_to timing_path(assigns(:timing))
  end

  test "should destroy timing" do
    assert_difference('Timing.count', -1) do
      delete :destroy, id: @timing
    end

    assert_redirected_to timings_path
  end
end
