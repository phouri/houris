#!/bin/sh
echo $GCLOUD_KEY | base64 --decode --ignore-garbage > ${HOME}/gcloud-service-key.json
# Install gcloud cause the circle server already has an old version of it installed: https://cloud.google.com/sdk/#deb
# Create an environment variable for the correct distribution
export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)"
# Add the Cloud SDK distribution URI as a package source
echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list
# Import the Google Cloud public key
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
# Update and install the Cloud SDK
sudo apt-get update && sudo apt-get install google-cloud-sdk

export PATH="/usr/lib/google-cloud-sdk/bin:$PATH"

sudo gcloud --quiet components update
sudo gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
sudo gcloud config set project hourisnetwork
sudo gcloud -q app deploy app.yaml --promote 
