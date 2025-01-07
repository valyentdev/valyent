#!/bin/bash

docker build . -t valyent/builder:latest --platform linux/amd64 
docker push valyent/builder:latest