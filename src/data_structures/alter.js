const path = require('path');
const crud = require('./common_actions/crud');
// ... This means "Cryptography", not like... crypto as in the scammy "currency"
const crypto = require('crypto');
const {settingsFile, readSettings, writeSettings, dataDir} = require('../settings');
/**
 * An alter.
 * @param {Object} args - The object from the database.
 */
class Alter {
    constructor(self) {
        this.id = self.id;
        this.system_id = self.system_id;
        this.name = self.name;
        this.nickname = self.nickname;
        this.pronouns = self.pronouns;
        this.species = self.species;
        this.gender = self.gender;
        this.sexuality = self.sexuality;
        this.age = self.age;
        this.type = self.type;
        this.source = self.source;
        this.triggersPos = self.triggersPos;
        this.triggersNeg = self.triggersNeg;
        this.likes = self.likes;
        this.dislikes = self.dislikes;
        this.hobbies = self.hobbies;
        this.birthday = self.birthday;
        this.foundOn = self.foundOn;
        this.job = self.job;
        this.frontTells = self.frontTells;
        this.safety = self.safety;
        this.accommodation = self.accommodation;
        this.wishes = self.wishes;
        this.relationships = self.relationships;
        this.notes = self.notes;
        this.appearance = self.appearance;
        this.image = self.image;
        this.banner = self.banner;
        this.css = self.css;
    }

    async getCSV() {
        let settings = await readSettings();
        if (settings.dataDir) {
            return path.join(settings.dataDir, 'alters.csv')
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
        console.log(`Turn ${property}'s value to ${value}.`);
        this[property] = value;
        let altCSV = await this.getCSV();
        if (altCSV !== null){
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
        console.log(`Deleting ${this.name}`)
        let altCSV = await this.getCSV();
        if (altCSV !== null){
            await crud.deleteFromCSV(this, altCSV);
            return true;
        } else{
            return false;
        }
    }

    /**
     * Adds this alter to the CSV
     * @returns {Boolean} Whether the transaction with the database passed or failed.
     */
    async commit() {
        console.log(`Adding ${this.name}`)
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
        return ['id', 'system_id', 'name', 'nickname', 'pronouns', 'species', 'gender', 'sexuality', 'age', 'type', 'source', 'triggersPos', 'triggersNeg', 'likes', 'dislikes', 'hobbies', 'birthday', 'foundOn', 'job', 'frontTells', 'safety', 'accommodation', 'wishes', 'relationships', 'notes', 'appearance', 'image', 'banner', 'css']
    }
}
module.exports = {Alter};