#!/usr/bin/env bash

npm_install_in_container () {

    # remove the trailing / if there is any (this allows user to use tab to complete the container name which corresponding to the directory name)
    local CONTAINERNAME=$1

    # Build the NPM command
    local COMMANDSTR=$2

    # Determine paths to node_modules and package.json
    local CONTAINERPATH=./$CONTAINERNAME/root/app
    local NODEMODULESPATH=$CONTAINERPATH/node_modules
    local PACKAGEDOTJSONPATH=$CONTAINERPATH/package.json

    if [ "$CONTAINERNAME" = "idearium-lib" ]; then
        CONTAINERPATH=/vagrant/$CONTAINERNAME
        NODEMODULESPATH=$CONTAINERPATH/node_modules
        PACKAGEDOTJSONPATH=$CONTAINERPATH/package.json
    fi

    printf "\nIn $CONTAINERPATH executing:"
    printf "\n$COMMANDSTR\n\n"

    printf "\nCreating directory structure...\n\n"

    # Create a folder if it doesn't exist for the package.json
    mkdir -p /npm/$CONTAINERNAME
    mkdir -p /npm/$CONTAINERNAME/node_modules

    # Make sure the node_modules directory in the target exists
    mkdir -p $NODEMODULESPATH

    # Empty the directory if it does exist
    rm -rf /npm/$CONTAINERNAME/node_modules/*

    if [ ! -e $PACKAGEDOTJSONPATH ]; then
        printf "\nError: Could not find a package.json file at $PACKAGEDOTJSONPATH.\n\n"
        exit 1
    fi

    printf "\nCopying package.json and node_modules...\n\n"

    # Copy the package.json and node_modules across
    cp -f $PACKAGEDOTJSONPATH /npm/$CONTAINERNAME
    cp -rf $NODEMODULESPATH/* /npm/$CONTAINERNAME/node_modules

    # Move into the correct directory.
    cd /npm/$CONTAINERNAME

    printf "\nRunning the NPM command...\n\n"

    # Install the node modules
    eval $COMMANDSTR

    # Move back into the `/vagrant` directory.
    cd /vagrant

    printf "\nUpdating $NODEMODULESPATH\n\n"

    # Remove the current node_modules
    rm -rf $NODEMODULESPATH/*

    # Copy the newly installed ones across, and the package.json
    cp -fr /npm/$CONTAINERNAME/node_modules/* $NODEMODULESPATH
    cp -f /npm/$CONTAINERNAME/package.json $CONTAINERPATH
    if [ -e /npm/$CONTAINERNAME/node_modules/.bin ]; then
        mkdir -p $NODEMODULESPATH/.bin
        cp -fr /npm/$CONTAINERNAME/node_modules/.bin/* $NODEMODULESPATH/.bin
    fi

}

# Assume the appropriate working directory.
cd /vagrant

# Setup NPM. Build the NPM modules.
npm_install_in_container "idearium-lib" "npm install"

# Pull the images.
dc pull

# Build the images.
dc build

# Start docker-compose.
dc up -d
