import application from "./application.js";

async function main() {
    try {
        await application.run();
    }
    catch(error) {
        console.log(error);
    }
};
main();