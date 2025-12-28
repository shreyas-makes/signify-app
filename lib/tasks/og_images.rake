namespace :og_images do
  desc "Backfill OG images for published posts"
  task backfill: :environment do
    total = Document.public_visible.count
    processed = 0
    generated = 0
    skipped = 0
    failed = 0

    Document.public_visible.find_each do |post|
      processed += 1
      storage_path = OgImageService.storage_path_for(post)
      if File.exist?(storage_path)
        skipped += 1
        next
      end

      if OgImageService.generate_for_post(post)
        generated += 1
      else
        failed += 1
      end
    end

    puts "OG images backfill complete."
    puts "Total: #{total}, Processed: #{processed}, Generated: #{generated}, Skipped: #{skipped}, Failed: #{failed}"
  end
end
