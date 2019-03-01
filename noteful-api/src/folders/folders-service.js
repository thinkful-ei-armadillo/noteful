'use strict';

const FolderService = {
  
  // gets all folders
  getAllFolder(knex){
    return knex.select('*').from('folders');
  },

  // get folder by id
  getById(knex, id){
    return knex
      .from('folders')
      .select('*')
      .join('notes','folders.id','=','notes.folderid')
      .where('folders.id',id);
  },

  // inserts folder 
  insertFolder(knex, newFolder){
    return knex
      .insert(newFolder)
      .into('folders')
      .returning('*')
      .then(row => row[0]);
  },

};

module.exports = FolderService;