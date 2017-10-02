#!/bin/sh
echo $GCLOUD_KEY | base64 --decode --ignore-garbage > ${HOME}/gcloud-service-key.json
# Install gcloud
curl -L -o google-cloud-sdk.zip https://dl.google.com/dl/cloudsdk/channels/rapid/google-cloud-sdk.zip \
unzip google-cloud-sdk.zip
rm google-cloud-sdk.zip
google-cloud-sdk/install.sh --usage-reporting=false --bash-completion=true --path-update=true --rc-path=/.bashrc
gcloud --quiet components update
gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
gcloud config set project hourisnetwork
gcloud -q app deploy app.yaml --promote 
