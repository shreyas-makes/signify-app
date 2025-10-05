# frozen_string_literal: true

class Document < ApplicationRecord
  belongs_to :user
  has_many :keystrokes, dependent: :destroy

  enum :status, {draft: 0, published: 1}

  validates :title, presence: true, length: {maximum: 255}
  validates :slug, presence: true, uniqueness: true, format: {with: /\A[a-z0-9\-]+\z/}
  validates :status, presence: true

  before_validation :generate_slug, if: -> { slug.blank? }
  before_validation :set_default_status, if: -> { status.blank? }

  scope :published, -> { where(status: :published) }
  scope :drafts, -> { where(status: :draft) }

  private

  def generate_slug
    return unless title.present?

    base_slug = title.parameterize
    slug_candidate = base_slug
    counter = 1

    while Document.exists?(slug: slug_candidate)
      slug_candidate = "#{base_slug}-#{counter}"
      counter += 1
    end

    self.slug = slug_candidate
  end

  def set_default_status
    self.status = :draft
  end
end
