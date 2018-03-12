class StartPageController < ApplicationController
  def index
  end

  def redirect
  end

  private
    def startpage_params
      params.require(:page)
    end
end
