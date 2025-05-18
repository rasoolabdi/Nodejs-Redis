import { config} from "dotenv";
config();

export function random(min , max) {
    try {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    catch(error) {
        return 0;
    }
};

export function toJSON(str) {
    try {
        return JSON.parse(str)
    }
    catch(error) {
        return {};
    }
};

export function isJSON(str) {
    try{
        JSON.parse(str);
    }
    catch(error) {
        return false;
    };
    return true;
};

export function stringify(obj) {
    try {
        return JSON.stringify(obj);
    }
    catch(error) {
        return '';
    }
}

export function toNumber(str) {
    try {
        const ret = Number(str);
        return isNaN(ret) ? 0 : ret;
    }
    catch(error) {
        return 0;
    }
}