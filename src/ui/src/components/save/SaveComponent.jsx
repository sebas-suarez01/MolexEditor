import {
    $convertToMarkdownString,
    TRANSFORMERS,
  } from '@lexical/markdown';
import { marked } from 'marked';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import React, { useState } from "react";
import markdownIt from "markdown-it";
import texmath from "markdown-it-texmath";
import "katex/dist/katex.min.css";
import katex from "katex";
import { exportFile, importFile } from './utils';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

export default function Save({editor}){
    const saveAsMarkdown = ()=>{
        editor.update(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS);
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.md';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    const saveAsDoc = ()=>{
        editor.update(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS);

            function parseMarkdownToDocx(markdown) {
                const paragraphs = [];
                const lines = markdown.split("\n");

                let inUnorderedList = false;
                let inOrderedList = false;
            
                for (const line of lines) {
                    if (line.startsWith("# ")) {
                        // Heading 1
                        paragraphs.push(
                            new Paragraph({
                                text: line.replace("# ", ""),
                                heading: "Heading1",
                            })
                        );
                    } else if (line.startsWith("## ")) {
                        // Heading 2
                        paragraphs.push(
                            new Paragraph({
                                text: line.replace("## ", ""),
                                heading: "Heading2",
                            })
                        );
                    }else if (line.match(/^\s*-\s/)) {
                        // Unordered list item
                        if (!inUnorderedList) {
                            paragraphs.push(new Paragraph({})); // Add a blank line before the list
                            inUnorderedList = true;
                        }
                        const listItemText = line.replace(/^\s*-\s/, "");
                        paragraphs.push(
                            new Paragraph({
                                text: listItemText,
                                bullet: { level: 0 }, // Level 0 for top-level bullet points
                            })
                        );
                    } else if (line.match(/^\s*\d+\.\s/)) {
                        // Ordered list item
                        if (!inOrderedList) {
                            paragraphs.push(new Paragraph({})); // Add a blank line before the list
                            inOrderedList = true;
                        }
                        const listItemText = line.replace(/^\s*\d+\.\s/, "");
                        paragraphs.push(
                            new Paragraph({
                                text: listItemText,
                                numbering: { level: 0, reference: "ordered-list" }, // Level 0 for top-level numbering
                            })
                        );
                    }else if (line.trim() === "") {
                        // Empty line (skip or add a blank paragraph)
                        inUnorderedList = false;
                        inOrderedList = false;
                        paragraphs.push(new Paragraph({}));
                    } else {
                        // Parse bold and italic text
                        const textRuns = [];
                        let remainingText = line;
            
                        while (remainingText) {
                            // Check for bold text
                            const boldMatch = remainingText.match(/(\*\*|__)(.*?)\1/);
                            if (boldMatch) {
                                // Add normal text before the bold text
                                if (boldMatch.index > 0) {
                                    textRuns.push(
                                        new TextRun({
                                            text: remainingText.slice(0, boldMatch.index),
                                        })
                                    );
                                }
                                // Add bold text
                                textRuns.push(
                                    new TextRun({
                                        text: boldMatch[2],
                                        bold: true,
                                    })
                                );
                                // Remove processed text
                                remainingText = remainingText.slice(boldMatch.index + boldMatch[0].length);
                            } else {
                                // Check for italic text
                                const italicMatch = remainingText.match(/(\*|_)(.*?)\1/);
                                if (italicMatch) {
                                    // Add normal text before the italic text
                                    if (italicMatch.index > 0) {
                                        textRuns.push(
                                            new TextRun({
                                                text: remainingText.slice(0, italicMatch.index),
                                            })
                                        );
                                    }
                                    // Add italic text
                                    textRuns.push(
                                        new TextRun({
                                            text: italicMatch[2],
                                            italics: true,
                                        })
                                    );
                                    // Remove processed text
                                    remainingText = remainingText.slice(italicMatch.index + italicMatch[0].length);
                                } else {
                                    // Add remaining normal text
                                    textRuns.push(
                                        new TextRun({
                                            text: remainingText,
                                        })
                                    );
                                    remainingText = "";
                                }
                            }
                        }
            
                        // Add paragraph with formatted text runs
                        paragraphs.push(new Paragraph({ children: textRuns }));
                    }
                }
            
                return paragraphs;
            }
            
            const doc = new Document({
                styles: {
                    paragraphStyles: [
                        {
                            id: "Heading1",
                            name: "Heading 1",
                            basedOn: "Normal",
                            next: "Normal",
                            quickFormat: true,
                            run: {
                                size: 32, // Font size in half-points (32 = 16pt)
                                bold: true,
                                font: "Arial",
                            },
                            paragraph: {
                                spacing: { before: 240, after: 120 }, // Spacing in twips (240 = 12pt)
                            },
                        },
                        {
                            id: "Heading2",
                            name: "Heading 2",
                            basedOn: "Normal",
                            next: "Normal",
                            quickFormat: true,
                            run: {
                                size: 28, // Font size in half-points (28 = 14pt)
                                bold: true,
                                font: "Arial",
                            },
                            paragraph: {
                                spacing: { before: 200, after: 100 }, // Spacing in twips (200 = 10pt)
                            },
                        },
                        {
                            id: "Normal",
                            name: "Normal",
                            basedOn: "Normal",
                            next: "Normal",
                            quickFormat: true,
                            run: {
                                size: 24, // Font size in half-points (24 = 12pt)
                                font: "Arial",
                            },
                            paragraph: {
                                spacing: { before: 120, after: 120 }, // Spacing in twips (120 = 6pt)
                            },
                        },
                    ],
                },
                sections: [
                  {
                    children: parseMarkdownToDocx(markdown),
                  },
                ],
              });

            Packer.toBlob(doc).then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.docx';
            a.click();
            URL.revokeObjectURL(url);
            });
        });
    }

    const saveAsTex =()=>{
        editor.update(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS);
            
            const convertToLatex = (markdownText) => {
                const md = markdownIt().use(texmath, { engine: katex, delimiters: "dollars" });
                return md.render(markdownText);
              };

              const result = convertToLatex(markdown)

            const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.tex';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    return(
        <div className="p-5">
            <p className="pb-5 text-3xl">Save as</p>
            <div className="flex flex-row">
                <button onClick={saveAsMarkdown} className="w-16 text-white bg-white font-medium rounded-full text-sm flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400">
                    <img src="images/icons/markdown.svg" className="w-6 flex justify-center items-center" />
                </button>
                <button onClick={saveAsDoc} className="w-16 text-white bg-white font-medium rounded-full text-sm flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400">
                    <img src="images/icons/doc-file-svgrepo-com.svg" className="w-6 flex justify-center items-center" />
                </button>
                <button onClick={saveAsTex} className="w-16 text-white bg-white font-medium rounded-full text-sm flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400">
                    <img src="images/icons/tex-open-file-format-svgrepo-com.svg" className="w-6 flex justify-center items-center" />
                </button>
            </div>
            <div className="flex flex-row">
                <button
                    className="w-16 text-white bg-white font-medium rounded-full text-sm flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400"
                    onClick={() => importFile(editor)}
                    title="Import"
                    aria-label="Import editor state from JSON">
                    <UploadIcon className='bg-black' />
                </button>

                <button
                    className="w-16 text-white bg-white font-medium rounded-full text-sm flex flex-row px-5 py-2.5 text-center me-2 mb-2 dark:hover:bg-slate-400"
                    onClick={() =>
                        exportFile(editor, {
                            fileName: `Test ${new Date().toISOString()}`,
                            source: 'Playground',
                        })
                    }
                    title="Export"
                    aria-label="Export editor state to JSON">
                    <DownloadIcon className='bg-black' />
                </button>
            </div>
        </div>
    )
}