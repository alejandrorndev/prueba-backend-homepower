terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Construir la imagen desde tu Dockerfile
resource "docker_image" "nest_api" {
  name = "nest-api:latest"
  build {
    context    = "${path.module}"
    dockerfile = "Dockerfile"
  }
}

# Crear contenedor
resource "docker_container" "nest_api" {
  name  = "nest-api"
  image = docker_image.nest_api.image_id
  ports {
    internal = 4000
    external = 4000
  }
}
