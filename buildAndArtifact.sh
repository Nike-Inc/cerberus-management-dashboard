#!/usr/bin/env bash

function join { local IFS="$1"; shift; echo "$*"; }

currentVersions=$(curl -s 'http://repo.nikedev.com:8081/artifactory/api/search/versions?g=com.nike.cpe&a=cerberus-dashboard&repos=blueprint-release')
latestArtifactoryVersion=$(echo ${currentVersions} | jq -r .results[0].version)
echo "The latest version in Artifactory is: ${latestArtifactoryVersion}"

VALID_SEMANTIC_VERSION_PATTERN='[0-9]+\.[0-9]+\.[0-9]+'

if ! [[ $latestArtifactoryVersion =~ $VALID_SEMANTIC_VERSION_PATTERN ]]
then
    echo "the latest version in artifactory does not match a semantic version format"
    exit 1
fi

packageJson=$(cat package.json)
packageDefinedVersion=$(echo ${packageJson} | jq -r .version)
echo "The version defined in the package json is ${packageDefinedVersion}"

if ! [[ $packageDefinedVersion =~ $VALID_SEMANTIC_VERSION_PATTERN ]]
then
    echo "The version in package.json does not match a semantic version format"
    exit 1
fi

IFS='.' read -r -a artifactoryVersionPieces <<< "${latestArtifactoryVersion}"
IFS='.' read -r -a packageDefinedVersionPieces <<< "${packageDefinedVersion}"

avMajor=$(echo "${artifactoryVersionPieces[0]}")
avMinor=$(echo "${artifactoryVersionPieces[1]}")
avPatch=$(echo "${artifactoryVersionPieces[2]}")
pvMajor=$(echo "${packageDefinedVersionPieces[0]}")
pvMinor=$(echo "${packageDefinedVersionPieces[1]}")

if [ "$avMajor" -gt "$pvMajor" ]
then
    echo "Error the major version is Artifactory is greater than what you have defined in the package json\nThe major and minor versions must be controlled in package.json"
    exit 1
fi

if [ "$avMajor" -eq "$pvMajor" ] && [ "$avMinor" -gt "$pvMinor" ]
then
    echo "Error the minor version is Artifactory is greater than what you have defined in the package json\nThe major and minor versions must be controlled in package.json"
    exit 1
fi

if [ "$pvMajor" -gt "$avMajor" ]
then
    echo "Package json major version number is greater using package defined version."
    VERSION=${packageDefinedVersion}
else
    if [ "$pvMinor" -gt "$avMinor" ]
    then
        echo "Package json minor version number is greater using package defined version."
        VERSION=${packageDefinedVersion}
    else
        artifactoryVersionPieces[2]=$((avPatch+1))
        VERSION=$(join . "${artifactoryVersionPieces[@]}")
        echo "Major and minor versions are unchanged incrementing patch and using version: ${VERSION}"
    fi
fi

npm install
npm run build
cd build/
tar -zcvf ../cerberus-dashboard-${VERSION}.tar.gz ./*
cd ../
curl -v --user maven:ludist --data-binary @cerberus-dashboard-${VERSION}.tar.gz -X PUT "http://repo.nikedev.com:8081/artifactory/blueprint-release/com/nike/cpe/cerberus-dashboard/${VERSION}/cerberus-dashboard-${VERSION}.tar.gz"

