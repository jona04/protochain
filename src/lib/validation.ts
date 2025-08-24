/**
 * Validation class
 */
export default class Validation {
    success: boolean;
    message: string;

    /**
     * Creates a new validation object
     * @param success If the validations was created succesfuly
     * @param message Message of the validation
     */
    constructor(success: boolean = true, message: string = "") {
        this.success = success;
        this.message = message;
    }
}