# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    name { "Test User" }
    display_name { "TestUser#{rand(1000)}" }
    password { "Secret1*3*5*" }
    verified { true }
  end
end
