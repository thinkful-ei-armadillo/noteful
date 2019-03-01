'use strict';

const path = require('path');
const express = require('express');
const xss = require('xss');
const FolderService = require('./folders-service');

const folderRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
  id: folder.id,
  name: xss(folder.foldername)
});

folderRouter
  .route('/api/folders')
  .get((req, res, next) => {
    const knexIns = req.app.get('db');

    FolderService.getAllFolder(knexIns)
      .then(folder =>
        res.json(folder.map(serializeFolder))
      )
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { foldername } = req.body;
    const newFolder = { foldername };
    const knexIns = req.app.get('db');
    if (!foldername)
      return res.status(400).json({
        error: { message: 'Missing folder name' }
      });

    FolderService.insertFolder(knexIns, newFolder)
      .then(folder =>
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializeFolder(folder))
      )
      .catch(next);
  });

folderRouter
  .route('/api/folders/:folderId')
  .get((req, res, next) => {
    const knexIns = req.app.get('db');

    FolderService.getById(knexIns, req.params.folderId)
      .then((folder) => res.json(folder.map(serializeFolder)))
      .catch(next);
  });


module.exports = folderRouter;