# frozen_string_literal: true

class Document < ApplicationRecord
  belongs_to :user
  has_many :keystrokes, dependent: :destroy

  enum :status, {draft: 0, ready_to_publish: 1, published: 2}

  validates :title, length: {maximum: 255}
  validates :slug, presence: true, uniqueness: true, format: {with: /\A[a-z0-9\-]+\z/}
  validates :public_slug, uniqueness: true, allow_nil: true, format: {with: /\A[a-z0-9\-]+\z/}
  validates :status, presence: true
  validates :word_count, :reading_time_minutes, :keystroke_count, presence: true, numericality: {greater_than_or_equal_to: 0}
  
  # Workflow validations  
  validates :published_at, presence: true, if: -> { published? && !status_changed?(to: 'published') }
  validates :public_slug, presence: true, if: -> { published? && !status_changed?(to: 'published') }
  validate :prevent_editing_published_documents, if: -> { published? && persisted? }

  before_validation :generate_slug, if: -> { slug.blank? }
  before_validation :set_default_status, if: -> { status.blank? }
  before_validation :set_default_counts, if: :new_record?
  before_validation :generate_public_slug, if: -> { status_changed?(to: 'published') }
  before_validation :set_published_at, if: -> { status_changed?(to: 'published') }
  before_save :update_content_statistics

  scope :published, -> { where(status: :published) }
  scope :drafts, -> { where(status: :draft) }
  scope :ready_to_publish, -> { where(status: :ready_to_publish) }

  # Convenience methods
  def draft?
    status == 'draft'
  end

  def ready_to_publish?
    status == 'ready_to_publish'
  end

  def published?
    status == 'published'
  end

  def can_edit?
    !published?
  end

  # Content analysis methods
  def calculate_word_count
    return 0 if content.blank?
    # Strip HTML tags and count words
    text_content = ActionController::Base.helpers.strip_tags(content)
    text_content.strip.blank? ? 0 : text_content.strip.split(/\s+/).size
  end

  def calculate_reading_time
    words = calculate_word_count
    (words / 200.0).ceil # 200 words per minute
  end

  def calculate_keystroke_count
    keystrokes.count
  end

  def content_statistics
    {
      word_count: word_count,
      reading_time_minutes: reading_time_minutes,
      keystroke_count: keystroke_count,
      character_count: content&.length || 0
    }
  end

  private

  def generate_slug
    # Generate a slug based on title or use a timestamp-based slug for untitled documents
    if title.present?
      base_slug = title.parameterize.gsub('_', '-')
      base_slug = 'untitled' if base_slug.blank?
    else
      # For empty titles, use a timestamp-based slug
      timestamp = Time.current.strftime("%Y%m%d%H%M%S")
      base_slug = "untitled-#{timestamp}"
    end
    
    slug_candidate = base_slug
    counter = 1

    while Document.exists?(slug: slug_candidate)
      slug_candidate = "#{base_slug}-#{counter}"
      counter += 1
    end

    self.slug = slug_candidate
  end

  def generate_public_slug
    return unless title.present?

    base_slug = title.parameterize
    slug_candidate = base_slug
    counter = 1

    while Document.where.not(id: id).exists?(public_slug: slug_candidate)
      slug_candidate = "#{base_slug}-#{counter}"
      counter += 1
    end

    self.public_slug = slug_candidate
  end

  def set_default_status
    self.status = :draft
  end

  def set_default_counts
    self.word_count ||= 0
    self.reading_time_minutes ||= 0
    self.keystroke_count ||= 0
  end

  def set_published_at
    self.published_at = Time.current if published_at.blank?
  end

  def update_content_statistics
    self.word_count = calculate_word_count
    self.reading_time_minutes = calculate_reading_time
    self.keystroke_count = calculate_keystroke_count
  end

  def prevent_editing_published_documents
    if content_changed? || title_changed?
      errors.add(:base, "Published documents cannot be edited")
    end
  end
end
