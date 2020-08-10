export VM_IP_ADDRESS=`curl -fs http://metadata/computeMetadata/v1/instance/attributes/VM_IP_ADDRESS \
    -H "Metadata-Flavor: Google"`

export WA_DB_HOST_NAME=`curl -fs http://metadata/computeMetadata/v1/instance/attributes/WA_DB_HOST_NAME \
    -H "Metadata-Flavor: Google"`

export WA_DB_USERNAME=`curl -fs http://metadata/computeMetadata/v1/instance/attributes/WA_DB_USERNAME \
    -H "Metadata-Flavor: Google"`

export WA_DB_PASSWORD=`curl -fs http://metadata/computeMetadata/v1/instance/attributes/WA_DB_PASSWORD \
    -H "Metadata-Flavor: Google"`

export WA_API_VERSION=`curl -fs http://metadata/computeMetadata/v1/instance/attributes/WA_API_VERSION \
    -H "Metadata-Flavor: Google"`

echo "WA_DB_ENGINE=PGSQL" > db.env
echo "WA_DB_PORT=5432" >> db.env
echo "WA_DB_HOSTNAME="$WA_DB_HOST_NAME >> db.env
echo "WA_DB_USERNAME="$WA_DB_USERNAME >> db.env
echo "WA_DB_PASSWORD="$WA_DB_PASSWORD >> db.env

sed -i 's/<VM_IP_ADDRESS>/'"$VM_IP_ADDRESS"'/g' proxy_config/000-default.conf
sed -i 's/<WA_API_VERSION>/'"$WA_API_VERSION"'/g' docker-compose.yml

docker image prune
docker container prune

docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:$PWD" \
    -w="$PWD" \
    docker/compose:1.24.0 up -d
    
