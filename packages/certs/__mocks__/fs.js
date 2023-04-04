'use strict';

const path = require('path');
const fs = jest.createMockFromModule('fs');

let mockFiles = {};
const pathParts = (p) => p.split(path.sep).filter((part) => part.length > 0);

const traverse = (dir) => {
    const parts = pathParts(dir);
    let traversedPath = '';
    let place = mockFiles;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        traversedPath += `/${part}`;

        if (place[part]) {
            place = place[part];
        } else {
            throw new Error(
                `ENOENT: no such file or directory, scandir '${traversedPath}'`
            );
        }
    }

    return place;
};

fs.__setMockFiles = (newMockFiles) => {
    mockFiles = {};

    for (const file in newMockFiles) {
        const parts = pathParts(file);
        let place = mockFiles;

        parts.forEach((part) => {
            if (!path.extname(part)) {
                if (!place[part]) {
                    place[part] = {};
                }

                place = place[part];
            }

            if (path.extname(part)) {
                place[part] = newMockFiles[file];
            }
        });
    }
};

fs.readdir = (dir, callback) => {
    try {
        const results = Object.keys(traverse(dir));
        return callback(null, results);
    } catch (e) {
        return callback(e, null);
    }
};

fs.readFile = (file, encoding, callback) => {
    if (!callback) {
        callback = encoding;
    }

    const parts = pathParts(file);
    let place = mockFiles;
    let data;

    parts.forEach((pathPart) => {
        if (!path.extname(pathPart) && place[pathPart]) {
            place = place[pathPart];
        }

        if (path.extname(pathPart) && place[pathPart]) {
            data = place[pathPart];
        }
    });

    return callback(null, data);
};

module.exports = fs;
