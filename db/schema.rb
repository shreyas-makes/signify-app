# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_01_31_021000) do
  create_table "documents", force: :cascade do |t|
    t.string "title", null: false
    t.text "content"
    t.string "slug"
    t.integer "status"
    t.integer "user_id", null: false
    t.datetime "published_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "public_slug"
    t.integer "word_count", default: 0
    t.integer "reading_time_minutes", default: 0
    t.integer "keystroke_count", default: 0
    t.string "subtitle"
    t.boolean "hidden_from_public", default: false, null: false
    t.integer "kudos_count", default: 0, null: false
    t.index ["hidden_from_public"], name: "index_documents_on_hidden_from_public"
    t.index ["public_slug"], name: "index_documents_on_public_slug", unique: true, where: "public_slug IS NOT NULL"
    t.index ["published_at"], name: "index_documents_on_published_at"
    t.index ["slug"], name: "index_documents_on_slug", unique: true
    t.index ["status"], name: "index_documents_on_status"
    t.index ["user_id"], name: "index_documents_on_user_id"
  end

  create_table "extension_auth_codes", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "code", null: false
    t.string "state"
    t.string "redirect_uri", null: false
    t.datetime "expires_at", null: false
    t.datetime "redeemed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_extension_auth_codes_on_code", unique: true
    t.index ["expires_at"], name: "index_extension_auth_codes_on_expires_at"
    t.index ["user_id"], name: "index_extension_auth_codes_on_user_id"
  end

  create_table "keystrokes", force: :cascade do |t|
    t.integer "document_id"
    t.integer "event_type"
    t.string "key_code"
    t.string "character"
    t.datetime "timestamp"
    t.integer "sequence_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "cursor_position"
    t.integer "verification_id"
    t.index ["document_id", "sequence_number"], name: "index_keystrokes_on_document_id_and_sequence_number"
    t.index ["document_id"], name: "index_keystrokes_on_document_id"
    t.index ["timestamp"], name: "index_keystrokes_on_timestamp"
    t.index ["verification_id", "sequence_number"], name: "index_keystrokes_on_verification_id_and_sequence_number", unique: true
    t.index ["verification_id"], name: "index_keystrokes_on_verification_id"
  end

  create_table "kudos", force: :cascade do |t|
    t.integer "document_id", null: false
    t.string "visitor_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["document_id", "visitor_id"], name: "index_kudos_on_document_id_and_visitor_id", unique: true
    t.index ["document_id"], name: "index_kudos_on_document_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "user_agent"
    t.string "ip_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.boolean "verified", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "display_name"
    t.boolean "admin", default: false, null: false
    t.string "avatar_url"
    t.text "bio"
    t.datetime "onboarded_at"
    t.string "username", null: false
    t.string "api_token"
    t.index ["api_token"], name: "index_users_on_api_token", unique: true, where: "api_token IS NOT NULL"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "verifications", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "platform", null: false
    t.string "content_hash", null: false
    t.integer "status", default: 0, null: false
    t.json "keystroke_stats", default: {}, null: false
    t.json "paste_events", default: {}, null: false
    t.datetime "start_at"
    t.datetime "end_at"
    t.string "public_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["public_id"], name: "index_verifications_on_public_id", unique: true
    t.index ["user_id", "created_at"], name: "index_verifications_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_verifications_on_user_id"
  end

  add_foreign_key "documents", "users"
  add_foreign_key "extension_auth_codes", "users"
  add_foreign_key "keystrokes", "documents"
  add_foreign_key "keystrokes", "verifications"
  add_foreign_key "kudos", "documents"
  add_foreign_key "sessions", "users"
  add_foreign_key "verifications", "users"
end
