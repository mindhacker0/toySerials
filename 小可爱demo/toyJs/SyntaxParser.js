let syntax = {
    Program:[
        ["StatementList","EOF"]
    ],
    StatementList:[
        ["Statement"],
        ["StatementList","Statement"]
    ],
    Statement:[
        ["ExpressionStatement"],
        ["IfStatement"],
        ["VariableDeclaration"],
        ["FunctionDeclaration"],
    ],
    ExpressionStatement:[
        ["AdditiveExpression"]
    ],
    IfStatement:[
        ["if","(","Expression",")","Statement"]
    ],
    VariableDeclaration:[
        ["var","Identifier"]
    ],
    FunctionDeclaration:[
        ["function","Identifier","(",")","{","StatementList","}"]
    ],
    AdditiveExpression:[
        ["MultiplicativeExpression"],
        ["AdditiveExpression","+","MultiplicativeExpression"],
        ["AdditiveExpression","-","MultiplicativeExpression"]
    ],
    MultiplicativeExpression:[
        ["PrimaryExpression"],
        ["AdditiveExpression","*","PrimaryExpression"],
        ["AdditiveExpression","/","PrimaryExpression"]
    ],
    PrimaryExpression:[
        ["(","Expression",")"],
        ["Literal"],
        ["Identifier"]
    ],
    Literal:[
        ["Number"]
    ]
};
function closure(state){
    let queue = [];
    for(let symbol in state){
        queue.push(symbol);
    }
    while(queue.length){
        let symbol = queue.shift();
        console.log(symbol);
        if(syntax[symbol]){
            for(let rule of syntax[symbol]){
                if(!state[rule[0]]){
                    queue.push(rule[0]);
                }
                let current = state;
                for(let part of rule){
                    if(!current[part])
                        current[part] = {}
                    current = current[part];
                }
                current.isRuleENd = true;
            }
        }
    }
}
let end = {
    isEnd:true
}
let start = {
    "Program":end,
}
closure(start);