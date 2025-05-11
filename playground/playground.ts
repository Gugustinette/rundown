interface Person {
	name: string;
	age: number;
	greet: () => void;
}

const person: Person = {
	name: "John",
	age: 30,
	greet() {
		console.log(
			`Hello, my name is ${this.name} and I am ${this.age} years old.`,
		);
	},
};
person.greet();

// Exit with success
process.exit(0);
