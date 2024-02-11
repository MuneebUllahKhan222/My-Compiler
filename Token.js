import { TokenType } from "./Lexer.js";

export default class Token {
    constructor(tokenText, tokenType) {
        this.text = tokenText;
        this.type = tokenType;
    };

    static checkKeyword(text) {
        let tokenExists = TokenType[text];
        if (tokenExists && (tokenExists > 100 && tokenExists < 200) ) {
            return tokenExists;
        } else {
            return null;
        }
    }
};

