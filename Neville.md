##Go specific instructions:##

Make sure you are using Go's recommended folder structure.
Following Go's setup instructions should ensure this but in short it's:
$GOPATH/src/github.com/~github username~/~repo~

Go dependency installation is still a bit of a mystery to me. I think you can just run "go install" from the server folder (or wherever main package is).

If that doesn't work, run 'go get' on:
* github.com/gorilla/mux
* github.com/dchest/uniuri
* github.com/gorilla/websocket

To start server run:
```
go run editor/*.go
```
from root.

## Deployment with Docker
Assuming the dockerfile is ok, docker hub will build a new image each time we push a new version to the main repo. Deployment on digital ocean is trivial. Choose the "Docker 1.12.5, Ubuntu 16.04" droplet, once it's been created, SSH in and run:
```
docker run -p 443:8443 tesislab/tesis
```
And docker will download and run the latest build exposing port 443 (which is bound to 8443 from the internals of docker).
*nb: builds take ~10min on docker hub, so if you've just pushed, give it time to build the latest image.

If you have previously run an image, docker will cache it locally. At present there doesn't seem to be an elegant way to handle this (big thread on docker github about it), so to get the latest you need to remove the version you have, then get the new one, so run:
```
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```
to stop then remove all containers, then you can just remove the image:
```
docker rmi tesislab/tesis
```
then just run the docker run above.
