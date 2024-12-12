input_mp3_file="$1"

output_directory="../uploads"
mkdir -p "$output_directory"

base_name=$(basename "$input_mp3_file" .mp3)
output_wav_file="$output_directory/${base_name}.pcm"

ffmpeg -y -i "$input_mp3_file" -acodec pcm_s16le -f s16le -ac 1 -ar 16000 "$output_wav_file"

if [ $? -eq 0 ]; then
  echo "Conversion successful: $output_wav_file"
else
  echo "Failed to convert mp3 to wav."
  exit 1
fi