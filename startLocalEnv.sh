#!/bin/bash

# trap ctrl-c and call ctrl_c()
trap ctrl_c INT

function ctrl_c() {
        kill -9 ${SERVER_PID}
        kill -9 ${CERBERUS_MANAGEMENT_SERVICE_PID}
        kill -9 ${VAULT_PID}
        exit 1
}

mkdir -p logs

USE_MOCK_CMS="false"

while [[ $# > 1 ]]
do
key="$1"

case $key in
    -m|--use-mock-cms)
    USE_MOCK_CMS="$2"
    shift # past argument
    ;;
    *)
            # unknown option
    ;;
esac
shift # past argument or value
done

echo "Using Mocks: ${USE_MOCK_CMS}"

echo "Starting Cerberus Dashboard local dev env"
echo ""

echo ""
echo "Starting vault locally"

if [ ${USE_MOCK_CMS} = "true" ]
    then
        vault server -config=local-inmem.hcl 1>logs/vault.stdout.log 2>&1 &
    else
        vault server -config=local-persist.hcl 1>logs/vault.stdout.log 2>&1 &
        data=$(curl -s -X PUT -d '{"secret_shares":5, "secret_threshold": 3}' http://127.0.0.1:8200/v1/sys/init)
fi
VAULT_PID=$!

echo ""
echo "Waiting for vault to start"
sleep 1

if [ -a vault/init-data.json ]
    then
        BOOTSTRAP="false"
    else
        BOOTSTRAP="true"
fi

echo "complete bootstrap: ${BOOTSTRAP}"

echo ""
echo "Bootstrapping vault"
if [ ${USE_MOCK_CMS} = "true" ] || [ ${BOOTSTRAP} == "true" ]
    then
        echo "Initializing vault"
        data=$(curl -s -X PUT -d '{"secret_shares":5, "secret_threshold": 3}' http://127.0.0.1:8200/v1/sys/init)
        echo ${data} > vault/init-data.json
    else
        echo "Loaded vault data from vault/init-data.json"
        data=$(cat vault/init-data.json)
fi

echo Data = ${data}
if [ -z ${data} ]
then
    echo "vault init data null something went wrong"
    exit 1
fi

ROOT_TOKEN=$(echo ${data} | jq -r .root_token)
for key in $(echo ${data} | jq -r .keys[])
do
    curl -s -X PUT -d "{\"key\":\"${key}\"}" http://127.0.0.1:8200/v1/sys/unseal
done

if [ ${USE_MOCK_CMS} = "true" ]
    then
        echo "Starting Mock CMS Server"
        ./node_modules/api-mock/bin/api-mock mocks/API.md --port 8080 1>logs/api-mock.stdout.log 2>&1 &
        curl -s -X POST -d '{"id":"7f6808f1-ede3-2177-aa9d-45f507391310"}' -H "X-Vault-Token: ${ROOT_TOKEN}" http://localhost:8200/v1/auth/token/create

        echo ""
        echo "Loading some test data for app/stage"
        curl -s -X POST -d '{"super_secret_thing":"I am a super elite secret key"}' -H "X-Vault-Token: ${ROOT_TOKEN}" http://localhost:8200/v1/secret/app/stage
        curl -s -X POST -d '{"super_secret_thing":"I am a super elite secret key"}' -H "X-Vault-Token: ${ROOT_TOKEN}" http://localhost:8200/v1/secret/app/stage/other_key
        curl -s -X POST -d '{"super_secret_thing":"I am a super elite secret key2"}' -H "X-Vault-Token: ${ROOT_TOKEN}" http://localhost:8200/v1/secret/app/stage/private_key
        curl -s -X POST -d '{"super_secret_thing":"I am a super elite secret key2"}' -H "X-Vault-Token: ${ROOT_TOKEN}" http://localhost:8200/v1/secret/app/stage/private_key/sub_key
        curl -s -X POST -d '{"super_secret_thing":"I am a super elite secret key2"}' -H "X-Vault-Token: ${ROOT_TOKEN}" http://localhost:8200/v1/secret/app/stage/private_key/sub_alt_key
    else
        curl -s -X PUT -d '{"rules": "path \"auth/token/lookup\" {policy = \"read\"}"}' -H "X-Vault-Token: ${ROOT_TOKEN}"  http://localhost:8200/v1/sys/policy/lookup-self
        VAULT_TOKEN=$(curl -sb -X POST -d '{"display_name":"cerberus-management-service-token"}' -H "X-Vault-Token: ${ROOT_TOKEN}"  http://localhost:8200/v1/auth/token/create | jq -r .auth.client_token)
        export VAULT_TOKEN=${VAULT_TOKEN}

        VAULT_ADDR="http://localhost:8200"
        export VAULT_ADDR=${VAULT_ADDR}

        echo
        echo "Starting CMS Locally"
        ../cerberus-management-service/gradlew -b ../cerberus-management-service/build.gradle clean build -x check
        java -jar -D@appId=cms -D@environment=local -Dvault.addr=${VAULT_ADDR} -Dvault.token=${VAULT_TOKEN} -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 ../cerberus-management-service/build/libs/*.jar 1>logs/cerberus-management-service.stdout.log 2>&1 &
fi
CERBERUS_MANAGEMENT_SERVICE_PID=$!


echo "Started webpack local server for dashboard"
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