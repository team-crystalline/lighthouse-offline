const path = require('path');
const crud = require('./common_actions');
// ... This means "Cryptography", not like... crypto as in the scammy "currency"
const crypto = require('crypto');
/**
 * An alter.
 * @param {Object} args - The object from the database.
 */
export class Journal {
    constructor(self) {
        this.id = self.id;
        this.author = self.author; // <-- An alter's ID.
        this.skin = self.skin;
        this.hasPass = self.hasPass;
        this.password = self.password;
    }
    async getCSV() {
        let settings = await crud.settings();
        if (settings.dataDir) {
            return path.join(settings.dataDir, 'journals.csv')
        } else {
            return null;
        }
    }

    /**
     * Modifies a property for the database.
     * @param {*} property 
     * @param {*} value 
     * @returns {Boolean} Whether the transaction with the database passed or failed.
     */
    async modify(property, value) {
        this[property] = value;
        let altCSV = await this.getCSV();
        if (altCSV !== null) {
            await crud.updateInCSV(this, altCSV);
            return true;
        } else {
            return false;
        }
    }
    /**
     * Deletes this entry from the database.
     * @returns {Boolean} Whether the transaction with the database passed or failed.
     */
    async delete() {
        let altCSV = await this.getCSV();
        if (altCSV !== null) {
            await crud.deleteFromCSV(this, altCSV);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Adds this alter to the CSV
     * @returns {Boolean} Whether the transaction with the database passed or failed.
     */
    async commit() {
        this.id = crypto.randomUUID();
        let altCSV = await this.getCSV();
        if (altCSV !== null){
            await crud.insertToCSV(this, altCSV);
            return true;
        } else{
            return false;
        }
    }

    headers() {
        return ['id', 'author', 'skin', 'hasPass', 'password'];
    }
}