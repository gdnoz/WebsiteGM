Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/cms', as: 'rails_admin'
  devise_for :admins
  root to: "start_page#index"

  get 'cv', to: 'cv#index'

  get 'todos', to: 'todos#index'
  post 'todos', to: 'todos#create'
  put 'todos/:id', to: 'todos#update'
  delete 'todos/:id', to: 'todos#destroy', as: :todo
end
