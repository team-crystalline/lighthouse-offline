/**
 * An alter.
 * @param {Object} args - The object from the database.
 */
export class Alter{
    constructor(self){
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
        console.log(`Deleting ${this.name}`)
        return true;
    }
}