/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
const Feed = require('rss');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const getAllFiles = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });

  return arrayOfFiles;
};

exports.generateRssFeed = function () {
  const feed = new Feed({
    title: 'Blog React',
    description:
      'Ce blog est la source officielle des mises à jour par l’équipe React.  Toute annonce importante, y compris les notes de versions et les avertissements de dépréciation, sera faite ici en premier.',
    feed_url: 'https://fr.react.dev/rss.xml',
    site_url: 'https://fr.react.dev/',
    language: 'fr',
    favicon: 'https://fr.react.dev/favicon.ico',
    pubDate: new Date(),
    generator: 'react.dev rss module',
  });

  const dirPath = path.join(process.cwd(), 'src/content/blog');
  const filesByOldest = getAllFiles(dirPath);
  const files = filesByOldest.reverse();

  for (const filePath of files) {
    const id = path.basename(filePath);
    if (id !== 'index.md') {
      const content = fs.readFileSync(filePath, 'utf-8');
      const {data} = matter(content);
      const slug = filePath.split('/').slice(-4).join('/').replace('.md', '');

      if (data.title == null || data.title.trim() === '') {
        throw new Error(
          `${id}: Blog posts must include a title in the metadata, for RSS feeds`
        );
      }
      if (data.author == null || data.author.trim() === '') {
        throw new Error(
          `${id}: Blog posts must include an author in the metadata, for RSS feeds`
        );
      }
      if (data.date == null || data.date.trim() === '') {
        throw new Error(
          `${id}: Blog posts must include a date in the metadata, for RSS feeds`
        );
      }
      if (data.description == null || data.description.trim() === '') {
        throw new Error(
          `${id}: Blog posts must include a description in the metadata, for RSS feeds`
        );
      }

      feed.item({
        id,
        title: data.title,
        author: data.author || '',
        date: new Date(data.date),
        url: `https://fr.react.dev/blog/${slug}`,
        description: data.description,
      });
    }
  }

  fs.writeFileSync('./public/rss.xml', feed.xml({indent: true}));
};
