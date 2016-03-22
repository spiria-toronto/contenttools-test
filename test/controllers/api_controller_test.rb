require 'test_helper'

class ApiControllerTest < ActionController::TestCase
  test "should get save" do
    get :save
    assert_response :success
  end

end
