FROM alpine:3.19
FROM moby/buildkit:master

RUN apk update && apk add bash aws-cli curl

COPY build.sh ./build.sh

RUN chmod +x ./build.sh

ENTRYPOINT [ "./build.sh" ]
