#!/bin/bash

input_video=$1
output_video="prepared-video.mp4"

ffmpeg \
    -i "$input_video" \
    -vcodec h264 \
    -acodec aac \
    -movflags frag_keyframe+empty_moov+default_base_moof \
    -b:v 1500k \
    -maxrate 1500k \
    -bufsize 1000k \
    -f mp4 \
    "$output_video"
