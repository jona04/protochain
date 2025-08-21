import Block from "../src/lib/block"

describe("Teste", () => {

    it('sould be true', () => {
        
        const valid = true

        expect(valid).toEqual(true)
    })

    it('Block is invalid', () => {
        let myBlock = new Block(-1,"1")
        expect(myBlock.isValid()).toBeFalsy()
    })

    it('Block is valid', () => {
        let myBlock = new Block(2,"1")
        expect(myBlock.isValid()).toBeTruthy()
    })
})