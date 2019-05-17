/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Header from 'components/Header';
import Layout from 'components/Layout';
import React from 'react';
<<<<<<< HEAD
import TitleAndMetaTags from 'components/TitleAndMetaTags';
=======
import {urlRoot} from 'site-constants';
>>>>>>> 06deefa56756f8dac13af59ee657186a81d28151
import {sharedStyles} from 'theme';
// $FlowFixMe This is a valid path
import versions from '../../content/versions.yml';

type Props = {
  location: Location,
};

const Versions = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
<<<<<<< HEAD
          <Header>Versions de React</Header>
          <TitleAndMetaTags title="React - Versions" />
=======
          <Header>React Versions</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/versions/`}
            title="React - Versions"
          />
>>>>>>> 06deefa56756f8dac13af59ee657186a81d28151
          <div css={sharedStyles.markdown}>
            <p>
              Un historique complet des versions de React est disponible{' '}
              <a
                href="https://github.com/facebook/react/releases"
                target="_blank"
                rel="noopener">
                sur GitHub
              </a>
              .<br />
              Les documentations pour les versions récentes sont disponibles
              ci-dessous.
            </p>
            <p>
              Consultez notre FAQ pour des informations sur{' '}
              <a href="/docs/faq-versioning.html">
                notre politique de versions et notre engagement en matière de
                stabilité
              </a>
              .
            </p>
            {versions.map(version => (
              <div key={version.title}>
                <h3>{version.title}</h3>
                <ul>
                  <li>
                    <a href={version.changelog} target="_blank" rel="noopener">
                      Changelog
                    </a>
                  </li>
                  {version.path && (
                    <li>
                      <a href={version.path} rel="nofollow">
                        Documentation
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Versions;
