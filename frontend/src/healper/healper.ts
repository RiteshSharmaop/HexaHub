// src/utils/helpers.ts

import { LANGUAGE_VERSIONS } from "../constants/language"
import axios from "axios";


export const createNewPage = (pages : any, selectedLanguage : string) => {
  const extensions: any = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    cpp: "cpp",
    java: "java",
    csharp: "cs",
  };

 
  
  const newPage = {
    id: Date.now(),
    name: `new-file-${pages.length + 1}.${extensions[selectedLanguage]}`,
    language: selectedLanguage,
    content: `// New ${selectedLanguage} file\n// Start coding here...\n`,
  };

  return newPage;
};

export const deletePage = (pages : any , pageId : any, trashedPages : any) => {
  if (pages.length === 1) return { updatedPages: pages, updatedTrash: trashedPages };

  const pageToDelete = pages.find((p : any) => p.id === pageId);
  const updatedPages = pages.filter((p : any) => p.id !== pageId);
  const updatedTrash = [
    ...trashedPages,
    { ...pageToDelete, deletedAt: new Date().toLocaleString() },
  ];

  return { updatedPages, updatedTrash };
};

export const restoreFromTrash = (trashedPages : any, pageId : any, pages : any) => {
  const pageToRestore = trashedPages.find((p : any) => p.id === pageId);
  if (!pageToRestore) return { updatedTrash: trashedPages, updatedPages: pages };

  const { deletedAt, ...restoredPage } = pageToRestore;
  return {
    updatedTrash: trashedPages.filter((p: any) => p.id !== pageId),
    updatedPages: [...pages, restoredPage],
  };
};

export const permanentlyDelete = (trashedPages: any, pageId : any) => {
  return trashedPages.filter((p : any) => p.id !== pageId);
};


const API = axios.create({
  baseURL:"https://emkc.org/api/v2/piston"
})
export const runTheCode = async(language : any , sourceCode : any)=>{
  const res = await API.post("execute" , {
    language : language,
    version: LANGUAGE_VERSIONS[language],
    files : [
      {
        content : sourceCode
      }
    ]
  });
  
  return res.data.run;

};
