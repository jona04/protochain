import Block from "../src/lib/block"

describe("Teste", () => {

    it('sould be true', () => {
        
        const valid = true

        expect(valid).toEqual(true)
    })

    it('Block is invalid', () => {
        let myBlock = new Block(-1,"previous abc", "data block 2")
        expect(myBlock.isValid()).toBeFalsy()
    })

    it('Block is valid', () => {
        let myBlock = new Block(2,"previous a", "data block 3")
        expect(myBlock.isValid()).toBeTruthy()
    })

    it('Block hash is not valid', () => {
        let myBlock = new Block(2, "previous block", "Test")
        myBlock.hash = "";
        expect(myBlock.isValid()).toBeFalsy()
    })

    it('Block data is not valid', () => {
        let myBlock = new Block(2, "previous block", "")
        expect(myBlock.isValid()).toBeFalsy()
    })

    it('Block previousData is not valid', () => {
        let myBlock = new Block(2, "", "Data test")
        expect(myBlock.isValid()).toBeFalsy()
    })

    it('Block timestamp is not valid', () => {
        let myBlock = new Block(2, "Previous hash", "Data test")
        myBlock.timestamp = 0;
        expect(myBlock.isValid()).toBeFalsy()
    })

})