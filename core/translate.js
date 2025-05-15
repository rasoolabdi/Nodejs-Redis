import i18next from "i18next";


class Translate {
    constructor() {
        i18next.init({
            resources: {
                fa: {
                    translation: fa
                },
                en: {
                    translation: en
                }
            }
        });
        i18next.changeLanguage(process.env.APP_URL) ;
    };

    changeLanguage(lang) {
        i18next.changeLanguage(lang);
    };

    t(key , data={}) {
        return i18next.t(key , data);
    }

};
export default new Translate();