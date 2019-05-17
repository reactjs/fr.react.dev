/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import Container from 'components/Container';
import Header from 'components/Header';
import Layout from 'components/Layout';
import React from 'react';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import names from '../../content/acknowledgements.yml';
import {sharedStyles} from 'theme';
import translators from '../../content/translators.yml';
import {urlRoot} from 'site-constants';

const Acknowlegements = ({data, location}) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Remerciements</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/acknowledgements.html`}
            title="React - Remerciements"
          />

          <div id="contributors" css={sharedStyles.markdown}>
            <p>Nous aimerions remercier nos contributeurs :</p>
            <NameList names={names} />
          </div>

          <br />

          <div id="translators" css={sharedStyles.markdown}>
            <p>
              Nous aimerions également remercier nos traducteurs pour le
              français :
            </p>
            <NameList names={translators} />
            <p>
              Vous pourrez retrouver le détail de leurs contributions dans{' '}
              <a href="https://github.com/reactjs/fr.reactjs.org/tree/master/TRANSLATORS.md">
                ce fichier
              </a>
              .
            </p>
          </div>

          <br />

          <div css={sharedStyles.markdown}>
            <p>Nous souhaitons par ailleurs exprimer notre gratitude à :</p>
            <ul>
              <li>
                <a href="https://github.com/jeffbski">Jeff Barczewski</a> pour
                nous avoir permis d’utiliser le nom de module{' '}
                <a href="https://www.npmjs.com/package/react">react</a> sur npm.
              </li>
              <li>
                <a href="https://christopheraue.net/">Christopher Aue</a> pour
                nous avoir permis d’utiliser le nom de domaine{' '}
                <a href="https://reactjs.com/">reactjs.com</a> et le compte{' '}
                <a href="https://twitter.com/reactjs">@reactjs</a> sur Twitter.
              </li>
              <li>
                <a href="https://github.com/ProjectMoon">ProjectMoon</a> pour
                nous avoir permis d’utiliser le nom de module{' '}
                <a href="https://www.npmjs.com/package/flux">flux</a> sur npm.
              </li>
              <li>
                Shane Anderson pour nous avoir permis d’utiliser l’organisation{' '}
                <a href="https://github.com/react">react</a> sur GitHub.
              </li>
              <li>
                <a href="https://github.com/voronianski">Dmitri Voronianski</a>{' '}
                pour nous avoir permis d’utiliser son thème de couleurs{' '}
                <a href="https://labs.voronianski.com/oceanic-next-color-scheme/">
                  Oceanic Next
                </a>{' '}
                sur ce site web.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

const NameList = ({names}) => (
  <ul
    css={{
      display: 'flex',
      flexWrap: 'wrap',
    }}>
    {names.map((name, index) => (
      <li
        css={{
          flex: '1 0 200px',
        }}
        key={index}>
        {name}
      </li>
    ))}
  </ul>
);

export default Acknowlegements;
