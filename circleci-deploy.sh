#!/bin/sh
echo $GCLOUD_KEY | base64 --decode --ignore-garbage > ${HOME}/gcloud-service-key.json
sudo gcloud --quiet components update
sudo gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
sudo gcloud config set project hourisnetwork
sudo gcloud -q app deploy app.yaml --promote 
