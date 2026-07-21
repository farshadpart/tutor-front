import appJson from "./app.json";

const buildNumber = Number(process.env.BUILD_NUMBER ?? 1);

export default {
    ...appJson.expo,

    version: `1.0.${buildNumber}`,

    android: {
        ...appJson.expo.android,
        versionCode: buildNumber,
    },
};