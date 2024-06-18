# Kubernetes Cluster with App1 and App2 on EKS

This repository contains the necessary files to deploy a Kubernetes cluster with two application pods: App1 and App2, on Amazon Elastic Kubernetes Service (EKS). App1 communicates with App2 to complete a request. App1 listens on port 8080, while App2 listens on port 80. App2 pod mounts s3 bucket to read write files.

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
- [Pre-requisites](#pre-requisites)
- [Deployment Instructions](#deployment-instructions)
- [Building Container Images](#building-container-images)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project sets up a simple Kubernetes cluster with two inter-communicating applications. App1 is the entry point for the requests and delegates part of its processing to App2. This example demonstrates basic inter-pod communication within a Kubernetes environment deployed on EKS.

## Architecture

The architecture consists of:
- *App1*: An application that receives external requests on port 8080.
- *App2*: An application that listens on port 80 and is called by App1 to help complete the request.

## Pre-requisites

Ensure you have the following installed and configured:
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [eksctl](https://eksctl.io/introduction/#installation)
- [Docker](https://docs.docker.com/get-docker/)
- An AWS account with appropriate permissions to create EKS clusters and related resources.

## Deployment Instructions

### Step 1: Set Up EKS Cluster

1. *Create an EKS cluster*:
   ```
   eksctl create cluster --name my-cluster --region ap-south-1 --verison 1.29 --nodegroup-name linux-nodes --node-type t3.micro --nodes 1 --nodes-min 0 --nodes-max 1 --managed
   ```

2. *Install [mountpoint-s3-csi-driver](https://github.com/awslabs/mountpoint-s3-csi-driver/blob/main/docs/install.md#deploy-driver)*

3. *Verify the cluster*:
   ```   
   kubectl get all -A
   ```

### Step 2: Clone the Repository

1. *Clone the repository*:
   ```
   git clone https://github.com/ad1mohan/app1-calls-app2-in-eks.git
   cd app1-calls-app2-in-eks
   ```

### Step 3: Build and Push Docker Images

1. *Build the Docker images*:
   ```
   docker build -t your-dockerhub-username/app1:latest ./app1
   docker build -t your-dockerhub-username/app2:latest ./app2
   ```

2. *Push the images to Docker Hub*:
   ```
   docker push your-dockerhub-username/app1:latest
   docker push your-dockerhub-username/app2:latest
   ```

### Step 4: Deploy Applications to EKS

1. *Update the deployment files* to use your Docker Hub images:
   ```
   # In k8s/app1-deployment.yaml and k8s/app2-deployment.yaml
   image: your-dockerhub-username/app1:latest
   image: your-dockerhub-username/app2:latest
   ```

2. *Apply the Kubernetes configurations*:
   ```
   kubectl apply -f k8s/app1-deployment.yaml
   kubectl apply -f k8s/app2-deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

3. *Verify the deployments*:
   ```
   kubectl get pods
   kubectl get services
   ```

## Building Container Images

To build the container images for App1 and App2, use the provided Dockerfiles in the respective directories.

# Building App1 image
```
cd app1
docker buildx build \
  --platform linux/arm64 \
  -t 730335644951.dkr.ecr.ap-south-1.amazonaws.com/app1:arm64 \
  --push \
  .
```
# Building App2 image
```
cd ../app2
docker buildx build \
  --platform linux/arm64 \
  -t 730335644951.dkr.ecr.ap-south-1.amazonaws.com/app2:arm64 \
  --push \
  .
```

## Usage

Once deployed, you can access App1 and send requests to it. App1 will handle the incoming requests and communicate with App2 as needed.

1. *Port forward the App1 service*:
   ```
   kubectl port-forward service/app1-service 8081:8080
   ```

2. *Access App1 on port 8080 using localhost*.

Example:
   ```
   curl http://localhost:8081
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.