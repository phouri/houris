#!/bin/sh
echo $GCLOUD_KEY | base64 --decode --ignore-garbage > ${HOME}/gcloud-service-key.json
# Install gcloud
curl https://dl.google.com/dl/cloudsdk/channels/rapid/install_google_cloud_sdk.bash -o gcloud_install.sh
sudo sh gcloud_install.sh --disable-prompts --install-dir="/bin"

sudo /bin/google-cloud-sdk/bin/gcloud --quiet components update
sudo /bin/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
sudo /bin/google-cloud-sdk/bin/gcloud config set project hourisnetwork
sudo /bin/google-cloud-sdk/bin/gcloud -q app deploy app.yaml --promote 
