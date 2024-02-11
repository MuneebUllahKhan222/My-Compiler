import Token from "./Token.js";


export default class Lexer {
    constructor(source) {
        this.source = source + '\n';
        this.currChar = '';
        this.currPos = -1;
    }

    getCurrChar() {
        return this.currChar;
    };

    nextChar() {
        this.currPos += 1;
        if (this.currPos >= this.source.length) {
            this.currChar = '\0' // EOF Program
        } else {
            this.currChar = this.source.charAt(this.currPos);
        }
    };

    peek() {
        if (this.currPos + 1 >= this.source.length) {
            return '\0';
        } else {
            return this.source.charAt(this.currPos + 1);
        }
    };

    skipWhiteSpace() {
        while (this.currChar === ' ') {
            this.nextChar();
        };
    };

    skipComment() {
        if (this.currChar === '/' && this.peek() === '/') {
            while (this.currChar !== '\n') {
                this.nextChar();
            };
        };
    };

    Abort(message) {
        try {
            console.log(message || `Error at char: ${this.currChar} and position: ${this.currPos}`)
            throw new Error(message || `Error at char: ${this.currChar} and position: ${this.currPos}`);
        } catch (error) {
            console.log(error.message)
        }
    };



    getToken() {
        this.skipWhiteSpace();
        this.skipComment();
        let token;
        switch (this.currChar) {
            case '+':
                token = new Token(this.currChar, TokenType.PLUS);
                break;
            case '-':
                token = new Token(this.currChar, TokenType.MINUS);
                break;
            case '*':
                token = new Token(this.currChar, TokenType.ASTERISK);
                break;
            case '/':
                token = new Token(this.currChar, TokenType.SLASH);
                break;
            case '=':
                if (this.peek() === '=') {
                    let prevChar = this.currChar;
                    this.nextChar();
                    token = new Token(prevChar + this.currChar, TokenType.EQEQ);
                } else {
                    token = new Token(this.currChar, TokenType.EQ);
                }
                break;
            case '>':
                if (this.peek() === '=') {
                    let prevChar = this.currChar;
                    this.nextChar();
                    token = new Token(prevChar + this.currChar, TokenType.GTEQ);
                } else {
                    token = new Token(this.currChar, TokenType.GT);
                };
                break;
            case '<':
                if (this.peek() === '=') {
                    let prevChar = this.currChar;
                    this.nextChar();
                    token = new Token(prevChar + this.currChar, TokenType.LTEQ);
                } else {
                    token = new Token(this.currChar, TokenType.LT);
                };
                break;
            case '\n':
                token = new Token(this.currChar, TokenType.NEWLINE);
                break;
            case '\0':
                token = new Token('', TokenType.EOF);
                break;
            case '!':
                if (this.peek() === '=') {
                    let prevChar = this.currChar;
                    this.nextChar();
                    token = new Token(prevChar + this.currChar, TokenType.NOTEQ);
                } else {
                    token = new Token(this.currChar, TokenType.NOT);
                };
                break;
            case "'":
                this.nextChar()
                const startPos = this.currPos;
                while (this.currChar !== "'") {
                    this.nextChar();
                }
                const tokenText = this.source.substring(startPos, this.currPos);
                token = new Token(tokenText, TokenType.STRING);
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                const startPosDigit = this.currPos;
                while (Number(this.peek())) {
                    this.nextChar();
                };
                if (this.peek() === '.') {
                    this.nextChar();
                    if (!Number(this.peek())) {
                        this.Abort("Illegal character in number.")
                    };
                    while (Number(this.peek())) {
                        this.nextChar();
                    }
                };
                const tokenNumber = this.source.substring(startPosDigit, this.currPos + 1);
                token = new Token(tokenNumber, TokenType.NUMBER);
                break;
            case 'a':
            case 'b':
            case 'c':
            case 'd':
            case 'e':
            case 'f':
            case 'g':
            case 'h':
            case 'i':
            case 'j':
            case 'k':
            case 'l':
            case 'm':
            case 'n':
            case 'o':
            case 'p':
            case 'q':
            case 'r':
            case 's':
            case 't':
            case 'u':
            case 'v':
            case 'w':
            case 'x':
            case 'y':
            case 'z':
                const startPosAlpha = this.currPos;
                while (/^[a-z0-9]+$/.test(this.peek())) {
                    this.nextChar();
                }
                const text = this.source.substring(startPosAlpha, this.currPos + 1);
                const keyword = Token.checkKeyword(text.toUpperCase());
                if (!keyword) {
                    token = new Token(text, TokenType.IDENT);
                } else {
                    token = new Token(text, keyword);
                }
                break;
            default:
                this.Abort(`Case not handled for ${this.currChar}`);
                break;
        }
        return token;
    }
};


export const TokenType = {
    EOF: -1,
    NEWLINE: 0,
    NUMBER: 1,
    IDENT: 2,
    STRING: 3,
    // Keywords.
    LABEL: 101,
    GOTO: 102,
    PRINT: 103,
    INPUT: 104,
    LET: 105,
    IF: 106,
    THEN: 107,
    ENDIF: 108,
    WHILE: 109,
    REPEAT: 110,
    ENDWHILE: 111,
    // Operators.
    EQ: 201,
    PLUS: 202,
    MINUS: 203,
    ASTERISK: 204,
    SLASH: 205,
    EQEQ: 206,
    NOTEQ: 207,
    LT: 208,
    LTEQ: 209,
    GT: 210,
    GTEQ: 211,
    NOT: 212,
};

