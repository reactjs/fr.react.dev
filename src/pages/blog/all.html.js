/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import {Link, graphql} from 'gatsby';
import {colors, media, sharedStyles} from 'theme';

import Container from 'components/Container';
import Header from 'components/Header';
import Layout from 'components/Layout';
import MetaTitle from 'templates/components/MetaTitle';
import React from 'react';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import type {allMarkdownRemarkData} from 'types';
import toCommaSeparatedList from 'utils/toCommaSeparatedList';
import {urlRoot} from 'site-constants';

type Props = {
  data: allMarkdownRemarkData,
  location: Location,
};

const dateFormatter =
  typeof Intl === 'undefined'
    ? null
    : new Intl.DateTimeFormat('fr', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

const AllBlogPosts = ({data, location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Tous les articles</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/blog/all.html`}
            title="React • Tous les articles"
          />
          <ul
            css={{
              display: 'flex',
              flexWrap: 'wrap',
              marginLeft: -40,
            }}>
            {data.allMarkdownRemark.edges.map(({node}) => {
              const date = dateFormatter
                ? dateFormatter.format(new Date(node.fields.date))
                : node.fields.formattedDate;

              return (
                <li
                  css={{
                    paddingLeft: 40,
                    paddingTop: 40,
                    borderTop: '1px dotted #ececec',
                    paddingBottom: 40,
                    width: '100%',

                    [media.size('medium')]: {
                      width: '50%',
                    },

                    [media.greaterThan('large')]: {
                      width: '33.33%',
                    },
                  }}
                  key={node.fields.slug}>
                  <h2
                    css={{
                      fontSize: 24,
                      color: colors.dark,
                      lineHeight: 1.3,
                      fontWeight: 700,
                    }}>
                    <Link
                      css={{
                        borderBottom: '1px solid #ececec',
                        ':hover': {
                          borderBottomColor: colors.black,
                        },
                      }}
                      key={node.fields.slug}
                      to={node.fields.slug}>
                      {node.frontmatter.title}
                    </Link>
                  </h2>
                  <MetaTitle>{date}</MetaTitle>
                  {node.frontmatter.author ? (
                    <div
                      css={{
                        color: colors.subtle,
                        marginTop: -5,
                      }}>
                      par{' '}
                      {toCommaSeparatedList(node.frontmatter.author, author => (
                        <span key={author.frontmatter.name}>
                          {author.frontmatter.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Container>
  </Layout>
);

export const pageQuery = graphql`
  query AllBlogPostsPageQuery {
    allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/blog/"}}
      sort: {fields: [fields___date], order: DESC}
    ) {
      edges {
        node {
          frontmatter {
            title
            author {
              frontmatter {
                name
                url
              }
            }
          }
          fields {
            date
            formattedDate: date(formatString: "D MMMM YYYY")
            slug
          }
        }
      }
    }
  }
`;

export default AllBlogPosts;
