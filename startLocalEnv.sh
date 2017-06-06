#!/bin/bash

export VAULT_PORT=8200
export CMS_DEBUG_PORT=5005

# trap ctrl-c and call ctrl_c()
trap ctrl_c INT

function ctrl_c() {
        kill -9 ${SERVER_PID}
        kill -9 ${CERBERUS_MANAGEMENT_SERVICE_PID}
        kill -9 ${VAULT_PID}
        exit 1
}

mkdir -p logs

echo "Starting Cerberus Dashboard local dev env"
echo ""

echo ""
echo "Starting vault locally"

vault server -config=local-persist.hcl 1>logs/vault.stdout.log 2>&1 &
data=$(curl -s -X PUT -d '{"secret_shares":5, "secret_threshold": 3}' http://127.0.0.1:$VAULT_PORT/v1/sys/init)
VAULT_PID=$!

echo ""
echo "Waiting for vault to start"
sleep 1

if [ -a vault/init-data.json ]
    then
        echo "Loaded vault data from vault/init-data.json"
        data=$(cat vault/init-data.json)
    else
        echo "Initializing vault"
        data=$(curl -s -X PUT -d '{"secret_shares":5, "secret_threshold": 3}' http://127.0.0.1:$VAULT_PORT/v1/sys/init)
        echo ${data} > vault/init-data.json
fi

echo "complete bootstrap: ${BOOTSTRAP}"

echo Data = ${data}
if [ -z ${data} ]
then
    echo "vault init data null something went wrong"
    exit 1
fi

ROOT_TOKEN=$(echo ${data} | jq -r .root_token)
for key in $(echo ${data} | jq -r .keys[])
do
    curl -s -X PUT -d "{\"key\":\"${key}\"}" http://127.0.0.1:$VAULT_PORT/v1/sys/unseal
done

curl -s -X PUT -d '{"rules": "path \"auth/token/lookup\" {policy = \"read\"}"}' -H "X-Vault-Token: ${ROOT_TOKEN}"  http://localhost:$VAULT_PORT/v1/sys/policy/lookup-self
VAULT_TOKEN=$(curl -sb -X POST -d '{"display_name":"cerberus-management-service-token"}' -H "X-Vault-Token: ${ROOT_TOKEN}"  http://localhost:$VAULT_PORT/v1/auth/token/create | jq -r .auth.client_token)
export VAULT_TOKEN=${VAULT_TOKEN}

VAULT_ADDR="http://localhost:8200"
export VAULT_ADDR=${VAULT_ADDR}

echo
echo "Starting CMS Locally"
../cerberus-management-service/gradlew -b ../cerberus-management-service/build.gradle clean build -x check
java -jar -D@appId=cms -D@environment=local -Dvault.addr=${VAULT_ADDR} -Dvault.token=${VAULT_TOKEN} -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=$CMS_DEBUG_PORT ../cerberus-management-service/build/libs/*.jar 1>logs/cerberus-management-service.stdout.log 2>&1 &
CERBERUS_MANAGEMENT_SERVICE_PID=$!


echo "Starting webpack local server for dashboard"
echo "{\"version\":\"$(git describe --tags)\"}" > build/metadata.json
node server.js 1>logs/local-server.stdout.log 2>&1 &
SERVER_PID=$!

echo
echo
echo "Press CTR+C to shutdown"
echo
echo

while :
do
    sleep 1
done