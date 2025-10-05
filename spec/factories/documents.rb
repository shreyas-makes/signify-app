# frozen_string_literal: true

FactoryBot.define do
  factory :document do
    sequence(:title) { |n| "Document #{n}" }
    content { "This is sample document content for testing purposes." }
    sequence(:slug) { |n| "document-#{n}" }
    status { :draft }
    association :user
    published_at { nil }

    trait :published do
      status { :published }
      published_at { 1.day.ago }
    end

    trait :with_content do
      content { "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
    end

    trait :without_content do
      content { nil }
    end
  end
end
