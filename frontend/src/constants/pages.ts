import type { Page } from "./types";

export const initialPages: Page[] = [
  {
    id: 1,
    name: "index.js",
    language: "javascript",
    content: "// Welcome to your IDE\nconsole.log('Hello World!');",
  },
  {
    id: 2,
    name: "HelloWorld.java",
    language: "java",
    content:
      "public class HelloWorld {\n" +
      "    public static void main(String[] args) {\n" +
      "        System.out.println(\"Hello, World!\");\n" +
      "    }\n" +
      "}",
  },
];
