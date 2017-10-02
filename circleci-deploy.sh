#!/bin/sh
echo $GCLOUD_KEY | base64 --decode --ignore-garbage > ${HOME}/gcloud-service-key.json
sudo /opt/google-cloud-sdk/bin/gcloud --quiet components update
sudo /opt/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
sudo /opt/google-cloud-sdk/bin/gcloud config set project hourisnetwork
sudo /opt/google-cloud-sdk/bin/gcloud -q app deploy app.yaml --promote 
