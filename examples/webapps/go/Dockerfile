# Use an official Go image as the base image
FROM golang:1.23.2

# Set the working directory inside the container
WORKDIR /app

# Copy the go.mod and go.sum files
COPY go.mod ./

# Copy the source code to the container
COPY . .

# Build the Go application
RUN go build -o ./webapp .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
ENTRYPOINT ["./webapp"]
