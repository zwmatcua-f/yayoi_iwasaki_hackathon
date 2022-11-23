
# syntax=docker/dockerfile:1

FROM golang:1.16-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY ./ .

<<<<<<< HEAD:hackathon/back/dockerfile
CMD["go","run","."]
=======

CMD["go","run","."]
>>>>>>> e4639df4b783a8d8588b0b0399b9774ef4f3babc:hackathon/back/Dockerfile
