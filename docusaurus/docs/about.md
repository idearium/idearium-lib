---
id: about
title: About
sidebar_label: About
slug: /
---

Idearium Lib is group of es6 packages built by Idearium for Idearium. We use these packages across all of our development work and applications on a daily basis. You'll find most of these packages on [NPM](https://www.npmjs.com/search?q=%40idearium).

## Monorepo

The [Idearium Lib repository](https://github.com/idearium/idearium-lib) is a monorepo. It features all of our [packages](https://github.com/idearium/idearium-lib/tree/monorepo/packages). We use Yarn's workspaces feature to make it easy to manage multiple packages in one Git repository.

## Versioning

Each package is individually versioned. We don't version the entire repository.

We use semver for versioning, however, each version is prefixed with the package is corresponds to, for example, <code>@idearium/lists-v1.0.0</code>.

You can find all of [our releases on GitHub](https://github.com/idearium/idearium-lib/releases).

## Publishing

We use GitHub Actions and workflows to test our packages and publish them at the appropriate time.

Each package has a [workflow](https://github.com/idearium/idearium-lib/tree/monorepo/.github/workflows) to handle the idiosyncrasies of each particular package.

You can find all of [our releases on GitHub](https://github.com/idearium/idearium-lib/releases).

## Docs

The Idearium Lib docs are auto deployed whenever there is a change made and the PR is merged into the main branch (feature-monorepo).
