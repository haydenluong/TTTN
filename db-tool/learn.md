menu.ts // 

- async: marks the function as asynchronous, meaning it doesn't wait for output but still runs in background 
- await means wait until the Promise from the function is completed, then give me the actual value inside it. 
- Promise<value's type>: a value that'll be ready later/ eventually the function will get the value, but it is not immediately, Hence the promise
- for the inquirer.prompt function, we pass in an array of question objects 
- destructuring 
- inquirer: a library for inputs 

MySQLDriver // 

- in " constructor(private config: DbConfig) {
} " -> private automatically assigns "this.config = config;" 
+ private means can only be used within the class; public means outside code can also use it 

- destructuring an array:
const fruits = ['apple', 'banana', 'cherry'];

const [first, second] = fruits;

console.log(first);  // 'apple'
console.log(second); // 'banana

