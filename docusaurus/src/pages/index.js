import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
    {
        description: (
            <>
                Idearium Lib has multiple packages 📦, each with a home in the{' '}
                <code>@idearium</code> namespace. Install only the packages you
                need to save on bytes 🚀. Each package is individually versioned
                and comes with documentation 📖.
            </>
        ),
        imageUrl: `img/undraw_packages.svg`,
        title: 'Multiple packages'
    },
    {
        description: (
            <>
                Each package has been designed to build developer productivity
                📈. Each package will have a single focus making them small and
                convenient.
            </>
        ),
        imageUrl: `img/undraw_productivity.svg`,
        title: 'Developer productivity'
    },
    {
        description: (
            <>
                All packages are written in ES6 and transformed into CommonJS
                modules giving you flexibility in where you can use them.
            </>
        ),
        imageUrl: `img/undraw_es6.svg`,
        title: 'Modern language'
    }
];

const Feature = ({ imageUrl, title, description }) => {
    const imgUrl = useBaseUrl(imageUrl);

    return (
        <div className={clsx('col col--4', styles.feature)}>
            {imgUrl && (
                <div className="text--center">
                    <img
                        className={styles.featureImage}
                        src={imgUrl}
                        alt={title}
                    />
                </div>
            )}
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

const Home = () => {
    const context = useDocusaurusContext();
    const { siteConfig = {} } = context;

    return (
        <Layout
            title=""
            description={`${siteConfig.title} - For developer productivity`}
        >
            <header className={clsx('hero hero--primary', styles.heroBanner)}>
                <div className="container">
                    <h1 className="hero__title">{siteConfig.title}</h1>
                    <p className="hero__subtitle">{siteConfig.tagline}</p>
                    <div className={styles.buttons}>
                        <Link
                            className={clsx(
                                'button button--outline button--secondary button--lg',
                                styles.getStarted,
                                styles.button
                            )}
                            to={useBaseUrl('docs/')}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>
            <main>
                {features && features.length > 0 && (
                    <section className={styles.features}>
                        <div className="container">
                            <div className="row">
                                {features.map((props, idx) => (
                                    <Feature key={idx} {...props} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </Layout>
    );
};

export default Home;
