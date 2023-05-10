#!/usr/bin/env bash
sudo apt-get update && \
sudo apt-get install -y curl unzip xvfb libxi6 libgconf-2-4 && \
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
sudo apt install ./google-chrome-stable_current_amd64.deb
