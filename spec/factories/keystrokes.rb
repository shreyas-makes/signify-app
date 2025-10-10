# frozen_string_literal: true

FactoryBot.define do
  factory :keystroke do
    association :document
    event_type { :keydown }
    key_code { "KeyA" }
    character { "a" }
    timestamp { Time.current }
    sequence(:sequence_number)
    cursor_position { 0 }

    trait :keyup do
      event_type { :keyup }
    end

    trait :space do
      key_code { "Space" }
      character { " " }
    end

    trait :enter do
      key_code { "Enter" }
      character { "\n" }
    end

    trait :backspace do
      key_code { "Backspace" }
      character { "" }
    end
  end
end
