input_video_file="$1"

output_directory="../uploads"
mkdir -p "$output_directory"

base_name=$(basename "$input_video_file" .mp4)
output_audio_file="$output_directory/${base_name}.mp3"

ffmpeg -i "$input_video_file" -q:a 0 -map a "$output_audio_file"

if [ $? -eq 0 ]; then
  echo "Audio extracted successfully: $output_audio_file"
else
  echo "Failed to extract audio."
  exit 1
fi