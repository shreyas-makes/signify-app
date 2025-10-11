# frozen_string_literal: true

Rails.application.routes.draw do
  get  "sign_in", to: "sessions#new", as: :sign_in
  post "sign_in", to: "sessions#create"
  get  "sign_up", to: "users#new", as: :sign_up
  post "sign_up", to: "users#create"

  resources :sessions, only: [:destroy]
  resource :users, only: [:destroy]

  namespace :identity do
    resource :email_verification, only: [:show, :create]
    resource :password_reset,     only: [:new, :edit, :create, :update]
  end

  get :dashboard, to: "dashboard#index"
  post :dashboard_bulk_action, to: "dashboard#bulk_action"

  # Redirect /documents to dashboard
  get "documents", to: redirect("/dashboard")
  
  resources :documents, except: [:show, :index] do
    member do
      post :publish
    end
    collection do
      post :bulk_action
    end
  end

  namespace :settings do
    resource :profile, only: [:show, :update]
    resource :password, only: [:show, :update]
    resource :email, only: [:show, :update]
    resources :sessions, only: [:index]
    inertia :appearance
  end

  # Public post routes (no authentication required)
  get "posts", to: "public/posts#index", as: :public_posts
  get "posts/:public_slug", to: "public/posts#show", as: :public_post
  get "posts/:public_slug/keystrokes", to: "public/posts#keystrokes", as: :public_post_keystrokes
  
  # Data access and verification API
  namespace :api do
    namespace :v1 do
      resources :posts, only: [], param: :public_slug do
        member do
          get :data, to: "data_access#show"
          get :verify, to: "verification#show"
        end
      end
    end
  end
  
  # Raw data downloads (authenticated - user's own documents)
  resources :documents, only: [] do
    member do
      get :download_data
    end
  end

  # Legal pages
  namespace :legal do
    inertia :terms
    inertia :privacy
  end
  
  # Support pages
  namespace :support do
    inertia :contact
  end
  
  # Admin interface
  namespace :admin do
    root "dashboard#index"
    get :dashboard, to: "dashboard#index"
  end
  
  root "home#index"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end
