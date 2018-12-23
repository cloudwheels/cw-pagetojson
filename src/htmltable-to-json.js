/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
'use strict';


const cheerio = require('cheerio');

class HTMLTableToJsonConverter {
  constructor() {
    this._docToConvert = null;
    this._convertedDoc = null;

    this._options = {

      useFirstRowForHeadings: false,
      stripHtmlFromHeadings: true,
      stripHtmlFromCells: true,
      stripHtml: null,
      forceIndexAsNumber: false,
      countDuplicateHeadings: true,
      ignoreColumns: null,
      onlyColumns: null,
      ignoreHiddenRows: true,
      headings: null,
      containsClasses: null,
      id: null,
      limitrows: null,
    };
  }
  /**
       * Static conversion of a given HTML Page
       * @param html {String} Html page content
       * @param options {Object} Options for html conversion
       * @param options.useFirstRowForHeadings Use the first row as header [default=false]
       * @param options.stripHtmlFromHeadings Strip all HTML from headings [default=true]
       * @param options.stripHtmlFromCells Strip HTML from cells [default=true]
       * @param options.stripHtml Strip off HTML [default=null] if set true stripHtmlFromHeadings and stripHtmlFromCells will also be true
       * @param options.forceIndexAsNumber Force the index to be used as number [default=false]
       * @param options.countDuplicateHeadings If given a _<NUMBER> will be added to the duplicate key [default=false]
       * @param options.ignoreColumns {Array} Array of column indices to ignored [default=null]
       * @param options.onlyColumns {Array} Array of column indices to be used. Overrides ignoreColumn [default=null]
       * @param options.ignoreHiddenRows Ignoring hidden rows [default=true]
       * @param options.headings {Array} Array of Strings to be used as headings [default=null]
       * @param options.containsClasses {Array} Array of classes to find a specific table [default=null]
       * @param options.id any Use unknown
       * @param options.limitrows {Integer} Integer that limits the result of all rows to a given amount of data [default=null]
       * @return {Object} Converted Object as an object literal
       */

  get options() {
    return this._options;
  }

  set options(newOptions) {
    if (newOptions) {
      this._options = newOptions;
      if (newOptions.stripHtml === true) {
        this._options.stripHtmlFromHeadings = true;
        this._options.stripHtmlFromCells = true;
      } else if (newOptions.stripHtml === false) {
        this._options.stripHtmlFromHeadings = false;
        this._options.stripHtmlFromCells = false;
      }
    }
  }

  get docToConvert() {
    return this._docToConvert;
  }

  set docToConvert(newDocToConvert) {
    if (newDocToConvert) {
      this._docToConvert = newDocToConvert;
    }
  }


  get convertedDoc() {
    return new Promise((resolve, reject)=> {
      this.convert();
      resolve(this._convertedDoc);
    });
  }

  convert() {
    const jsonResponse = [];
    let suffix = undefined;

    const $ = cheerio.load(this._docToConvert); // TODO: if we have one!
    const self = this;

    let additionalSelectors = this.options.containsClasses ? `.${this.options.containsClasses.join('.')}` : '';
    additionalSelectors = this.options.id ? `${additionalSelectors}#${this.options.id}` : '';

    $(`table${additionalSelectors}`).each(function(i, table) {
      const tableAsJson = [];
      const alreadySeen = {};
      // Get column headings
      // @fixme Doesn't support vertical column headings.
      // @todo Try to support badly formated tables.
      const columnHeadings = [];

      let trs = $(table).find('tr');

      if (self.options.useFirstRowForHeadings) trs = $(trs[0]);
      let headingsCounter = 0;
      // Use headings for objects key evaluation
      trs.each(function(i, row) {
        $(row)
            .find('th')
            .each(function(j, cell) {
              if (self.options.onlyColumns && !self.options.onlyColumns.includes(j)) return;
              if (self.options.ignoreColumns && !self.options.onlyColumns && self.options.ignoreColumns.includes(j)) return;
              let value = '';

              if (self.options.headings) {
                value = self.options.headings[headingsCounter++];
              } else {
                value = self.options.stripHtmlFromHeadings
                                  ? $(cell)
                                      .text()
                                      .trim()
                                  : $(cell)
                                      .html()
                                      .trim();
              }

              const seen = alreadySeen[value];
              if (seen && self.options.countDuplicateHeadings) {
                suffix = ++alreadySeen[value];
                columnHeadings[j] = value !== '' ? value + '_' + suffix : j;
              } else {
                alreadySeen[value] = 1;
                columnHeadings[j] = value;
              }
            });
      });

      // Fetch each row
      $(table)
          .find('tr')
          .each(function(i, row) {
            const rowAsJson = {};

            const cells = self.options.useFirstRowForHeadings ? $(row).find('td, th') : $(row).find('td');
            cells.each(function(j, cell) {
              // ignoreHiddenRows
              if (self.options.ignoreHiddenRows) {
                const style = $(row).attr('style');
                if (style) {
                  const m = style.match(/.*display.*:.*none.*/g);
                  if (m && m.length > 0) return;
                }
              }

              if (self.options.onlyColumns && !self.options.onlyColumns.includes(j)) return;
              if (self.options.ignoreColumns && !self.options.onlyColumns && self.options.ignoreColumns.includes(j)) return;

              const content = self.options.stripHtmlFromCells
                              ? $(cell)
                                  .text()
                                  .trim()
                              : $(cell)
                                  .html()
                                  .trim();

              if (columnHeadings[j] && !self.options.forceIndexAsNumber) {
                rowAsJson[columnHeadings[j]] = content;
              } else {
                rowAsJson[j] = content;
              }
            });

            // Skip blank rows
            if (JSON.stringify(rowAsJson) !== '{}') tableAsJson.push(rowAsJson);

            if (self.options.limitrows && i === self.options.limitrows) {
              return false;
            }
          });

      // Add the table to the response
      if (tableAsJson && tableAsJson.length !== 0) {
        jsonResponse.push(tableAsJson);
      }
    });
    return this._convertedDoc = jsonResponse;
    // return jsonResponse;
  }
}

module.exports={HTMLTableToJsonConverter};
