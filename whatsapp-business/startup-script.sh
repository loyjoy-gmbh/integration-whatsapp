!# /bin/bash


export VM_IP_ADDRESS=
export WA_DB_HOST_NAME=
export WA_DB_USERNAME=
export WA_DB_PASSWORD=
export WA_API_VERSION=v2.27.12

git clone https://github.com/uwol/loyjoy-public.git

cd loyjoy-public/whatsapp-business

echo "WA_DB_ENGINE=PGSQL" > db.env
echo "WA_DB_PORT=5432" >> db.env
echo "WA_DB_HOSTNAME="$WA_DB_HOST_NAME >> db.env
echo "WA_DB_USERNAME="$WA_DB_USERNAME >> db.env
echo "WA_DB_PASSWORD="$WA_DB_PASSWORD >> db.env

sed -i 's/<VM_IP_ADDRESS>/'"$VM_IP_ADDRESS"'/g' docker-compose.yml
sed -i 's/<WA_API_VERSION>/'"$WA_API_VERSION"'/g' docker-compose.yml

docker run docker/compose:1.24.0 version && \
docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:$PWD" \
    -w="$PWD" \
    docker/compose:1.24.0 up -d
