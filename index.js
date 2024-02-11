import Lexer, { TokenType } from "./Lexer.js";

function mainProgram() {
    const source = "if+-123 foo*then/";
    const lexer = new Lexer(source);

    lexer.nextChar();
    let token = lexer.getToken();
    while (token.type !== TokenType.EOF) {
        console.log(token)
        lexer.nextChar();
        token = lexer.getToken();
    }
};

mainProgram();