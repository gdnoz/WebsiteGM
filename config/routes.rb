Rails.application.routes.draw do
  root 'start_page#index'
  get 'cv', to: 'cv#index'
  get 'todos', to: 'todos#index'
  post 'todos', to: 'todos#create'
  post 'todos/check/:id', to: 'todos#check'
  delete 'todos/:id', to: 'todos#destroy', as: :todo
end
