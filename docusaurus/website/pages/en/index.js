/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
    render() {
        const { siteConfig } = this.props;

        const SplashContainer = (props) => (
            <div className="homeContainer">
                <div className="homeSplashFade">
                    <div className="wrapper homeWrapper">{props.children}</div>
                </div>
            </div>
        );

        const ProjectTitle = () => (
            <h2 className="projectTitle">
                <img src={siteConfig.logo} alt="Project Logo" width="218" />
                <small>{siteConfig.tagline}</small>
            </h2>
        );

        return (
            <SplashContainer>
                <div className="inner">
                    <ProjectTitle siteConfig={siteConfig} />
                </div>
            </SplashContainer>
        );
    }
}

class Index extends React.Component {
    render() {
        const { config: siteConfig, language = '' } = this.props;
        const { baseUrl } = siteConfig;

        const Block = (props) => (
            <Container
                padding={['bottom', 'top']}
                id={props.id}
                background={props.background}
            >
                <GridBlock
                    align="center"
                    contents={props.children}
                    layout={props.layout}
                />
            </Container>
        );

        const FeatureCallout = () => (
            <div
                className="productShowcaseSection paddingBottom"
                style={{ textAlign: 'center' }}
            >
                <h2>Feature Callout</h2>
                <MarkdownBlock>
                    These are features of this project
                </MarkdownBlock>
            </div>
        );

        const DeveloperProductivity = () => (
            <Block id="developer-productivity" background="light">
                {[
                    {
                        content: `Each package has been designed to build developer productivity 📈.
                        Each package will have a single focus making them small and convenient.`,
                        image: `${baseUrl}img/undraw_productivity.svg`,
                        imageAlign: 'left',
                        title: 'Developer producitivty'
                    }
                ]}
            </Block>
        );

        const MultiplePackages = () => (
            <Block id="multiple-packages">
                {[
                    {
                        content: `Idearium Lib has multiple packages 📦, each with a home
                        in the \`@idearium\` namespace. Install only the packages you need to save on bytes 🚀.
                        Each package is individually versioned and comes with documentation 📖.
                        `,
                        image: `${baseUrl}img/undraw_packages.svg`,
                        imageAlign: 'right',
                        title: 'Multiple packages'
                    }
                ]}
            </Block>
        );

        const ES6 = () => (
            <Block id="modern-language">
                {[
                    {
                        content: `All packages are written in ES6 and transformed into
                        CommonJS modules giving you flexibility in where you can use them.`,
                        image: `${baseUrl}img/undraw_es6.svg`,
                        imageAlign: 'right',
                        title: 'Modern language'
                    }
                ]}
            </Block>
        );

        return (
            <div>
                <HomeSplash siteConfig={siteConfig} language={language} />
                <div className="mainContainer">
                    <MultiplePackages />
                    <DeveloperProductivity />
                    <ES6 />
                </div>
            </div>
        );
    }
}

module.exports = Index;
