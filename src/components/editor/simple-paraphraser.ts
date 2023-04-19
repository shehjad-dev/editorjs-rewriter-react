import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();

const API_KEY = import.meta.env.VITE_API_KEY;
const API_HOST = import.meta.env.VITE_API_HOST;
const API_URL = import.meta.env.VITE_API_URL;

class SimpleParaphraser {
    data: any;
    constructor({ data }: any) {
        this.data = data;
    }

    static get toolbox(): object {
        return {
            title: "Paraphraser",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          `,
        };
    }

    render() {
        //create elements
        const wrapper = document.createElement("div");
        const paraHeading = document.createElement("h3");
        const paraInput = document.createElement("div");
        paraInput.setAttribute("contenteditable", "true");
        const btnWrapper = document.createElement("div");
        const loadingIcon = document.createElement("div");
        const paraBtn = document.createElement("button");

        loadingIcon.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>`;

        //add classnames for styling
        wrapper.classList.add("paraPhrase-wrapper");
        paraHeading.classList.add("paraPhrase-header");
        paraInput.classList.add("contentEdit");
        paraInput.classList.add("paraPhrase-input");
        btnWrapper.classList.add("paraPhrase-btn-wrapper");
        paraBtn.classList.add("paraphrase-btn");

        //append childs
        wrapper.appendChild(paraHeading);
        wrapper.appendChild(paraInput);
        wrapper.appendChild(btnWrapper);
        btnWrapper.appendChild(paraBtn);

        //initialize texts
        paraHeading.innerHTML = "Paraphraser Block";
        paraBtn.innerHTML = "Rewrite";
        paraInput.innerText = this.data && this.data.text ? this.data.text : "";

        //event listener on input on change
        paraInput.addEventListener("input", (): void => {
            this.saveParaphraseContent(paraInput.innerText);
        });

        //event listener on input to make the input height auto
        paraInput.addEventListener("input", (): void => {
            paraInput.style.height = "auto"; // Reset the height to auto to avoid overflow
            paraInput.style.height = paraInput.scrollHeight + "px";
        });

        //event listener on button click
        paraBtn.addEventListener("click", async (): Promise<void> => {
            paraInput.innerText = "";
            paraInput.appendChild(loadingIcon);
            const data = await this.makeParaphraseReq(wrapper, this.data.text);
            this.saveParaphraseContent(paraInput.innerText);
            if (data.rewrite) {
                paraInput.innerText = data.rewrite;
                notyf.success("Rewrite Successful");
                notyf.success("Dont forget to save!");
            } else {
                paraInput.innerText = this.data.text;
                notyf.error("An error occurred");
            }
        });

        return wrapper;
    }

    makeParaphraseReq = async (
        currWrapper: HTMLDivElement,
        prevText: string
    ) => {
        try {
            const body = { language: "en", strength: 3, text: prevText };

            const options = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "X-RapidAPI-Key": `${API_KEY.toString()}`,
                    "X-RapidAPI-Host": `${API_HOST.toString()}`,
                },
                body: JSON.stringify(body),
            };

            const response = await fetch(`${API_URL.toString()}`, options);
            const data = await response.json();

            return data;
        } catch (error) {
            console.error("error");
            return { eror: "error" };
        }
    };

    saveParaphraseContent(cText: string) {
        this.data = {
            ...this.data,
            text: cText,
        };
    }
    save(blockContent: HTMLDivElement) {
        const input = blockContent?.querySelector(".contentEdit");
        return {
            text: input?.textContent,
        };
    }
}

export default SimpleParaphraser;
