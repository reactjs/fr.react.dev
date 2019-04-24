/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import Layout from 'components/Layout';
import MarkdownPage from 'components/MarkdownPage';
import React from 'react';
import {createLinkBlog} from 'utils/createLink';
import {graphql} from 'gatsby';

const toSectionList = allMarkdownRemark => [
  {
    title: 'Billets récents',
    items: allMarkdownRemark.edges
      .map(({node}) => ({
        id: node.fields.slug,
        title: node.frontmatter.title,
      }))
      .concat({
        id: '/blog/all.html',
        title: 'Tous les billets…',
      }),
  },
];

const dateFormatter =
  typeof Intl === 'undefined'
    ? null
    : new Intl.DateTimeFormat('fr', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

const Blog = ({data, location}) => {
  let date = dateFormatter
    ? dateFormatter.format(new Date(data.markdownRemark.fields.date))
    : data.markdownRemark.fields.formattedDate;

  return (
    <Layout location={location}>
      <MarkdownPage
        authors={data.markdownRemark.frontmatter.author}
        createLink={createLinkBlog}
        date={date}
        location={location}
        ogDescription={data.markdownRemark.excerpt}
        markdownRemark={data.markdownRemark}
        sectionList={toSectionList(data.allMarkdownRemark)}
        titlePostfix=" • Blog React"
      />
    </Layout>
  );
};

export const pageQuery = graphql`
  query TemplateBlogMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      excerpt(pruneLength: 500)
      frontmatter {
        title
        next
        prev
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
        path
        slug
      }
    }
    allMarkdownRemark(
      limit: 10
      filter: {fileAbsolutePath: {regex: "/blog/"}}
      sort: {fields: [fields___date], order: DESC}
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default Blog;
