class TodosController < ApplicationController
  before_action :set_todo, only: [:destroy, :update]

  def index
    @todos = Todo.all
    @todo = Todo.new
    respond_to do |format|
      format.html
      format.json { render :json => @todos }
    end
  end

  def create
    @todo = Todo.new(todo_params)
    @todo.save
  end

  def update
    @todo.update(todo_params)
  end

  def destroy
    @todo.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_todo
      @todo = Todo.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def todo_params
      params.require(:todo).permit(:name, :done)
    end
end