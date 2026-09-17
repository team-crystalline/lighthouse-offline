const path = require('path');
const crud = require('./common_actions');
// ... This means "Cryptography", not like... crypto as in the scammy "currency"
const crypto = require('crypto');
/**
 * A system, which holds alters.
 * @param {Object} args - The object from the database.
 * @example
 * {
 *  name: "Test System"
 *  id: "36b8f84d-df4e-4d49-b662-bcde71a8764f",
 *  description: "A new system."
 *  subsystems: [],
 *  tags: ["main"],
 *  createdOn: 1785559825000
 * }
 * {
 *  name: "Another System"
 *  id: "9da80753-4c53-4da9-86ba-c4b8e82d7cbb",
 *  description: "This one has subsystems."
 *  subsystems: ["a88abb6e-f26a-41ae-a0ea-ef193870e512", "fa579c08-9101-4b28-b59a-cc84cb53eb57"],
 *  tags: ["all introjects", "mostly dormant"],
 *  createdOn: 1735689600000
 * }
 */
export class System {
    constructor(self) {
        this.name = self.name;
        this.id = self.id;
        this.description = self.description;
        this.subsystems = self.subsystems;
        this.tags = self.tags;
        this.createdOn = self.createdOn
    }
    async getCSV() {
        let settings = await crud.settings();
        if (settings.dataDir) {
            return path.join(settings.dataDir, 'systems.csv')
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
        console.log(`Deleting ${this.name}`)
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
        console.log(`Adding ${this.name}`)
        this.id = crypto.randomUUID();
        let altCSV = await this.getCSV();
        if (altCSV !== null) {
            await crud.insertToCSV(this, altCSV);
            return true;
        } else {
            return false;
        }
    }

    headers() {
        return ['name', 'id', 'description', 'subsystems', 'tags', 'createdOn']
    }
}