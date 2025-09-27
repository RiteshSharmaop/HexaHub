import { Code } from "lucide-react";
import type { Language, LanguageVersions, CodeSnippets } from "./types";

export const languages: Language[] = [
  { value: "javascript", label: "JavaScript", icon: Code },
  { value: "typescript", label: "TypeScript", icon: Code },
  { value: "python", label: "Python", icon: Code },
  { value: "csharp", label: "C#", icon: Code },
  { value: "java", label: "Java", icon: Code },
  { value: "cpp", label: "C++", icon: Code },
];

export const LANGUAGE_VERSIONS: LanguageVersions = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2", 
  csharp: "6.12.0",
  cpp: "10.2.0", // lowercase, no spaces
};

export const CODE_SNIPPETS: CodeSnippets = {
  javascript: `
function greet(name) {
    console.log("Hello, " + name + "!");
}
greet("Ritesh");
`,
  typescript: `
type Params = {
    name: string;
}

function greet(data: Params) {
    console.log("Hello, " + data.name + "!");
}

greet({ name: "Ritesh" });
`,
  python: `
def greet(name):
    print("Hello, " + name + "!")
greet("Ritesh")
`,
  java: `
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
`,
  csharp: `
using System;

namespace HelloWorld {
    class Hello { 
        static void Main(string[] args) {
            Console.WriteLine("Hello World in C#");
        }
    }
}
`,
  cpp: `
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!";
    return 0;
}
`,
};
