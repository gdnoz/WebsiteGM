class AddDoneToTodo < ActiveRecord::Migration[5.1]
  def change
    add_column :todos, :done, :boolean
  end
end
