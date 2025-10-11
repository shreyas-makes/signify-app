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

ActiveRecord::Schema[8.0].define(version: 2025_10_10_213016) do
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
    t.index ["public_slug"], name: "index_documents_on_public_slug", unique: true, where: "public_slug IS NOT NULL"
    t.index ["published_at"], name: "index_documents_on_published_at"
    t.index ["slug"], name: "index_documents_on_slug", unique: true
    t.index ["status"], name: "index_documents_on_status"
    t.index ["user_id"], name: "index_documents_on_user_id"
  end

  create_table "keystrokes", force: :cascade do |t|
    t.integer "document_id", null: false
    t.integer "event_type"
    t.string "key_code"
    t.string "character"
    t.datetime "timestamp"
    t.integer "sequence_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "cursor_position"
    t.index ["document_id", "sequence_number"], name: "index_keystrokes_on_document_id_and_sequence_number"
    t.index ["document_id"], name: "index_keystrokes_on_document_id"
    t.index ["timestamp"], name: "index_keystrokes_on_timestamp"
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
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "documents", "users"
  add_foreign_key "keystrokes", "documents"
  add_foreign_key "sessions", "users"
end
