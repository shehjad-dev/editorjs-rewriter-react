import React, { useState, useRef, useEffect } from "react";
import EditorJS, { ToolConstructable, EditorConfig } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import SimpleParaphraser from "./simple-paraphraser";

interface Block {
    id?: string;
    type: string;
    data: {
        text: string;
        level?: number;
    };
}

interface EditorData {
    time: number;
    blocks: Block[];
    version: string;
}

/* const API_KEY = import.meta.env.VITE_API_KEY;
const API_HOST = import.meta.env.VITE_API_HOST;
console.log(API_KEY);
console.log(API_HOST); */

const Editor = () => {
    const ref = useRef<EditorJS>();
    const [mainData, setMainData] = useState<EditorData>({
        time: 1550476186479,
        blocks: [
            {
                id: "oUq2g_tl8y",
                type: "header",
                data: {
                    text: "Editor.js",
                    level: 2,
                },
            },
            {
                id: "zbGZFPM-iI",
                type: "paragraph",
                data: {
                    text: "Hey. Meet the new Editor developed by Shehjad. There is a paraphraser custom block. Add it to the editor and see its magic. There is a real api from rapid api thats working behind to change the text. Though I am on the free trial with a hard  limit on the api. Hope you can check its functionalities before the limit exceeds. I am using localstorage as a db in here",
                },
            },
            {
                type: "paraphraser",
                data: {
                    text: "",
                },
            },
        ],
        version: "2.8.1",
    });

    useEffect(() => {
        const storedData = localStorage.getItem("editorData");
        let parsedData: EditorData | undefined;
        if (storedData) {
            parsedData = JSON.parse(storedData);
            setMainData(parsedData ? parsedData : mainData);
        } else {
            console.log("No data found in local storage");
        }
        if (!ref.current) {
            if (!ref.current) {
                const editorConfig: EditorConfig = {
                    holder: "editor",
                    onReady: () => {
                        console.log("Editor.js is ready to work!");
                    },
                    autofocus: true,
                    tools: {
                        header: {
                            class: Header as unknown as ToolConstructable,
                            config: {
                                placeholder: "Enter a header",
                                levels: [2, 3, 4],
                                defaultLevel: 3,
                            },
                        },
                        paraphraser: {
                            class: SimpleParaphraser,
                            inlineToolbar: true,
                        },
                    },
                    data: parsedData ? parsedData : mainData,
                };
                const editor = new EditorJS(editorConfig);
                ref.current = editor;
            }
        }

        return () => {
            if (ref.current) {
                ref.current.render(mainData);
            }
        };
    }, []);

    const onSave = (): void => {
        if (ref.current) {
            ref.current
                .save()
                .then((outputData: any) => {
                    //console.log("Article data: ", outputData);
                    if (ref.current) {
                        ref.current.render({
                            ...outputData,
                        });
                    }
                    setMainData({
                        ...mainData,
                        blocks: [...outputData.blocks],
                    });
                    localStorage.setItem(
                        "editorData",
                        JSON.stringify(outputData)
                    );
                })
                .catch((error: Error) => {
                    console.log("Saving failed: ", error);
                });
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            <h1 className="text-2xl font-bold py-3 shadow-sm px-3 border-b-2 border-teal-200 bg-teal-50 rounded-xl mt-8">
                My Editor
            </h1>
            <div className="text-right">
                <button
                    onClick={onSave}
                    className="bg-teal-600 text-white py-2 px-4 rounded-md"
                >
                    Save
                </button>
            </div>

            <div
                id="editor"
                className="border-2 border-teal-200 rounded-xl max-w-7xl mx-auto py-10 sm:px-0 px-2"
            />
        </div>
    );
};

export default Editor;
