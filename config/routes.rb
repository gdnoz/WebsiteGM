Rails.application.routes.draw do
  root 'todos#index'
  get 'todos', to: 'todos#index'
  post 'todos', to: 'todos#create'
  delete 'todos/:id', to: 'todos#destroy', as: :todo
end
