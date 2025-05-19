import ioredis from "ioredis";
import { isJSON, stringify, toJSON, toNumber } from "./utils.js";

class Redis {
    #URI = null;
    #redis = null;

    get redis() {
        return this.#redis;
    };

    async connect(URI) {
        try {
            this.#URI = URI;
            this.#redis = new ioredis(this.#URI , {lazyConnect: true});
            await this.#redis.connect();
            return true;
        }
        catch(error){
            return false;
        }
    }

    async set(key , data={} , ex=0) {
        try {
            data = (typeof data === "string") ? data : stringify(data);
            ex = toNumber(ex) > 0 ? ex : 0;
            if(ex > 0) {
                await this.#redis.set(key , data , "EX" , ex);
            }
            else {
                await this.#redis.set(key , data)
            }
        }
        catch(error) {
            return false;
        }
    }

    async get(key) {
        try {
            const result = await this.#redis.get(key);
            if(result) {
                return  isJSON(result) ? toJSON(result) : result
            }
            else {
                return '';
            }
        }
        catch(e) {
            return '';
        }
    };

    async del(key) {
        try {
            await this.#redis.del(key);
            return true
        }
        catch(error) {
            return false;
        }
    }

    async keys(pattern) {
        try {
            return await this.#redis.keys(pattern);
        }
        catch(error) {
            return [];
        }
    }
};

const RedisObject = new Redis();
export { RedisObject as Redis};