/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
    const { config: siteConfig, language = '' } = props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = (doc) => `${baseUrl}${docsPart}${langPart}${doc}`;

    return (
        <div className="docMainWrapper wrapper">
            <Container className="mainContainer documentContainer postContainer">
                <div className="post">
                    <header className="postHeader">
                        <h1>About</h1>
                    </header>
                    <p>
                        Idearium Lib is group of es6 packages built by Idearium
                        for Idearium. We use these packages across all of our
                        development work and applications on a daily basis.
                        You'll find most of these packages on{' '}
                        <a href="https://www.npmjs.com/search?q=%40idearium">
                            NPM
                        </a>
                        .
                    </p>
                    <h2>Monorepo</h2>
                    <p>
                        The{' '}
                        <a href="https://github.com/idearium/idearium-lib">
                            Idearium Lib repository
                        </a>{' '}
                        is a monorepo. It features all of our{' '}
                        <a href="https://github.com/idearium/idearium-lib/tree/monorepo/packages">
                            packages
                        </a>
                        . We use Yarn's workspaces feature to make it easy to
                        manage multiple packages in one Git repository.
                    </p>
                    <h2>Versioning</h2>
                    <p>
                        Each package is individually versioned. We don't version
                        the entire repository.
                    </p>
                    <p>
                        We use semver for versioning, however, each version is
                        prefixed with the package is corresponds to, for
                        example, <code>@idearium/lists-v1.0.0</code>.
                    </p>
                    <p>
                        You can find all of{' '}
                        <a href="https://github.com/idearium/idearium-lib/releases">
                            our releases on GitHub
                        </a>
                        .
                    </p>
                    <h2>Publishing</h2>
                    <p>
                        We use GitHub Actions and workflows to test our packages
                        and publish them at the appropriate time.
                    </p>
                    <p>
                        Each package has a{' '}
                        <a href="https://github.com/idearium/idearium-lib/tree/monorepo/.github/workflows">
                            workflow
                        </a>{' '}
                        to handle the idiosyncrasies of each particular package.
                    </p>

                    <p>
                        You can find all of{' '}
                        <a href="https://github.com/idearium/idearium-lib/releases">
                            our releases on GitHub
                        </a>
                        .
                    </p>
                </div>
            </Container>
        </div>
    );
}

module.exports = Help;
