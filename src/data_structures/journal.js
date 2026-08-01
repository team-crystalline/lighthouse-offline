/**
 * An alter.
 * @param {Object} args - The object from the database.
 */
export class Journal {
    constructor(self){
        this.id = self.id;
        this.author = self.author; // <-- An alter's ID.
        this.skin = self.skin;
        this.hasPass = self.hasPass;
        this.password = self.password;
    }
    /**
     * Modifies a property for the database.
     * @param {*} property 
     * @param {*} value 
     * @returns {Boolean} Whether the transaction with the database passed or failed.
     */
    modify(property, value){
        console.log(`Turn ${property}'s value to ${value}.`);
        return true;
    }
    /**
     * Deletes this entry from the database.
     * @returns {Boolean} Whether the transaction with the database passed or failed.
     */
    delete(){
        console.log(`Deleting ${this.id}`)
        return true;
    }
}