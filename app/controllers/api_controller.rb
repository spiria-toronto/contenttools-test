class ApiController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def save
    # debugger

    render status: :ok, json: 'success'
  end
end
